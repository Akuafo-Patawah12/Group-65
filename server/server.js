const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./Connection/DB_connect");
const cookieParser = require("cookie-parser");

// Initialize Express


app.use(express.json());
app.use(cookieParser()); // 🍪 Make sure this comes AFTER express.json
app.use(express.urlencoded({extended:true})); // For parsing application/x-www-form-urlencoded
app.use(cors(
    {
    origin: "http://localhost:5173", // Allow all origins for development purposes
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type"],
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
    }
));

require("dotenv").config();
const payrollRouter = require("./Router/PayrollRouters");
const attendanceRouter = require("./Router/AttendanceRouters");
const AuthRouters = require("./Router/AuthRouters");

const UserManagementRouter = require("./Router/UserManagementRouters");

// MongoDB connection


// Set the port
const PORT = process.env.PORT || 4000;

// Simple route
app.get("/", (req, res) => {
  res.send("Attendance & Payroll System API");
});

app.use("/api/auth", AuthRouters); // Assuming you have an AuthRouter for authentication)
app.use("/api/payroll", payrollRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/user_management", UserManagementRouter); // Assuming you have a UserManagementRouter for user management)

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


