const mongoose = require('mongoose');
require('dotenv').config();

const connection = () => {
    return mongoose.connect(process.env.MONGO_URI)
}
module.exports = connection;
// This code connects to a MongoDB database using Mongoose. It exports a function that establishes the connection using the URI stored in the environment variable `MONGO_URI`. The connection is established when this function is called, allowing other parts of the application to use the database.