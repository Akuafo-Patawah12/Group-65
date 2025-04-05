const User = require("../Models/UserSchema"); // Import the User model

exports.getAllUsers = async (req, res) => {
    try {
        console.log("all cookies", req.cookies); // Log the cookies for debugging
      const users = await User.find();  // Fetch all users from the database
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  };