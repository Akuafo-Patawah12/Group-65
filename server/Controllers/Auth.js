
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Secret for JWT (ideally should be in environment variables)
const JWT_SECRET = "your_jwt_secret";

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Set the JWT token in the cookie
    res.cookie('auth_token', token, {
      httpOnly: true,   // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Set to true in production for HTTPS
      maxAge: 3600000,  // Set the cookie expiration to 1 hour (in milliseconds)
      sameSite: 'Strict', // Restricts sending cookies cross-origin
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
});

module.exports = router;
