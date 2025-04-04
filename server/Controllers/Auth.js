
const User = require('../Models/UserSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

// Secret for JWT (ideally should be in environment variables)
const JWT_SECRET = "your_jwt_secret";

// Login Route
const login= async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Set the JWT token in the cookie
    res.cookie('refresh_token', token, {
      httpOnly: true,   // Ensures the cookie is not accessible via JavaScript
      secure: true,  // Set to true in production for HTTPS
      maxAge: 3600000,  // Set the cookie expiration to 1 hour (in milliseconds)
      sameSite: 'None', // Restricts sending cookies cross-origin
    });

    // Send response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {login};
