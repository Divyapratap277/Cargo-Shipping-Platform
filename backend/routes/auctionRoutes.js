const express = require('express');
const router = express.Router();
const { getAuctions, getAuction, placeBid } = require('../controllers/auctionController');
const auth = require('../middleware/auth');

// @route   GET api/auctions
// @desc    Get all active auctions
// @access  Private (Truck Owners)
router.get('/', auth, getAuctions);

// @route   GET api/auctions/:id
// @desc    Get a single auction
// @access  Private
router.get('/:id', auth, getAuction);

// @route   POST api/auctions/:id/bids
// @desc    Place a bid on an auction
// @access  Private (Truck Owners)
router.post('/:id/bids', auth, placeBid);

module.exports = router;
