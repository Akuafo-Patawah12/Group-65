const {login} = require('../Controllers/Auth');
const express = require('express');
const router = express.Router();

router.post("/login", login);

module.exports = router;
// This code sets up an Express router for handling authentication-related API requests. It imports the `login` function from the `AuthController` module and defines a POST route at the URL "/login" that triggers the `login` function when accessed. Finally, it exports the router for use in other parts of the application.