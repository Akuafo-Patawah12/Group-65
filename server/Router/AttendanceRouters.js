const express= require('express');
const { signIn, filterReport, signOut, attendance, history, todayShift, deleteAttendance ,getUserAttendanceThisMonth} = require('../Controllers/Attendance');
const authMiddleware = require('../Middlewares/AuthMiddleware');
const router = express.Router();

router.post("/signIn",authMiddleware,signIn)
router.get("/status/:employee_id",authMiddleware, todayShift)
router.post("/signOut",authMiddleware,signOut)
router.get("/history",authMiddleware, history)
router.get("/",attendance)
router.delete("/:id",authMiddleware,deleteAttendance)
router.get("/thisMonthRecords",authMiddleware, getUserAttendanceThisMonth)
router.get("/filter",authMiddleware, filterReport)

module.exports = router;
// This code sets up an Express router for handling attendance-related API requests. It imports the `newAttendance` function from the `Attendance` module and defines a POST route at the root URL ("/") that triggers the `newAttendance` function when accessed. Finally, it exports the router for use in other parts of the application.