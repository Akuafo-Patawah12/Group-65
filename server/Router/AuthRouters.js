const {login,signup,resetPassword,forgotPassword,logout,deleteUser} = require('../Controllers/Auth');
const express = require('express');
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.delete("/:id", deleteUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword); // Assuming reset-password uses the same controller as forgetPassword


module.exports = router;
// This code sets up an Express router for handling authentication-related API requests. It imports the `login` function from the `AuthController` module and defines a POST route at the URL "/login" that triggers the `login` function when accessed. Finally, it exports the router for use in other parts of the application.