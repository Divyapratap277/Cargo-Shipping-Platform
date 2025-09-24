 require('dotenv').config();
     const express = require('express');
     const mongoose = require('mongoose');
   const authRoutes = require('./routes/authRoutes'); // <-- ADD THIS LINE
     
     const app = express();
     
     // Middleware to parse JSON bodies
     app.use(express.json());
    
    // A simple test route
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
    
    // Use auth routes
    app.use('/api/auth', authRoutes); // <-- AND ADD THIS LINE
    
    const PORT = process.env.PORT || 5001;
   
   mongoose.connect(process.env.MONGO_URI)
       .then(() => {
           console.log('Connected to MongoDB');
           app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB', err);
            process.exit(1);
        });