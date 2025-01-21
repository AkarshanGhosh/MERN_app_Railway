// Import the MongoDB connection functions
const connectToMongo = require('./db'); // Connection for the login database
// const connectToDivisionDB = require('./divisiondb'); // Connection for the division database
// const connectToTrainDB = require('./traindb.js'); // Connecting to coach db

// Import express, cors, and http
const express = require('express');
const cors = require('cors'); // Import the cors package
const http = require('http'); // Import http for Socket.IO
const https = require('https')

// Create an instance of the Express application
const app = express();
const port = process.env.PORT || 5000; // Define the port number

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000', // For local development
    'https://mern-app-front-end-railway.vercel.app', // Deployed frontend on Vercel
    'https://mern-app-front-end-railway.vercel.app' // Replace with your actual frontend URL
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS')); // Deny the request
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'auth-token'], // Allowed headers
    credentials: true // Enable cookies and credentials if needed
}));

// Allow preflight OPTIONS requests for all routes
app.options('*', cors());

// Connect to MongoDB for login database
connectToMongo();

// Uncomment these lines if connecting to additional databases
// Connect to MongoDB for division database
// connectToDivisionDB();

// Connect to MongoDB for Train Database
// connectToTrainDB();

// Create an HTTP server using the Express app
const server = https.createServer(app);

// Integrate Socket.IO with the server
const io = require('socket.io')(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
});

// Event listener for new connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for messages from the client
    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        // Optionally, send a response back to the client
        socket.emit('message', 'Message received!');
    });

    // Event listener for disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Define routes
app.use('/api/auth', require('./routes/auth')); // Auth routes
app.use('/api/division', require('./routes/division')); // Division routes
app.use('/api/train', require('./routes/train')); // Train routes

// Start the server and listen on the defined port
server.listen(port, '0.0.0.0', () => { // Listen on all network interfaces
    console.log(`Server is running and listening on https://0.0.0.0:${port}`);
});