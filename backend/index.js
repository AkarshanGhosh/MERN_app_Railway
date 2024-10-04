// Import the MongoDB connection functions
const connectToMongo = require('./db'); // Connection for the login database
//const connectToDivisionDB = require('./divisiondb'); // Connection for the division database
//const connectToTrainDB = require('./traindb.js'); // connecting to coach db
// Import express
const express = require('express');

// Connect to MongoDB for login database
connectToMongo();

// Connect to MongoDB for division database
//connectToDivisionDB();

//Connect to MongoDB for Train Database
//connectToTrainDB();

// Create an instance of the Express application
const app = express();
const port = 5000; // Define the port number

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/auth')); // Auth routes
app.use('/api/division', require('./routes/division')); // Division routes
app.use('/api/train', require('./routes/train')); // Train routes

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`); // Log message indicating server is running
});
