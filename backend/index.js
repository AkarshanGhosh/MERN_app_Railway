// Import necessary modules
const express = require('express');
const cors = require('cors');
const http = require('http'); // For HTTP server
const https = require('https'); // For HTTPS server if needed
const fs = require('fs'); // For reading SSL certificates (optional for HTTPS)
const connectToMongo = require('./db');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://mern-app-front-end-railway.vercel.app'
];

// Configure CORS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'auth-token'],
    credentials: true
}));

// Allow preflight OPTIONS requests for all routes
app.options('*', cors());

// Connect to MongoDB
connectToMongo();

// Create an HTTP server using the Express app
const server = https.createServer(app); // Switch to https.createServer if using SSL

// For HTTPS, uncomment the lines below and ensure certificates are available
// const options = {
//     key: fs.readFileSync('/path/to/your/private.key'),
//     cert: fs.readFileSync('/path/to/your/certificate.crt')
// };
// const server = https.createServer(options, app);

// Integrate Socket.IO
const io = require('socket.io')(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('message', (msg) => {
        console.log(`Message received from ${socket.id}: ${msg}`);
        socket.emit('message', 'Message received!');
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Define API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/division', require('./routes/division'));
app.use('/api/train', require('./routes/train'));

// Start the server
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running and listening on https://0.0.0.0:${port}`);
});
