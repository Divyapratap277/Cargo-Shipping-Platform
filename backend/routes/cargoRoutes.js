const express = require('express');
const router = express.Router();
const { createCargo, getMyCargo } = require('../controllers/cargoController');
const auth = require('../middleware/auth');

// @route   POST api/cargo
// @desc    Create a cargo listing
// @access  Private (Cargo Owners)
router.post('/', auth, createCargo);

// @route   GET api/cargo
// @desc    Get my cargo listings
// @access  Private (Cargo Owners)
router.get('/', auth, getMyCargo);

module.exports = router;
