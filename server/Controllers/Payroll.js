const express = require("express");
const Payroll = require("../Models/PayrollSchema");


// Create a new payroll record
const newPayroll= async (req, res) => {
  const { userId, payPeriod, basicSalary, bonuses, deductions, netPay } = req.body;

  try {
    const newPayroll = new Payroll({
      userId,
      payPeriod,
      basicSalary,
      bonuses,
      deductions,
      netPay,
    });

    await newPayroll.save();
    res.status(201).json(newPayroll);
  } catch (error) {
    console.error("Error creating payroll record:", error);
    res.status(500).json({ message: "Error creating payroll record", error });
  }
}

// Get all payroll records for a user (for a normal user)
const myPayroll= async (req, res) => {
  

  try {
    const payrolls = await Payroll.find({});
    res.status(200).json(payrolls);
  } catch (error) {
    console.error( error);
    res.status(500).json({ message: "Error fetching payroll records", error });
  }
}

// Get a single payroll record by ID
const payroll= async (req, res) => {
  const { id } = req.params;

  try {
    const payroll = await Payroll.findById(id);
    if (!payroll) return res.status(404).json({ message: "Payroll record not found" });
    res.status(200).json(payroll);
  } catch (error) {
    console.error( error);
    res.status(500).json({ message: "Error fetching payroll record", error });
  }
}

module.exports = {myPayroll,newPayroll,payroll};
// This code defines an Express router for handling payroll-related API endpoints. It includes routes for creating a new payroll record, fetching all payroll records for a specific user, and fetching a single payroll record by its ID. The router uses Mongoose to interact with a MongoDB database and handles errors appropriately.
