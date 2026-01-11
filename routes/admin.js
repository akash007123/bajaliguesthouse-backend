const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { getBookings, updateBookingStatus } = require('../controllers/bookingController');

router.use(auth);
router.use(requireRole('admin'));

// Rooms
router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

// Bookings
router.get('/bookings', getBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const Room = require('../models/Room');
    const Booking = require('../models/Booking');
    const User = require('../models/User');
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);
    res.json({ totalRooms, totalBookings, totalUsers, recentBookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;