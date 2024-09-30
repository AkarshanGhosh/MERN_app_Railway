// Import the MongoDB connection function
const connectToMongo = require('./db');

// Import express
const express = require('express');

// Connect to MongoDB
connectToMongo();

// Create an instance of the Express application
const app = express();
const port = 5000; // Define the port number

app.use(express.json())

// Define a route for the root URL
app.use('/api/auth', require('./routes/auth'))
app.use('/api/division', require('./routes/division'))

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`); // Log message indicating server is running
});
