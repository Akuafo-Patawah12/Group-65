
const User = require('../Models/UserSchema');
const Attendance = require('../Models/AttendanceSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

// Secret for JWT (ideally should be in environment variables)


// Login Route 
exports.login= async (req, res) => {
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
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role },process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });

    // Set the JWT token in the cookie
    res.cookie('refresh_token', token, {
      httpOnly: true,   // Ensures the cookie is not accessible via JavaScript
      secure: true,  // true if in production, false otherwise
      maxAge: 3600000,  // Set the cookie expiration to 1 hour (in milliseconds)
      sameSite: 'None', // For cross-origin requests
      path: '/',        // Ensures the cookie is available across the entire site
    });
    

    // Send response
    if (user.role === 'admin') {
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    }else{
    return res.status(201).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


exports.signup = async (req, res) => {
  // Check for validation errors from express-validator
  
  

  const { name, email, password, role } = req.body;
  console.log( name, email, password, role )

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // Default is "user", but can be passed as an argument
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({
      message: "User created successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteUser= async (req, res) => {
  try {
    const { id } = req.params;
    console.log("user",id)
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    await Attendance.deleteMany({ employee_id: id }); // Delete all attendance records for this user

    res.status(200).json({ message: "Attendance deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

 exports.logout = (req, res) => {
  res.cookie("refreshToken","",{maxAge:1});

  return res.status(200).json({ message: "Logged out successfully" });
};

