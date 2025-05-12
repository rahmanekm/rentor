const express = require('express');
const pool = require('../config/db'); // Import pool from db.js
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Send a message
router.post('/', protect, async (req, res) => {
  const senderId = req.user.userId;
  const { ReceiverID, MessageContent, ApplicationID } = req.body; // ApplicationID is optional

  if (!ReceiverID || !MessageContent) {
    return res.status(400).json({ message: 'ReceiverID and MessageContent are required.' });
  }
  if (senderId === parseInt(ReceiverID)) {
    return res.status(400).json({ message: 'Cannot send a message to yourself.' });
  }

  const db = pool.promise(); // Use pool
  try {
    // Verify receiver exists
    const [receiverCheck] = await db.query('SELECT UserID FROM Users WHERE UserID = ?', [ReceiverID]);
    if (receiverCheck.length === 0) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }
    
    // If ApplicationID is provided, verify it exists and sender/receiver are related to it (optional, for context)
    if (ApplicationID) {
        const [appCheck] = await db.query(
            'SELECT ListingID, TenantID, (SELECT LandlordID FROM RoomListings WHERE ListingID = app.ListingID) AS LandlordID FROM Applications app WHERE ApplicationID = ?', 
            [ApplicationID]
        );
        if (appCheck.length === 0) {
            return res.status(404).json({ message: 'Associated application not found.' });
        }
        // Ensure sender and receiver are the tenant and landlord of the application
        const { TenantID, LandlordID } = appCheck[0];
        const participants = [TenantID, LandlordID];
        if (!participants.includes(senderId) || !participants.includes(parseInt(ReceiverID))) {
            return res.status(403).json({ message: 'Sender or Receiver not authorized for this application context.' });
        }
    }


    const newMessage = {
      SenderID: senderId,
      ReceiverID,
      MessageContent,
      ApplicationID: ApplicationID || null, // Store null if not provided
    };
    const [result] = await db.query('INSERT INTO Messages SET ?', newMessage);
    res.status(201).json({ message: 'Message sent successfully.', messageId: result.insertId });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error while sending message.' });
  }
});

// Get messages in a conversation between current user and another user
router.get('/conversation/:otherUserId', protect, async (req, res) => {
  const currentUserId = req.user.userId;
  const otherUserId = parseInt(req.params.otherUserId);

  if (isNaN(otherUserId)) {
    return res.status(400).json({ message: 'Invalid otherUserId.' });
  }
  if (currentUserId === otherUserId) {
    return res.status(400).json({ message: 'Cannot fetch conversation with yourself.'});
  }

  const db = pool.promise(); // Use pool
  try {
    const query = `
      SELECT m.*, s.Name AS SenderName, r.Name AS ReceiverName 
      FROM Messages m
      JOIN Users s ON m.SenderID = s.UserID
      JOIN Users r ON m.ReceiverID = r.UserID
      WHERE (m.SenderID = ? AND m.ReceiverID = ?) OR (m.SenderID = ? AND m.ReceiverID = ?)
      ORDER BY m.SentAt ASC
    `;
    const [messages] = await db.query(query, [currentUserId, otherUserId, otherUserId, currentUserId]);
    
    // Mark messages sent by otherUser to currentUser as read
    // This could also be a separate PATCH request if preferred for explicit read receipts
    await db.query(
        'UPDATE Messages SET ReadStatus = TRUE WHERE ReceiverID = ? AND SenderID = ? AND ReadStatus = FALSE',
        [currentUserId, otherUserId]
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error while fetching conversation.' });
  }
});

// Get a list of conversations for the current user
router.get('/my-conversations', protect, async (req, res) => {
  const currentUserId = req.user.userId;
  const db = pool.promise(); // Use pool
  try {
    // This query gets the latest message for each conversation partner
    const query = `
      SELECT 
        u.UserID AS PartnerID,
        u.Name AS PartnerName,
        u.ProfilePictureURL AS PartnerProfilePictureURL,
        m.MessageContent AS LastMessage,
        m.SentAt AS LastMessageSentAt,
        m.ReadStatus AS LastMessageReadStatus,
        m.SenderID AS LastMessageSenderID,
        (SELECT COUNT(*) FROM Messages WHERE ReceiverID = ? AND SenderID = u.UserID AND ReadStatus = FALSE) AS UnreadCount
      FROM Messages m
      JOIN Users u ON (CASE WHEN m.SenderID = ? THEN m.ReceiverID ELSE m.SenderID END) = u.UserID
      WHERE (m.SenderID = ? OR m.ReceiverID = ?)
      AND m.SentAt = (
          SELECT MAX(m2.SentAt) 
          FROM Messages m2 
          WHERE (m2.SenderID = m.SenderID AND m2.ReceiverID = m.ReceiverID) 
             OR (m2.SenderID = m.ReceiverID AND m2.ReceiverID = m.SenderID)
      )
      GROUP BY u.UserID, u.Name, u.ProfilePictureURL, m.MessageContent, m.SentAt, m.ReadStatus, m.SenderID
      ORDER BY LastMessageSentAt DESC
    `;
    // The query above is complex and might need optimization for large datasets.
    // A simpler approach might be to just list distinct partners and then fetch last message separately if needed.
    // For now, this aims to provide a summary.
    const [conversations] = await db.query(query, [currentUserId, currentUserId, currentUserId, currentUserId]);
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Get my conversations error:', error);
    res.status(500).json({ message: 'Server error while fetching conversations.' });
  }
});


// Mark a message as read (Receiver only)
// This is implicitly handled by GET /conversation/:otherUserId for now.
// If explicit marking is needed:
router.patch('/:messageId/read', protect, async (req, res) => {
    const { messageId } = req.params;
    const currentUserId = req.user.userId;
    const db = pool.promise(); // Use pool

    try {
        const [result] = await db.query(
            'UPDATE Messages SET ReadStatus = TRUE WHERE MessageID = ? AND ReceiverID = ? AND ReadStatus = FALSE',
            [messageId, currentUserId]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Message marked as read.' });
        } else {
            // Could be already read, or not the receiver, or message doesn't exist
            res.status(404).json({ message: 'Message not found, not receivable by user, or already read.' });
        }
    } catch (error) {
        console.error('Mark message read error:', error);
        res.status(500).json({ message: 'Server error while marking message as read.' });
    }
});

// Get total unread message count for the current user
router.get('/unread-count', protect, async (req, res) => {
  const currentUserId = req.user.userId;
  const db = pool.promise();
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) as totalUnread FROM Messages WHERE ReceiverID = ? AND ReadStatus = FALSE',
      [currentUserId]
    );
    res.status(200).json({ totalUnread: rows[0].totalUnread || 0 });
  } catch (error) {
    console.error('Get unread message count error:', error);
    res.status(500).json({ message: 'Server error while fetching unread message count.' });
  }
});


module.exports = router;
