 const mongoose = require('mongoose');
     
     const CargoSchema = new mongoose.Schema({
         owner: {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'User',
             required: true,
         },
         description: {
            type: String,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        pickupLocation: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        pickupDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Active', 'Awarded', 'Completed'],
            default: 'Pending',
        },
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auction',
        }
   }, { timestamps: true });
    
    module.exports = mongoose.model('Cargo', CargoSchema);