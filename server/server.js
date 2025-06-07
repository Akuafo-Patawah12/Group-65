const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./Connection/DB_connect");
const cookieParser = require("cookie-parser");

// Initialize Express


app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({extended:true})); // For parsing application/x-www-form-urlencoded
app.use(cors(
    {
    origin: ["http://localhost:5173","http://localhost:5174"], // Allow all origins for development purposes
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"], // Allow specific HTTP methods
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
    }
));

require("dotenv").config();
const attendanceRouter = require("./Router/AttendanceRouters");
const AuthRouters = require("./Router/AuthRouters");

const UserManagementRouter = require("./Router/UserManagementRouters");




// Set the port
const PORT = process.env.PORT || 4000;

// Simple route
app.get("/", (req, res) => {
  res.send("Attendance & Payroll System API");
});

app.use("/api/auth", AuthRouters); 

app.use("/api/attendance", attendanceRouter);
app.use("/api/user_management", UserManagementRouter); 

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


