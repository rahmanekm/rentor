const express = require('express');
const pool = require('../config/db'); // Import pool from db.js
const { protect, isLandlord } = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const fs = require('fs').promises; // For async file operations
const path = require('path');

// Configure multer. For now, using memoryStorage. 
// For production, consider diskStorage or cloud storage.
// We are not saving the file in this step, just parsing the form.
const upload = multer({ storage: multer.memoryStorage() }); 

// Create Listing (Landlord only)
// Added multer middleware: upload.single('roomImage') to handle the image file
// and populate req.body with text fields.
router.post('/', protect, isLandlord, upload.single('roomImage'), async (req, res) => {
  // Text fields are now in req.body thanks to multer
  // The uploaded file (if any) is in req.file
  const {
    Title, Description, Address, City, State, ZipCode, RoomType,
    Rent, Deposit, AvailableDate, Amenities, LeaseTerms, PetPolicy, SmokingPolicy
  } = req.body; 
  const landlordId = req.user.userId; // From protect middleware
  
  // console.log('Received file:', req.file); // For debugging uploaded file
  // console.log('Received body:', req.body); // For debugging text fields

  // Basic validation
  if (!Title || !Address || !City || !State || !ZipCode || !RoomType || !Rent || !AvailableDate) {
    return res.status(400).json({ message: 'Missing required fields for listing.' });
  }

  let connection; // For transaction
  try {
    connection = await pool.promise().getConnection(); // Get a connection
    await connection.beginTransaction();

    let imageUrl = null;
    if (req.file) {
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(req.file.originalname);
        const filename = `listing-${landlordId}-${uniqueSuffix}${extension}`;
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'listings');
        
        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });
        
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, req.file.buffer);
        imageUrl = `/uploads/listings/${filename}`; // URL path to be stored
        console.log('Image saved to:', filePath);
        console.log('Image URL:', imageUrl);
      } catch (fileError) {
        console.error('Error saving image file:', fileError);
        // Decide if this should be a fatal error for the listing creation
        // For now, we'll proceed without an image if saving fails
      }
    }

    const newListing = {
      LandlordID: landlordId,
      Title,
      ImageUrl: imageUrl, // Add ImageUrl here
      Description,
      Address,
      City,
      State,
      ZipCode,
      RoomType,
      Rent,
      Deposit,
      AvailableDate,
      LeaseTerms,
      PetPolicy,
      SmokingPolicy,
      Status: 'Available' // Default status
    };

    const [result] = await connection.query('INSERT INTO RoomListings SET ?', newListing);
    const listingId = result.insertId;

    // Handle Amenities if provided. Note: Frontend sends array of amenity keys/names.
    // Backend needs to map these to IDs. This logic is NOT YET IMPLEMENTED.
    // For now, this block will likely not execute correctly if Amenities are strings.
    if (Amenities && Array.isArray(Amenities) && Amenities.length > 0) {
      console.log('Received Amenity names for new listing:', Amenities);
      const amenityKeys = Amenities.filter(key => typeof key === 'string'); // Ensure we only process strings

      if (amenityKeys.length > 0) {
        // Create a string like '("wifi", "parking", "laundry")' for the IN clause
        const placeholders = amenityKeys.map(() => '?').join(',');
        const [amenityRows] = await connection.query(
          `SELECT AmenityID, Name FROM Amenities WHERE LOWER(Name) IN (${placeholders})`,
          amenityKeys.map(key => key.toLowerCase()) // Ensure consistent casing for lookup
        );

        const amenityValuesToInsert = amenityRows.map(row => [listingId, row.AmenityID]);
        
        if (amenityValuesToInsert.length > 0) {
          await connection.query('INSERT INTO RoomAmenities (ListingID, AmenityID) VALUES ?', [amenityValuesToInsert]);
          console.log('Saved Amenity IDs:', amenityValuesToInsert.map(val => val[1]));
        } else {
          console.log('No valid Amenity IDs found for the provided names:', amenityKeys);
        }
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Listing created successfully.', listingId });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error during listing creation.' });
  } finally {
    if (connection) connection.release();
  }
});

// Get all listings for the currently authenticated landlord
router.get('/my-listings', protect, isLandlord, async (req, res) => {
  const landlordId = req.user.userId;
  const db = pool.promise();

  try {
    const query = `
      SELECT 
        rl.ListingID, rl.Title, rl.Address, rl.City, rl.State, rl.ZipCode, rl.RoomType, 
        rl.Rent, rl.AvailableDate, rl.Status, rl.ImageUrl, rl.CreatedAt,
        (SELECT GROUP_CONCAT(a.Name SEPARATOR ', ') 
         FROM Amenities a 
         JOIN RoomAmenities ra ON a.AmenityID = ra.AmenityID 
         WHERE ra.ListingID = rl.ListingID) AS AmenitiesNames
      FROM RoomListings rl
      WHERE rl.LandlordID = ?
      ORDER BY rl.CreatedAt DESC
    `;
    const [myListings] = await db.query(query, [landlordId]);
    res.status(200).json({ listings: myListings });
  } catch (error) {
    console.error('Error fetching landlord\'s listings:', error);
    res.status(500).json({ message: 'Server error while fetching your listings.' });
  }
});

// View a specific listing (public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const db = pool.promise(); // Use pool

  try {
    const listingQuery = `
      SELECT 
        rl.*, 
        u.Name AS LandlordName, 
        u.Email AS LandlordEmail, 
        u.PhoneNumber AS LandlordPhoneNumber,
        u.ProfilePictureURL AS LandlordProfilePictureURL
      FROM RoomListings rl
      JOIN Users u ON rl.LandlordID = u.UserID
      WHERE rl.ListingID = ?
    `;
    const [listings] = await db.query(listingQuery, [id]);

    if (listings.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    const listing = listings[0];

    // Fetch amenities for the listing
    const amenitiesQuery = `
      SELECT a.AmenityID, a.Name, a.Description 
      FROM Amenities a
      JOIN RoomAmenities ra ON a.AmenityID = ra.AmenityID
      WHERE ra.ListingID = ?
    `;
    const [amenities] = await db.query(amenitiesQuery, [id]);
    listing.Amenities = amenities;
    
    // In a real app, you might want to exclude sensitive landlord info unless specifically needed by the context
    // For now, returning basic landlord contact info.

    res.status(200).json(listing);

  } catch (error) {
    console.error('Get listing by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching listing.' });
  }
});

// Edit a listing (Landlord only, owner)
// Added multer middleware: upload.single('roomImage') to handle potential image file
// and populate req.body with text fields.
router.put('/:id', protect, isLandlord, upload.single('roomImage'), async (req, res) => {
  const { id: listingId } = req.params;
  const landlordId = req.user.userId;
  // Text fields are now in req.body thanks to multer
  // The uploaded file (if any) is in req.file (we are not processing req.file for updates yet)
  const {
    Title, Description, Address, City, State, ZipCode, RoomType,
    Rent, Deposit, AvailableDate, Amenities, LeaseTerms, PetPolicy, SmokingPolicy, Status
  } = req.body;

  // Basic validation: Ensure at least one field is being updated, or require all for simplicity here.
  // For a PUT request, typically all fields are expected, or it's treated as a full replacement.
  // For partial updates, PATCH is more appropriate. Here, we'll assume a full update is intended.
  if (!Title || !Address || !City || !State || !ZipCode || !RoomType || !Rent || !AvailableDate || !Status) {
    return res.status(400).json({ message: 'Missing required fields for updating listing.' });
  }
  
  let connection; // For transaction
  try {
    connection = await pool.promise().getConnection(); // Get a connection
    // Check if the listing exists and belongs to the landlord
    const [existingListings] = await connection.query('SELECT LandlordID FROM RoomListings WHERE ListingID = ?', [listingId]);
    if (existingListings.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    if (existingListings[0].LandlordID !== landlordId) {
      return res.status(403).json({ message: 'Not authorized to edit this listing.' });
    }

    await connection.beginTransaction();

    let newImageUrl = null;
    let oldImageUrl = null;

    // Fetch old image URL first to delete it later if a new image is uploaded
    const [currentListingArr] = await connection.query('SELECT ImageUrl FROM RoomListings WHERE ListingID = ?', [listingId]);
    if (currentListingArr.length > 0) {
      oldImageUrl = currentListingArr[0].ImageUrl;
    }

    if (req.file) { // A new image is being uploaded
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(req.file.originalname);
        const filename = `listing-${landlordId}-${uniqueSuffix}${extension}`; // Use landlordId for some uniqueness
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'listings');
        
        await fs.mkdir(uploadDir, { recursive: true }); // Ensure directory exists
        
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, req.file.buffer);
        newImageUrl = `/uploads/listings/${filename}`; // URL path to be stored
        console.log('New image saved to:', filePath);
        console.log('New image URL:', newImageUrl);
      } catch (fileError) {
        console.error('Error saving new image file during update:', fileError);
        // Decide if this should be a fatal error. For now, proceed without updating image if save fails.
      }
    }

    const updatedListingData = {
      Title, Description, Address, City, State, ZipCode, RoomType,
      Rent, Deposit, AvailableDate, LeaseTerms, PetPolicy, SmokingPolicy, Status
    };

    if (newImageUrl) {
      updatedListingData.ImageUrl = newImageUrl;
    }
    // If newImageUrl is null (no new file uploaded), ImageUrl field is not included, 
    // so existing ImageUrl in DB remains unchanged.

    await connection.query('UPDATE RoomListings SET ? WHERE ListingID = ?', [updatedListingData, listingId]);

    // If a new image was successfully uploaded and saved, and there was an old image, delete the old one.
    if (newImageUrl && oldImageUrl) {
      try {
        const oldFilePath = path.join(__dirname, '..', 'public', oldImageUrl); // Assumes oldImageUrl is like /uploads/listings/file.jpg
        await fs.unlink(oldFilePath);
        console.log('Old image deleted:', oldFilePath);
      } catch (deleteError) {
        console.error('Error deleting old image file:', deleteError);
        // Non-fatal, as the main update succeeded. Log it.
      }
    }

    // Handle Amenities: Delete existing and insert new ones
    // This is a simple approach; more complex logic might be needed for partial amenity updates.
    // This also assumes Amenities is an array of IDs. Needs fixing if names are sent.
    await connection.query('DELETE FROM RoomAmenities WHERE ListingID = ?', [listingId]);
    if (Amenities && Array.isArray(Amenities) && Amenities.length > 0) {
      console.log('Received Amenity names for update:', Amenities);
      const amenityKeys = Amenities.filter(key => typeof key === 'string');

      if (amenityKeys.length > 0) {
        const placeholders = amenityKeys.map(() => '?').join(',');
        const [amenityRows] = await connection.query(
          `SELECT AmenityID, Name FROM Amenities WHERE LOWER(Name) IN (${placeholders})`,
          amenityKeys.map(key => key.toLowerCase())
        );
        
        const amenityValuesToInsert = amenityRows.map(row => [listingId, row.AmenityID]);

        if (amenityValuesToInsert.length > 0) {
          await connection.query('INSERT INTO RoomAmenities (ListingID, AmenityID) VALUES ?', [amenityValuesToInsert]);
          console.log('Updated Amenity IDs:', amenityValuesToInsert.map(val => val[1]));
        } else {
          console.log('No valid Amenity IDs found for update with names:', amenityKeys);
        }
      }
    }

    await connection.commit();
    res.status(200).json({ message: 'Listing updated successfully.', listingId });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error during listing update.' });
  } finally {
    if (connection) connection.release();
  }
});

// Delete a listing (Landlord only, owner)
router.delete('/:id', protect, isLandlord, async (req, res) => {
  const { id: listingId } = req.params;
  const landlordId = req.user.userId;
  const db = pool.promise(); // Use pool

  try {
    // Check if the listing exists and belongs to the landlord
    const [existingListings] = await db.query('SELECT LandlordID FROM RoomListings WHERE ListingID = ?', [listingId]);
    if (existingListings.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    if (existingListings[0].LandlordID !== landlordId) {
      return res.status(403).json({ message: 'Not authorized to delete this listing.' });
    }

    // Deleting a listing will also cascade delete related RoomAmenities, Applications, and Favorites due to DB constraints.
    // Messages linked to applications for this listing will have ApplicationID set to NULL.
    await db.query('DELETE FROM RoomListings WHERE ListingID = ?', [listingId]);

    res.status(200).json({ message: 'Listing deleted successfully.' });

  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error during listing deletion.' });
  }
});

// Manage listing status (Landlord only, owner)
router.patch('/:id/status', protect, isLandlord, async (req, res) => {
  const { id: listingId } = req.params;
  const landlordId = req.user.userId;
  const { Status } = req.body;

  if (!Status || !['Available', 'Unavailable', 'Pending'].includes(Status)) {
    return res.status(400).json({ message: 'Invalid or missing status. Must be Available, Unavailable, or Pending.' });
  }

  const db = pool.promise(); // Use pool
  try {
    // Check if the listing exists and belongs to the landlord
    const [existingListings] = await db.query('SELECT LandlordID FROM RoomListings WHERE ListingID = ?', [listingId]);
    if (existingListings.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    if (existingListings[0].LandlordID !== landlordId) {
      return res.status(403).json({ message: 'Not authorized to update status for this listing.' });
    }

    await db.query('UPDATE RoomListings SET Status = ? WHERE ListingID = ?', [Status, listingId]);
    res.status(200).json({ message: `Listing status updated to ${Status}.`, listingId, Status });

  } catch (error) {
    console.error('Update listing status error:', error);
    res.status(500).json({ message: 'Server error during listing status update.' });
  }
});

// Search and Filter Listings (public)
router.get('/', async (req, res) => {
  const {
    city, state, zipCode, address,
    minPrice, maxPrice,
    roomType,
    availableDate, // Expects YYYY-MM-DD
    amenities, // Expects comma-separated string of AmenityIDs e.g., "1,2,3"
    sortBy, // e.g., 'rent_asc', 'rent_desc', 'date_new'
    page = 1,
    limit = 10
  } = req.query;

  let query = `
    SELECT 
      rl.ListingID, rl.Title, rl.Address, rl.City, rl.State, rl.ZipCode, rl.RoomType, 
      rl.Rent, rl.AvailableDate, rl.Status, rl.ImageUrl AS ImageUrl, -- Explicitly alias
      (SELECT GROUP_CONCAT(a.Name SEPARATOR ', ') 
       FROM Amenities a 
       JOIN RoomAmenities ra ON a.AmenityID = ra.AmenityID 
       WHERE ra.ListingID = rl.ListingID) AS AmenitiesNames,
      u.Name AS LandlordName 
    FROM RoomListings rl
    JOIN Users u ON rl.LandlordID = u.UserID
    WHERE rl.Status = 'Available' 
  `; // Only show available listings by default in public search
  
  const queryParams = [];

  if (city) {
    query += ' AND rl.City LIKE ?';
    queryParams.push(`%${city}%`);
  }
  if (state) {
    query += ' AND rl.State LIKE ?';
    queryParams.push(`%${state}%`);
  }
  if (zipCode) {
    query += ' AND rl.ZipCode LIKE ?';
    queryParams.push(`%${zipCode}%`);
  }
  if (address) { // Simple address search
    query += ' AND rl.Address LIKE ?';
    queryParams.push(`%${address}%`);
  }
  if (minPrice) {
    query += ' AND rl.Rent >= ?';
    queryParams.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    query += ' AND rl.Rent <= ?';
    queryParams.push(parseFloat(maxPrice));
  }
  if (roomType) {
    query += ' AND rl.RoomType = ?';
    queryParams.push(roomType);
  }
  if (availableDate) {
    query += ' AND rl.AvailableDate <= ?'; // Rooms available on or before this date
    queryParams.push(availableDate);
  }

  // Amenities filter: This is a bit more complex.
  // We need to find listings that have ALL specified amenities.
  if (amenities) {
    const amenityIds = amenities.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (amenityIds.length > 0) {
      query += `
        AND rl.ListingID IN (
          SELECT ra.ListingID
          FROM RoomAmenities ra
          WHERE ra.AmenityID IN (${amenityIds.join(',')})
          GROUP BY ra.ListingID
          HAVING COUNT(DISTINCT ra.AmenityID) = ?
        )
      `;
      queryParams.push(amenityIds.length);
    }
  }

  // Sorting
  if (sortBy === 'rent_asc') {
    query += ' ORDER BY rl.Rent ASC';
  } else if (sortBy === 'rent_desc') {
    query += ' ORDER BY rl.Rent DESC';
  } else if (sortBy === 'date_new') {
    query += ' ORDER BY rl.AvailableDate ASC, rl.CreatedAt DESC'; // Or just CreatedAt DESC
  } else {
    query += ' ORDER BY rl.CreatedAt DESC'; // Default sort
  }

  // Pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ' LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), offset);

  const db = pool.promise(); // Use pool
  try {
    const [listings] = await db.query(query, queryParams);
    
    // For a full-fledged app, you'd also want a count for pagination totals
    // let countQuery = `SELECT COUNT(*) as total FROM RoomListings rl WHERE rl.Status = 'Available' ... (apply same filters without pagination/sorting)`;
    // const [totalRows] = await db.query(countQuery, paramsForCountQuery);
    // const totalListings = totalRows[0].total;

    res.status(200).json({ 
      listings, 
      // currentPage: parseInt(page), 
      // totalPages: Math.ceil(totalListings / parseInt(limit)),
      // totalListings 
    });
  } catch (error) {
    console.error('Search listings error:', error);
    res.status(500).json({ message: 'Server error during listing search.' });
  }
});

module.exports = router;
