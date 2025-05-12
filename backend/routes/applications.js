const express = require('express');
const pool = require('../config/db'); // Import pool from db.js
const { protect } = require('../middleware/authMiddleware'); // General protection
const router = express.Router();

// Middleware to check if user is a Tenant
const isTenant = (req, res, next) => {
  if (req.user && req.user.userType === 'Tenant') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized. Tenant access required.' });
  }
};

// Middleware to check if user is a Landlord (can be imported from authMiddleware if preferred)
const isLandlord = (req, res, next) => {
    if (req.user && req.user.userType === 'Landlord') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized. Landlord access required.' });
    }
  };

// Apply for a Room (Tenant only)
router.post('/', protect, isTenant, async (req, res) => {
  const { ListingID, Message } = req.body;
  const tenantId = req.user.userId;

  if (!ListingID) {
    return res.status(400).json({ message: 'ListingID is required.' });
  }

  const db = pool.promise(); // Use pool
  try {
    // Check if listing exists and is available
    const [listings] = await db.query('SELECT Status FROM RoomListings WHERE ListingID = ?', [ListingID]);
    if (listings.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    if (listings[0].Status !== 'Available') {
      return res.status(400).json({ message: 'This listing is not currently available for applications.' });
    }
    
    // Check if tenant has already applied for this listing
    const [existingApplications] = await db.query(
      'SELECT ApplicationID FROM Applications WHERE ListingID = ? AND TenantID = ?',
      [ListingID, tenantId]
    );
    if (existingApplications.length > 0) {
      return res.status(409).json({ message: 'You have already applied for this listing.' });
    }

    const newApplication = {
      ListingID,
      TenantID: tenantId,
      Message,
      Status: 'Pending' // Default status
    };
    const [result] = await db.query('INSERT INTO Applications SET ?', newApplication);
    res.status(201).json({ message: 'Application submitted successfully.', applicationId: result.insertId });
  } catch (error) {
    console.error('Apply for room error:', error);
    res.status(500).json({ message: 'Server error during application submission.' });
  }
});

// Get applications for a specific listing (Landlord only, owner of listing)
router.get('/listing/:listingId', protect, isLandlord, async (req, res) => {
  const { listingId } = req.params;
  const landlordId = req.user.userId;
  const db = pool.promise(); // Use pool

  try {
    // Verify landlord owns the listing
    const [listingCheck] = await db.query('SELECT LandlordID FROM RoomListings WHERE ListingID = ?', [listingId]);
    if (listingCheck.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    if (listingCheck[0].LandlordID !== landlordId) {
      return res.status(403).json({ message: 'Not authorized to view applications for this listing.' });
    }

    const applicationsQuery = `
      SELECT app.*, u.Name AS TenantName, u.Email AS TenantEmail, u.PhoneNumber AS TenantPhoneNumber, u.ProfilePictureURL AS TenantProfilePictureURL, u.Bio AS TenantBio
      FROM Applications app
      JOIN Users u ON app.TenantID = u.UserID
      WHERE app.ListingID = ?
      ORDER BY app.ApplicationDate DESC
    `;
    const [applications] = await db.query(applicationsQuery, [listingId]);
    res.status(200).json(applications);
  } catch (error) {
    console.error('Get applications for listing error:', error);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
});

// Get applications submitted by the current tenant (Tenant only)
router.get('/my-applications', protect, isTenant, async (req, res) => {
  const tenantId = req.user.userId;
  const db = pool.promise(); // Use pool
  try {
    const query = `
      SELECT app.*, rl.Title AS ListingTitle, rl.Address AS ListingAddress, rl.City AS ListingCity, rl.State AS ListingState
      FROM Applications app
      JOIN RoomListings rl ON app.ListingID = rl.ListingID
      WHERE app.TenantID = ?
      ORDER BY app.ApplicationDate DESC
    `;
    const [applications] = await db.query(query, [tenantId]);
    res.status(200).json(applications);
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error while fetching your applications.' });
  }
});

// Update application status (Landlord only, owner of listing related to application)
router.patch('/:applicationId/status', protect, isLandlord, async (req, res) => {
  const { applicationId } = req.params;
  const { Status } = req.body; // Expected: 'Accepted' or 'Rejected'
  const landlordId = req.user.userId;

  if (!Status || !['Accepted', 'Rejected'].includes(Status)) {
    return res.status(400).json({ message: 'Invalid status. Must be Accepted or Rejected.' });
  }

  const db = pool.promise(); // Use pool
  try {
    // Verify landlord owns the listing associated with the application
    const [appCheck] = await db.query(
      `SELECT app.ApplicationID, rl.LandlordID 
       FROM Applications app
       JOIN RoomListings rl ON app.ListingID = rl.ListingID
       WHERE app.ApplicationID = ?`,
      [applicationId]
    );

    if (appCheck.length === 0) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    if (appCheck[0].LandlordID !== landlordId) {
      return res.status(403).json({ message: 'Not authorized to update this application.' });
    }

    await db.query('UPDATE Applications SET Status = ? WHERE ApplicationID = ?', [Status, applicationId]);
    
    // Optional: If 'Accepted', mark other pending applications for the same listing as 'Unavailable' or similar logic.
    // For now, just updating the specific application.

    res.status(200).json({ message: `Application status updated to ${Status}.` });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error during application status update.' });
  }
});

module.exports = router;
