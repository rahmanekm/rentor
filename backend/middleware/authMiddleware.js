const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Adds user info (userId, userType) to the request object
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

const isLandlord = (req, res, next) => {
  if (req.user && req.user.userType === 'Landlord') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized. Landlord access required.' });
  }
};

module.exports = { protect, isLandlord };
