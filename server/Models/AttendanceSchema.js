const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    shiftStart: {
      type: Date,
      required: true,
    },
    shiftEnd: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "On Leave"],
      default: "Present",
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Created and Updated timestamps
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
// This code defines a Mongoose schema for an attendance system. The `attendanceSchema` includes fields for user ID, date, shift start and end times, attendance status, check-in and check-out times. It also sets up timestamps for when each record is created or updated. Finally, it exports the `Attendance` model for use in other parts of the application.