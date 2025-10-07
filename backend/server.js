const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO
const { Server } = require('socket.io'); // Required for Socket.IO

// --- 1. CONFIGURATION AND INIT ---
dotenv.config();
const app = express();

// Create an HTTP server instance from the Express app (must be done before defining port)
const server = http.createServer(app); 

// --- 2. SOCKET.IO SETUP ---
// Initialize Socket.IO instance and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        // Reads from the .env file (CLIENT_URL) to ensure security
        origin: process.env.CLIENT_URL || "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

// Middleware to attach the Socket.IO instance to every Express request (used in controllers)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- 3. GLOBAL MIDDLEWARE ---
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS for all routes


// --- 4. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err.message);
        // Exit process on failure
        process.exit(1); 
    });


// --- 5. IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const cargoRoutes = require('./routes/cargoRoutes');
const auctionRoutes = require('./routes/auctionRoutes');


// --- 6. USE ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('/api/auctions', auctionRoutes);

// Simple test route
app.get('/', (req, res) => {
    res.send('API is running and MongoDB is connected.');
});

// --- 7. SOCKET.IO EVENT HANDLERS ---
io.on('connection', (socket) => {
    console.log('New client connected');

    // Client requests to join a specific auction room (for real-time updates)
    socket.on('joinAuction', (auctionId) => {
        socket.join(auctionId);
        console.log(`Client joined auction room: ${auctionId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// --- 8. START SERVER ---
const PORT = process.env.PORT || 5001;

// We use server.listen (the http server) instead of app.listen (the express app)
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
