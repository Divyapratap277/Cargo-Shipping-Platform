 require('dotenv').config();
     const express = require('express');
     const mongoose = require('mongoose');
   const authRoutes = require('./routes/authRoutes'); // <-- ADD THIS LINE
   const cargoRoutes = require('./routes/cargoRoutes');
   const auctionRoutes = require('./routes/auctionRoutes');
     
     const app = express();
     
     // Middleware to parse JSON bodies
     app.use(express.json());
    
    // A simple test route
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
    
    // Use auth routes
    app.use('/api/auth', authRoutes); // <-- AND ADD THIS LINE
    app.use('/api/cargo', cargoRoutes);
    app.use('/api/auctions', auctionRoutes);
    
    const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });