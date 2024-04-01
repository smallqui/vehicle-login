// Load environment variables from .env file into process.env
require("dotenv").config();

// Import Login model for MongoDB
const Login = require("../models/login");

// Import necessary packages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// Create an Express application
const app = express();
const port = 3000; // Port on which the server will listen

// Middleware setup
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded requests

// Set up template and public paths for views
const templatePath = path.join(__dirname, '../templates'); // Path to view templates
const publicPath = path.join(__dirname, '../public'); // Path to public directory
app.set('view engine', 'hbs'); // Set view engine to Handlebars
app.set('views', templatePath); // Set views directory
app.use(express.static(publicPath)); // Serve static files from public directory

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_CONNECTION) // Use MongoDB connection URI from environment variables
    .then(() => {
        console.log('Mongoose connected'); // Log successful connection to MongoDB
        app.listen(port, () => {
            console.log('Server connected on port', port); // Log server start
        });
    })
    .catch((error) => {
        console.error('Failed to connect Mongoose:', error); // Log error if failed to connect to MongoDB
    });

// Routes

// Route to render sign-up form
app.get('/signup', (req, res) => {
    res.render('signup'); // Render the signup view template
});

// Route to render login form
app.get('/', (req, res) => {
    res.render('login'); // Render the login view template
});

// Sign Up Route
app.post('/signup', async (req, res) => {
    try {
        const data = {
            name: req.body.name, // Extract name from request body
            password: req.body.password // Extract password from request body
        };

        // Check if user already exists
        const existingUser = await Login.findOne({ name: req.body.name });
        if (existingUser) {
            return res.send("User details already exist"); // Respond with message if user already exists
        }

        // Create new user
        await Login.create(data); // Create user in MongoDB
        res.status(201).render("home", { naming: req.body.name }); // Render home view template with username
    } catch (error) {
        console.error(error); // Log error
        res.status(500).send("Internal Server Error"); // Respond with 500 status and error message
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        // Find user by name in MongoDB
        const user = await Login.findOne({ name: req.body.name });
        if (!user || user.password !== req.body.password) {
            return res.send("Incorrect username or password"); // Respond with message if user not found or password is incorrect
        }
        res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` }); // Render home view template with username and password
    } catch (error) {
        console.error(error); // Log error
        res.status(500).send("Internal Server Error"); // Respond with 500 status and error message
    }
});