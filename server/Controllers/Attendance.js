const express = require("express");
const Attendance = require("../Models/AttendanceSchema");
const router = express.Router();

// POST: Add attendance record (check-in and check-out)
 const newAttendance= async (req, res) => {
  const { userId, shiftStart, shiftEnd, status, checkInTime, checkOutTime } = req.body;

  try {
    const newAttendance = new Attendance({
      userId,
      shiftStart,
      shiftEnd,
      status,
      checkInTime,
      checkOutTime,
    });

    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error recording attendance", error });
  }
}

// GET: Get all attendance records for a specific user by userId
const myAttendance= async (req, res) => {
  const { userId } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ userId }).sort({ date: -1 });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attendance records", error });
  }
}

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

module.exports = {newAttendance,myAttendance,attendance};
// This code defines an Express router for handling attendance-related API endpoints. It includes routes for adding a new attendance record (check-in and check-out), fetching all attendance records for a specific user by userId, and fetching all attendance records (admin route). The router uses Mongoose to interact with a MongoDB database and handles errors appropriately.
// The attendance records include fields for userId, shift start and end times, status, check-in and check-out times. The router exports the defined routes for use in other parts of the application.