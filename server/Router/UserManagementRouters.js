const {getAllUsers} = require("../Controllers/UserManagement");
const express = require("express");
const router = express.Router();
const  authMiddleware  = require("../Middlewares/AuthMiddleware");
const adminMiddleware  = require("../Middlewares/AdminMiddleware");


router.get("/",getAllUsers);

module.exports = router;