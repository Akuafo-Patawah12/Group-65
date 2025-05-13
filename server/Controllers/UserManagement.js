const User = require("../Models/UserSchema"); // Import the User model
const moment = require("moment"); // Import moment for date formatting

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
 
  exports.getLoggedInUser = async (req, res) => {
    try {
        console.log("all cookies", req.cookies); // Log the cookies for debugging
      const userId = req.user.userId;
      console.log("user",userId)  // Extract userId from the request object
      const user = await User.findById(userId);  // Fetch the user by ID from the database
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.name);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  }