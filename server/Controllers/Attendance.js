const express = require("express");
const Attendance = require("../Models/AttendanceSchema");




const signIn = async (req, res) => {
 
  try {
    const { employee_id, shift_type, status } = req.body;
    console.log(employee_id, shift_type, status)

    // Check if the employee has already signed in today
    const today = new Date().setHours(0, 0, 0, 0); // Get the start of today (midnight)
    const existingAttendance = await Attendance.findOne({
      employee_id,
      date: { $gte: today },
      status: { $in: ["Present", "Late"] }, // Filter for already signed-in attendance
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "You have already signed in today." });
    }

    // Create a new attendance record (sign-in)
    const newAttendance = new Attendance({
      employee_id,
      date: new Date(),
      shift_type,
      sign_in_time: new Date(),
      status,
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance marked successfully!", attendance: newAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// GET: Get all attendance records for a specific user by userId
const signOut = async (req, res) => {
  try {
    const { employee_id } = req.body;

    // Find the attendance record for today
    const today = new Date().setHours(0, 0, 0, 0); // Get the start of today
    const attendance = await Attendance.findOne({
      employee_id,
      date: { $gte: today },
      status: { $in: ["Present", "Late"] },
    });

    if (!attendance) {
      return res.status(404).json({ message: "You are not signed in today." });
    }

    // Update the sign-out time
    attendance.sign_out_time = new Date();
    attendance.status = attendance.status === "Late" ? "Late" : "Present"; // Assuming we change status if they sign out late
    await attendance.save();

    res.status(200).json({ message: "Successfully signed out!", attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET: Get all attendance records (Admin route, if needed)
 const attendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().sort({ date: -1 });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attendance records", error });
  }
}

const history = async (req, res) => {
  const employee_id = req.user.userId
  try {
    // Fetch attendance records for the specific user
    const attendanceRecords = await Attendance.find({ employee_id }).populate('employee_id', 'name email').sort({ date: -1 });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attendance records", error });
  }
};

module.exports = {signIn,signOut,attendance,history};
// This code defines an Express router for handling attendance-related API endpoints. It includes routes for adding a new attendance record (check-in and check-out), fetching all attendance records for a specific user by userId, and fetching all attendance records (admin route). The router uses Mongoose to interact with a MongoDB database and handles errors appropriately.
// The attendance records include fields for userId, shift start and end times, status, check-in and check-out times. The router exports the defined routes for use in other parts of the application.