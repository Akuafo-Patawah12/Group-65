const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = (req, res, next) => {
  console.log('Cookies:', req.cookies); // Log the cookies for debugging
// Check if the refresh token is present in the cookies
  const token = req.cookies.refresh_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded; // Attach the user to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};



module.exports = authMiddleware
