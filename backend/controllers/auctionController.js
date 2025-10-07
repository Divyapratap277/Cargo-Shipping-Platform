const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const User = require('../models/User');
const Cargo = require('../models/Cargo');

// @desc    Get all active auctions
// @route   GET /api/auctions
// @access  Private (Truck Owners)
const getAuctions = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.userType !== 'truck_owner') {
            return res.status(403).json({ message: 'User is not authorized to view auctions' });
        }

        const auctions = await Auction.find({ status: 'Active' }).populate('cargo');
        res.json(auctions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get a single auction
// @route   GET /api/auctions/:id
// @access  Private
const getAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id).populate('cargo').populate('bids');
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Place a bid on an auction
// @route   POST /api/auctions/:id/bids
// @access  Private (Truck Owners)
const placeBid = async (req, res) => {
    const { amount } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (user.userType !== 'truck_owner') {
            return res.status(403).json({ message: 'User is not authorized to place bids' });
        }

        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (auction.status !== 'Active') {
            return res.status(400).json({ message: 'Auction is not active' });
        }

        if (auction.currentLowestBid && amount >= auction.currentLowestBid) {
            return res.status(400).json({ message: 'Bid must be lower than the current lowest bid' });
        }

        const newBid = new Bid({
            auction: req.params.id,
            bidder: req.user.id,
            amount,
        });

        const bid = await newBid.save();

        auction.bids.push(bid._id);
        auction.currentLowestBid = amount;
        await auction.save();

        req.io.to(req.params.id).emit('update-bid', bid);

        res.status(201).json(bid);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAuctions,
    getAuction,
    placeBid,
};
