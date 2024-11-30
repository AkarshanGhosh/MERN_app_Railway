// Import the MongoDB connection functions
const connectToMongo = require('./db'); // Connection for the login database
// const connectToDivisionDB = require('./divisiondb'); // Connection for the division database
// const connectToTrainDB = require('./traindb.js'); // Connecting to coach db

// Import express, cors, and http
const express = require('express');
const cors = require('cors'); // Import the cors package
const http = require('http'); // Import http for Socket.IO

// Create an instance of the Express application
const app = express();
const port = process.env.PORT || 5000; // Define the port number
const host = process.env.HOST || 'localhost';

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000', // Local frontend during development
    'https://mern-app-front-end-railway.vercel.app' // Deployed frontend
];

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman or server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS')); // Deny the request
        }
    },
    methods: ['POST', 'GET', 'OPTIONS'], // Allow only these methods
    allowedHeaders: ['Content-Type', 'auth-token'], // Allow specific headers
    credentials: true // Allow cookies and credentials if needed
}));

// Connect to MongoDB for login database
connectToMongo();

// Connect to MongoDB for division database
// connectToDivisionDB();

// Connect to MongoDB for Train Database
// connectToTrainDB();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Integrate Socket.IO with the server
const io = require('socket.io')(server);

// Event listener for new connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for messages from the client
    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        // Optionally, send a response back to the client
        socket.emit('message', 'Message received!');
    });

    // Event listener for disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Define routes
app.use('/api/auth', require('./routes/auth')); // Auth routes
app.use('/api/division', require('./routes/division')); // Division routes
app.use('/api/train', require('./routes/train')); // Train routes

// Start the server and listen on the defined port
server.listen(port, () => {
    console.log(`Example app listening at http://${host}:${port}`); // Log message indicating server is running
});
