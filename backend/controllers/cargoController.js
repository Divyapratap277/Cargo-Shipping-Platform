const Cargo = require('../models/Cargo');
const User = require('../models/User');
const Auction = require('../models/Auction');

// @desc    Create a new cargo listing
// @route   POST /api/cargo
// @access  Private
const createCargo = async (req, res) => {
    const { description, weight, pickupLocation, destination, pickupDate } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (user.userType !== 'cargo_owner') {
            return res.status(403).json({ message: 'User is not authorized to create cargo' });
        }

        const newCargo = new Cargo({
            owner: req.user.id,
            description,
            weight,
            pickupLocation,
            destination,
            pickupDate,
        });

        const cargo = await newCargo.save();

        const auction = new Auction({
            cargo: cargo._id,
            startTime: Date.now(),
            endTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        });

        await auction.save();

        cargo.auction = auction._id;
        await cargo.save();

        req.io.emit('auction-started', auction);

        setTimeout(async () => {
            const endedAuction = await Auction.findById(auction._id);
            if (endedAuction.status === 'Active') {
                endedAuction.status = 'Finished';
                const winningBid = await Bid.findOne({ auction: auction._id }).sort({ amount: 1 });
                if(winningBid) {
                    endedAuction.winningBid = winningBid._id;
                    const cargo = await Cargo.findById(endedAuction.cargo);
                    cargo.status = 'Awarded';
                    await cargo.save();
                }
                await endedAuction.save();
                req.io.to(auction._id.toString()).emit('auction-ended', endedAuction);
            }
        }, 5 * 60 * 1000);

        res.status(201).json(cargo);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all cargo listings for the logged-in user
// @route   GET /api/cargo
// @access  Private
const getMyCargo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.userType !== 'cargo_owner') {
            return res.status(403).json({ message: 'User is not authorized to view this content' });
        }

        const cargoListings = await Cargo.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(cargoListings);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    createCargo,
    getMyCargo,
};
