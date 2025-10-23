const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('=== AUTH DEBUG ===');
    console.log('Authorization header:', req.header('Authorization'));
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token after cleanup:', token);
    
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log('JWT Secret:', process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId).select('-password');
    console.log('Found user:', user);
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    console.log('=== AUTH SUCCESS ===');
    next();
  } catch (error) {
    console.log('=== AUTH ERROR ===');
    console.log('Error:', error.message);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = auth;