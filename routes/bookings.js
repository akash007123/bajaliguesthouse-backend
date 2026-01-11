const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

// Get all bookings (admin gets all, user gets their own)
router.get('/', auth, bookingController.getBookings);

// Create a new booking
router.post('/', auth, bookingController.createBooking);

// Update booking status (admin only)
router.put('/:id/status', auth, bookingController.updateBookingStatus);

// Cancel booking (user only)
router.put('/:id/cancel', auth, bookingController.cancelBooking);

module.exports = router;