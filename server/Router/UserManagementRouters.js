const {getAllUsers, getLoggedInUser} = require("../Controllers/UserManagement");
const express = require("express");
const router = express.Router();
const  authMiddleware  = require("../Middlewares/AuthMiddleware");
const adminMiddleware  = require("../Middlewares/AdminMiddleware");


router.get("/",authMiddleware,adminMiddleware,getAllUsers);
router.get("/me",authMiddleware,adminMiddleware,getLoggedInUser); // This route is for getting the logged-in user's information

module.exports = router;