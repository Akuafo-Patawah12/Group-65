const express = require("express");
const Attendance = require("../Models/AttendanceSchema");
const moment = require("moment");


const todayShift = async (req, res) => {
  const { employee_id } = req.params;
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));

  try {
    const records = await Attendance.find({
      employee_id,
      date: { $gte: startOfDay },
    });

    const status = {
      Regular: { signedIn: false, signedOut: false },
      Overtime: { signedIn: false, signedOut: false },
    };

    records.forEach((record) => {
      if (record.shift_type === "Regular") {
        status.Regular.signedIn = true;
        if (record.sign_out_time) status.Regular.signedOut = true;
      }
      if (record.shift_type === "Overtime") {
        status.Overtime.signedIn = true;
        if (record.sign_out_time) status.Overtime.signedOut = true;
      }
    });

    res.json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch shift status" });
  }
}



const getToday = () => moment().format("YYYY-MM-DD");

const signIn = async (req, res) => {
  const employee_id = req.user.userId;
  const { shift_type, status, location } = req.body;

  if (!shift_type || !status ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if(!location){
    return res.status(400).json({ message: "Location is required." });
  }

  try {
    const today = getToday();

    const existing = await Attendance.findOne({ employee_id, shift_type, date: today });

    if (existing && existing.sign_in_time) {
      return res.status(400).json({ message: "Already signed in for today's shift." });
    }

    if (shift_type === "Overtime") {
      const regularShift = await Attendance.findOne({
        employee_id,
        shift_type: "Regular",
        date: today,
      });
      if (!regularShift || !regularShift.sign_out_time) {
        return res.status(400).json({
          message: "You must complete Regular shift before Overtime.",
        });
      }
    }

    const record = await Attendance.findOneAndUpdate(
      { employee_id, shift_type, date: today },
      { $set: { sign_in_time: new Date(), status, location } },
      { upsert: true, new: true }
    );

    res.status(201).json(record);
  } catch (error) {
    console.error("Sign In Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// GET: Get all attendance records for a specific user by userId
const signOut = async (req, res) => {
  const  employee_id  = req.user.userId;
  const shift_type =  "Regular"; // fallback to Regular

  try {
    const today = getToday();

    const record = await Attendance.findOne({ employee_id, shift_type, date: today });

    if (!record || !record.sign_in_time) {
      return res.status(400).json({ message: "You haven't signed in for this shift." });
    }

    if (record.sign_out_time) {
      return res.status(400).json({ message: "Already signed out for this shift." });
    }

    record.sign_out_time = new Date();
    await record.save();

    res.status(200).json({ message: "Sign out successful", record });
  } catch (error) {
    console.error("Sign Out Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: Get all attendance records (Admin route, if needed)
const attendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .sort({ date: -1 })
      .populate('employee_id', 'name'); // Populate only the username field

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attendance records", error });
  }
};

const getUserAttendanceThisMonth = async (req, res) => {
  const userId = req.user.userId;

  const startOfMonth = moment().startOf('month').toDate();
  const endOfMonth = moment().endOf('month').toDate();

  try {
    const records = await Attendance.find({
      employee_id: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 });

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance", error: err.message });
  }
};


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


const deleteAttendance= async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ message: "Attendance deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const filterReport = async (req, res) => {
  try {
    const { year, userName } = req.query;
    const query = {};

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${parseInt(year) + 1}-01-01`);
      query.date = { $gte: start, $lt: end };
      console.log("start", query.date);
    }

    // Initial query: only filter by date
    let data = await Attendance.find(query).populate("employee_id");

    console.log("Before userName filter:", data.length);

    // Apply name filter after population
    if (userName) {
      data = data.filter((item) =>
        item.employee_id?.name?.toLowerCase().includes(userName.toLowerCase())
      );
      console.log("After userName filter:", data.length);
    }
    console.log(data)
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {filterReport , signIn,signOut,attendance,history,todayShift,deleteAttendance,getUserAttendanceThisMonth};
// This code defines an Express router for handling attendance-related API endpoints. It includes routes for adding a new attendance record (check-in and check-out), fetching all attendance records for a specific user by userId, and fetching all attendance records (admin route). The router uses Mongoose to interact with a MongoDB database and handles errors appropriately.
// The attendance records include fields for userId, shift start and end times, status, check-in and check-out times. The router exports the defined routes for use in other parts of the application.