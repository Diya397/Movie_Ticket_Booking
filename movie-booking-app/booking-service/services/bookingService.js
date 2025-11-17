const Booking = require('../models/Booking');
const { client } = require('../config/redis');

class BookingService {
  async createBooking(userId, movieId, seats) {
    const maxSeats = parseInt(process.env.MAX_SEATS_PER_BOOKING) || 10;
    
    if (seats > maxSeats) {
      throw new Error(`Cannot book more than ${maxSeats} seats`);
    }

    const booking = new Booking({
      userId,
      movieId,
      seats
    });

    await booking.save();

    // Publish booking event
    await this.publishBookingEvent({
      bookingId: booking._id,
      userId,
      movieId,
      seats
    });

    return booking;
  }

  async getUserBookings(userId) {
    return Booking.find({ userId });
  }

  async publishBookingEvent(bookingData) {
    try {
      await client.publish('BOOKING_CREATED', JSON.stringify(bookingData));
    } catch (error) {
      console.error('Failed to publish booking event:', error);
    }
  }
}

module.exports = new BookingService();