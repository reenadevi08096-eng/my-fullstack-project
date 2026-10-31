const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const tokenString = token.replace('Bearer ', '').trim();
    const verified = jwt.verify(tokenString, process.env.JWT_SECRET);
    
    // Ensure req.user has the id explicitly
    req.user = { id: verified.id || verified._id }; 
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};