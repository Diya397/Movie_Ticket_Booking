const Booking = require('../models/Booking');

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { movieId, seats } = req.body;

    // Validate seat number
    if (!movieId) {
      return res.status(400).json({ message: 'MovieId is required' });
    }
    if (seats <= 0 || seats > 10) {
      return res.status(400).json({ message: 'Seats must be between 1 and 10' });
    }

    const booking = await Booking.create({
      user: userId,
      movie: movieId,
      seats,
    });

    // TODO: Publish event to Notification Service (via Redis / BullMQ)

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET CURRENT USER BOOKINGS
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Only return movieId, seats, and timestamps
    const bookings = await Booking.find({ user: userId }).select('movie seats createdAt updatedAt');

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBooking, getUserBookings };
