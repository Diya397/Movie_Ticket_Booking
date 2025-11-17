const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  movieId: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);