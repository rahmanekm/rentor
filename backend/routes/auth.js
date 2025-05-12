const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Import pool from db.js
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
router.post('/register', async (req, res) => {
  const { Name, Email, Password, PhoneNumber, UserType, ProfilePictureURL, Bio, PropertyName, PropertyAddress } = req.body;

  if (!Name || !Email || !Password || !UserType) {
    return res.status(400).json({ message: 'Name, Email, Password, and UserType are required.' });
  }

  try {
    // Check if user already exists
    const [users] = await pool.promise().query('SELECT UserID FROM Users WHERE Email = ?', [Email]);
    if (users.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newUser = {
      Name,
      Email,
      Password: hashedPassword,
      PhoneNumber,
      UserType,
      ProfilePictureURL,
      Bio: UserType === 'Tenant' ? Bio : null,
      PropertyName: UserType === 'Landlord' ? PropertyName : null,
      PropertyAddress: UserType === 'Landlord' ? PropertyAddress : null,
      EmailVerified: false // Implement email verification logic separately
    };

    const [result] = await pool.promise().query('INSERT INTO Users SET ?', newUser);
    const userId = result.insertId;

    // Generate JWT
    const token = jwt.sign({ userId: userId, userType: UserType }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'User registered successfully. Please verify your email.', 
      token,
      userId,
      userType: UserType 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: 'Email and Password are required.' });
  }

  try {
    const [users] = await pool.promise().query('SELECT * FROM Users WHERE Email = ?', [Email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.EmailVerified) {
      // Potentially allow login but restrict access or prompt for verification
      // For now, let's treat it as a successful login but inform the client
      // Or, you could return a specific status/message to prompt for verification
      // return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign({ userId: user.UserID, userType: user.UserType }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful.',
      token,
      userId: user.UserID,
      name: user.Name,
      userType: user.UserType,
      emailVerified: user.EmailVerified
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// TODO: Add Forgot Password, Email Verification routes

module.exports = router;
