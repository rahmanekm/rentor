const express = require('express');
const pool = require('../config/db'); // Import pool from db.js
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const fs = require('fs').promises; // For async file operations
const path = require('path');

// Multer setup for profile picture uploads
const profileUpload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File type not supported. Only JPEG, PNG, GIF are allowed.'));
  }
});

// Middleware to check if user is a Tenant
const isTenant = (req, res, next) => {
  if (req.user && req.user.userType === 'Tenant') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized. Tenant access required.' });
  }
};

// Get current user's profile
router.get('/profile', protect, async (req, res) => {
  const userId = req.user.userId;
  const db = pool.promise(); // Use pool
  try {
    // Exclude password from the result, include new flatmate fields
    const [users] = await db.query(
      'SELECT UserID, Name, Email, PhoneNumber, UserType, ProfilePictureURL, Bio, PropertyName, PropertyAddress, EmailVerified, CreatedAt, LookingForDescription, BudgetMin, BudgetMax, PreferredLocations, FlatmateMoveInDate, IsActivelyLooking FROM Users WHERE UserID = ?', 
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
});

// Update current user's profile
// Added profileUpload.single('profileImage') middleware
router.put('/profile', protect, profileUpload.single('profileImage'), async (req, res) => {
  const userId = req.user.userId;
  // Text fields are in req.body, uploaded file (if any) is in req.file
  const { 
    Name, PhoneNumber, Bio, PropertyName, PropertyAddress, // ProfilePictureURL will be handled by file upload
    LookingForDescription, BudgetMin, BudgetMax, PreferredLocations, FlatmateMoveInDate, IsActivelyLooking 
  } = req.body;
  const userType = req.user.userType; // Get userType from token

  const fieldsToUpdate = {};
  // Existing fields (excluding ProfilePictureURL as it's handled separately)
  if (Name !== undefined) fieldsToUpdate.Name = Name;
  if (PhoneNumber !== undefined) fieldsToUpdate.PhoneNumber = PhoneNumber;
  // if (ProfilePictureURL !== undefined) fieldsToUpdate.ProfilePictureURL = ProfilePictureURL; // Old way: text URL
  if (Bio !== undefined) fieldsToUpdate.Bio = Bio;

  // Landlord-specific
  if (userType === 'Landlord') {
    if (PropertyName !== undefined) fieldsToUpdate.PropertyName = PropertyName;
    if (PropertyAddress !== undefined) fieldsToUpdate.PropertyAddress = PropertyAddress;
  }

  // New flatmate-specific fields
  if (LookingForDescription !== undefined) fieldsToUpdate.LookingForDescription = LookingForDescription;
  if (BudgetMin !== undefined) fieldsToUpdate.BudgetMin = BudgetMin === '' ? null : parseInt(BudgetMin, 10);
  if (BudgetMax !== undefined) fieldsToUpdate.BudgetMax = BudgetMax === '' ? null : parseInt(BudgetMax, 10);
  if (PreferredLocations !== undefined) fieldsToUpdate.PreferredLocations = PreferredLocations;
  if (FlatmateMoveInDate !== undefined) fieldsToUpdate.FlatmateMoveInDate = FlatmateMoveInDate === '' ? null : FlatmateMoveInDate;
  if (IsActivelyLooking !== undefined) fieldsToUpdate.IsActivelyLooking = Boolean(IsActivelyLooking);


  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: 'No fields provided for update.' });
  }

  const db = pool.promise(); // Use pool
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Handle profile picture upload
    if (req.file) {
      // Fetch old ProfilePictureURL to delete the old file
      const [currentUserArr] = await connection.query('SELECT ProfilePictureURL FROM Users WHERE UserID = ?', [userId]);
      const oldProfilePictureUrl = currentUserArr.length > 0 ? currentUserArr[0].ProfilePictureURL : null;

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(req.file.originalname);
      const filename = `profile-${userId}-${uniqueSuffix}${extension}`;
      const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'profiles');
      
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, req.file.buffer);
      
      fieldsToUpdate.ProfilePictureURL = `/uploads/profiles/${filename}`; // Store new URL
      console.log('Profile picture saved:', fieldsToUpdate.ProfilePictureURL);

      // Delete old profile picture if it existed and is not a placeholder/external URL
      if (oldProfilePictureUrl && oldProfilePictureUrl.startsWith('/uploads/profiles/')) {
        try {
          const oldFilePath = path.join(__dirname, '..', 'public', oldProfilePictureUrl);
          await fs.unlink(oldFilePath);
          console.log('Old profile picture deleted:', oldFilePath);
        } catch (deleteError) {
          console.error('Error deleting old profile picture:', deleteError);
          // Non-fatal, continue with profile update
        }
      }
    } else if (req.body.ProfilePictureURL === '' || req.body.ProfilePictureURL === null) {
      // If frontend explicitly sends empty string or null for ProfilePictureURL (e.g. to remove it without uploading new)
      // This part depends on how frontend handles "remove picture"
      // For now, if no file is uploaded, we don't change ProfilePictureURL unless explicitly cleared.
      // If ProfilePictureURL field is sent as empty in req.body, and no file, it means clear it.
      if (req.body.hasOwnProperty('ProfilePictureURL') && (req.body.ProfilePictureURL === '' || req.body.ProfilePictureURL === null)) {
        fieldsToUpdate.ProfilePictureURL = null;
         // Also delete the file if it was a server-hosted one
        const [currentUserArr] = await connection.query('SELECT ProfilePictureURL FROM Users WHERE UserID = ?', [userId]);
        const oldProfilePictureUrl = currentUserArr.length > 0 ? currentUserArr[0].ProfilePictureURL : null;
        if (oldProfilePictureUrl && oldProfilePictureUrl.startsWith('/uploads/profiles/')) {
            try {
                const oldFilePath = path.join(__dirname, '..', 'public', oldProfilePictureUrl);
                await fs.unlink(oldFilePath);
                console.log('Profile picture deleted due to explicit clear:', oldFilePath);
            } catch (deleteError) {
                console.error('Error deleting profile picture on clear:', deleteError);
            }
        }
      }
    }


    if (Object.keys(fieldsToUpdate).length > 0) {
      await connection.query('UPDATE Users SET ? WHERE UserID = ?', [fieldsToUpdate, userId]);
    } else if (!req.file) { // No text fields to update and no file uploaded
        return res.status(200).json({ message: 'No changes to update.' });
    }
    
    await connection.commit();
    // Fetch the updated profile to return it, including the new ProfilePictureURL if changed
    const [updatedUsers] = await connection.query(
        'SELECT UserID, Name, Email, PhoneNumber, UserType, ProfilePictureURL, Bio, PropertyName, PropertyAddress, EmailVerified, CreatedAt, LookingForDescription, BudgetMin, BudgetMax, PreferredLocations, FlatmateMoveInDate, IsActivelyLooking FROM Users WHERE UserID = ?',
        [userId]
    );
    
    const updatedUser = updatedUsers[0];
    // Standardize the response to use lowercase keys consistent with login response
    const userResponse = {
        userId: updatedUser.UserID,
        name: updatedUser.Name,
        email: updatedUser.Email,
        phoneNumber: updatedUser.PhoneNumber,
        userType: updatedUser.UserType,
        profilePictureURL: updatedUser.ProfilePictureURL,
        bio: updatedUser.Bio,
        propertyName: updatedUser.PropertyName,
        propertyAddress: updatedUser.PropertyAddress,
        emailVerified: updatedUser.EmailVerified,
        lookingForDescription: updatedUser.LookingForDescription,
        budgetMin: updatedUser.BudgetMin,
        budgetMax: updatedUser.BudgetMax,
        preferredLocations: updatedUser.PreferredLocations,
        flatmateMoveInDate: updatedUser.FlatmateMoveInDate,
        isActivelyLooking: updatedUser.IsActivelyLooking
        // Ensure all relevant fields are mapped
    };

    res.status(200).json({ message: 'Profile updated successfully.', user: userResponse });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Update profile error:', error); // Log the full error object
    
    if (error instanceof multer.MulterError) { // More robust check for Multer errors
      return res.status(400).json({ message: error.message }); // Send specific Multer message
    }
    // Check if it's the custom error from fileFilter
    if (error.message && error.message.startsWith('File type not supported')) {
        return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error during profile update.' });
  } finally {
    if (connection) connection.release();
  }
});

// --- Favorites Routes (Tenant Only) ---

// Add a listing to favorites
router.post('/favorites', protect, isTenant, async (req, res) => {
  const tenantId = req.user.userId;
  const { ListingID } = req.body;

  if (!ListingID) {
    return res.status(400).json({ message: 'ListingID is required.' });
  }
  const db = pool.promise(); // Use pool
  try {
    // Check if listing exists
    const [listings] = await db.query('SELECT ListingID FROM RoomListings WHERE ListingID = ?', [ListingID]);
    if (listings.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Check if already favorited
    const [existingFavorites] = await db.query('SELECT FavoriteID FROM Favorites WHERE TenantID = ? AND ListingID = ?', [tenantId, ListingID]);
    if (existingFavorites.length > 0) {
      return res.status(409).json({ message: 'Listing already in favorites.' });
    }

    await db.query('INSERT INTO Favorites (TenantID, ListingID) VALUES (?, ?)', [tenantId, ListingID]);
    res.status(201).json({ message: 'Listing added to favorites.' });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Server error while adding to favorites.' });
  }
});

// Remove a listing from favorites
router.delete('/favorites/:listingId', protect, isTenant, async (req, res) => {
  const tenantId = req.user.userId;
  const { listingId } = req.params;
  const db = pool.promise(); // Use pool
  try {
    const [result] = await db.query('DELETE FROM Favorites WHERE TenantID = ? AND ListingID = ?', [tenantId, listingId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorite not found or already removed.' });
    }
    res.status(200).json({ message: 'Listing removed from favorites.' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Server error while removing from favorites.' });
  }
});

// Get tenant's favorite listings
router.get('/favorites', protect, isTenant, async (req, res) => {
  const tenantId = req.user.userId;
  const db = pool.promise(); // Use pool
  try {
    const query = `
      SELECT rl.*, 
             (SELECT GROUP_CONCAT(a.Name SEPARATOR ', ') 
              FROM Amenities a 
              JOIN RoomAmenities ra ON a.AmenityID = ra.AmenityID 
              WHERE ra.ListingID = rl.ListingID) AS AmenitiesNames,
             u.Name AS LandlordName
      FROM Favorites f
      JOIN RoomListings rl ON f.ListingID = rl.ListingID
      JOIN Users u ON rl.LandlordID = u.UserID
      WHERE f.TenantID = ? AND rl.Status = 'Available'
      ORDER BY f.SavedAt DESC
    `;
    const [favorites] = await db.query(query, [tenantId]);
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error while fetching favorites.' });
  }
});

// Delete current user's profile
router.delete('/profile', protect, async (req, res) => {
  const userId = req.user.userId;
  const db = pool.promise();

  try {
    // The database schema has ON DELETE CASCADE for related tables (RoomListings, Applications, Messages, Favorites)
    // So, deleting the user should automatically clean up their associated data.
    const [result] = await db.query('DELETE FROM Users WHERE UserID = ?', [userId]);

    if (result.affectedRows === 0) {
      // This case should ideally not happen if protect middleware ensures user exists
      return res.status(404).json({ message: 'User not found for deletion.' });
    }

    // No need to clear JWT from client here, client should handle logout after this call.
    res.status(200).json({ message: 'User profile deleted successfully.' });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Server error during profile deletion.' });
  }
});

// Search for users looking for flatmates
router.get('/flatmate-search', async (req, res) => {
  const {
    preferred_locations, // Simple text search for now
    budget_min,
    budget_max,
    move_in_date, // Users looking to move in on or after this date
    page = 1,
    limit = 10 // Revert to 10 profiles per page
  } = req.query;

  let query = `
    SELECT 
      UserID, Name, ProfilePictureURL, Bio, 
      LookingForDescription, BudgetMin, BudgetMax, PreferredLocations, FlatmateMoveInDate 
    FROM Users 
    WHERE IsActivelyLooking = TRUE
  `;
  const queryParams = [];
  const countQueryParams = []; // Separate params for count query as it won't have LIMIT/OFFSET

  let baseQuery = 'FROM Users WHERE IsActivelyLooking = TRUE';
  let conditions = '';

  if (preferred_locations) {
    conditions += ' AND PreferredLocations LIKE ?';
    queryParams.push(`%${preferred_locations}%`);
    countQueryParams.push(`%${preferred_locations}%`);
  }
  if (budget_min) {
    conditions += ' AND BudgetMax >= ?'; 
    queryParams.push(parseInt(budget_min, 10));
    countQueryParams.push(parseInt(budget_min, 10));
  }
  if (budget_max) {
    conditions += ' AND BudgetMin <= ?'; 
    queryParams.push(parseInt(budget_max, 10));
    countQueryParams.push(parseInt(budget_max, 10));
  }
  if (move_in_date) {
    conditions += ' AND FlatmateMoveInDate >= ?'; 
    queryParams.push(move_in_date);
    countQueryParams.push(move_in_date);
  }
  
  baseQuery += conditions;

  // TODO: Add sorting options if needed
  let orderByClause = ' ORDER BY CreatedAt DESC'; // Default sort

  // Pagination
  const currentPage = parseInt(page, 10);
  const itemsLimit = parseInt(limit, 10);
  const offset = (currentPage - 1) * itemsLimit;
  
  const dataQuery = `SELECT UserID, Name, ProfilePictureURL, Bio, LookingForDescription, BudgetMin, BudgetMax, PreferredLocations, FlatmateMoveInDate ${baseQuery} ${orderByClause} LIMIT ? OFFSET ?`;
  queryParams.push(itemsLimit, offset);

  const countQuery = `SELECT COUNT(*) as totalProfiles ${baseQuery}`;

  try {
    const [profiles] = await pool.promise().query(dataQuery, queryParams);
    const [totalRows] = await pool.promise().query(countQuery, countQueryParams);
    const totalProfiles = totalRows[0].totalProfiles;

    res.status(200).json({ 
      profiles,
      currentPage,
      totalPages: Math.ceil(totalProfiles / itemsLimit),
      totalProfiles
    });
  } catch (error) {
    console.error('Flatmate search error:', error);
    res.status(500).json({ message: 'Server error during flatmate search.' });
  }
});


module.exports = router;
