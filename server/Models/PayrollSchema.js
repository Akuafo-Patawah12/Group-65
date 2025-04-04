const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    payPeriod: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
  },
  { timestamps: true }
);

const Payroll = mongoose.model("Payroll", payrollSchema);

module.exports = Payroll;
// This code defines a Mongoose schema for a payroll system. The `payrollSchema` includes fields for user ID, pay period, basic salary, bonuses, deductions, and net pay. It also sets up timestamps for when each record is created or updated. Finally, it exports the `Payroll` model for use in other parts of the application.