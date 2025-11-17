const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createBooking);
router.get('/me', authMiddleware, getUserBookings);

module.exports = router;
