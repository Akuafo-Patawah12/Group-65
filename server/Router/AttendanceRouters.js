const express= require('express');
const { newAttendance, myAttendance, attendance } = require('../Controllers/Attendance');
const router = express.Router();

router.post("/", newAttendance)
router.get("/:userId", myAttendance)
router.get("/me", attendance)

module.exports = router;
// This code sets up an Express router for handling attendance-related API requests. It imports the `newAttendance` function from the `Attendance` module and defines a POST route at the root URL ("/") that triggers the `newAttendance` function when accessed. Finally, it exports the router for use in other parts of the application.