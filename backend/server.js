require('dotenv').config(); // This loads .env from the backend directory
const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module
// const mysql = require('mysql2'); // No longer needed here directly
const pool = require('./config/db'); // Import the pool

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Database connection is now managed by db.js
// The connection test is also in db.js, so server.js doesn't need to repeat it.
// If you need to ensure db.js runs and connects early, the require('./config/db') above does that.

// Serve static files from public/uploads directory
// Requests to /uploads/... will serve files from backend/public/uploads/...
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Room Rental API!' });
});

// Import routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const applicationRoutes = require('./routes/applications');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);


// Serve the frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for the frontend SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = { app }; // Connection is no longer exported from here