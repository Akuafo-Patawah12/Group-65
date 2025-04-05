const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }, // Date of attendance
  shift_type: { type: String, enum: ["Regular", "Overtime"], default: "Regular" },
  sign_in_time: { type: Date, required: true },
  sign_out_time: { type: Date }, // Can be null if not signed out yet
  status: { type: String, enum: ["Present", "Late"], required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Attendance", attendanceSchema);
// This code defines a Mongoose schema for an attendance system. The `attendanceSchema` includes fields for user ID, date, shift start and end times, attendance status, check-in and check-out times. It also sets up timestamps for when each record is created or updated. Finally, it exports the `Attendance` model for use in other parts of the application.