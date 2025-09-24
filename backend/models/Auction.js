const mongoose = require('mongoose');
     
     const AuctionSchema = new mongoose.Schema({
     cargo: {
         type: mongoose.Schema.Types.ObjectId,
           ref: 'Cargo',
         required: true,
         unique: true // Each cargo can only have one auction
         },
        startTime: {
            type: Date,
            required: true,
      },
       endTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Finished'],
            default: 'Active',
        },
        bids: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bid'
        }],
        winningBid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bid',
            default: null
        },
        currentLowestBid: {
            type: Number,
            default: null
        }
    }, { timestamps: true });
    
    module.exports = mongoose.model('Auction', AuctionSchema);