const express = require("express");

const cors = require("cors");
const connection = require("./Connection/DB_connect");
require("dotenv").config();
const payrollRouter = require("./Router/PayrollRouters");
const attendanceRouter = require("./Router/AttendanceRouters");
const AuthRouters = require("./Router/AuthRouters");

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors(
    {
    origin: "*", // Allow all origins for development purposes
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
    }
));

// MongoDB connection


// Set the port
const PORT = process.env.PORT || 4000;

// Simple route
app.get("/", (req, res) => {
  res.send("Attendance & Payroll System API");
});

app.use("/api/auth", AuthRouters); // Assuming you have an AuthRouter for authentication)
app.use("/api/payroll", payrollRouter);
app.use("/attendance", attendanceRouter);

// Start the server
const startServer = async () => {
    try {
        await connection()
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}
startServer()


