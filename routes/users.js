const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const { getBookings, createBooking } = require('../controllers/bookingController');
const { getProfile, updateProfile } = require('../controllers/userController');

router.use(auth);
router.use(requireRole('user'));

router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:id/cancel', require('../controllers/bookingController').cancelBooking);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;