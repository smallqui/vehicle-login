// Import the Mongoose library
const mongoose = require("mongoose");

// Define a schema for the login data
const loginSchema = new mongoose.Schema({
    name: String, // Field to store the name of the user
    password: String // Field to store the password of the user
});

// Create a Mongoose model based on the schema
const Login = new mongoose.model('Login', loginSchema);

// Export the Login model for use in other modules
module.exports = Login;