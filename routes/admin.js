const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth, requireRole } = require('../middleware/auth');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { getBookings, updateBookingStatus, getReviews, updateReviewStatus } = require('../controllers/bookingController');
const {
  getCustomBookings,
  getCustomBooking,
  createCustomBooking,
  updateCustomBooking,
  deleteCustomBooking,
  updateCustomBookingStatus,
  getRevenue
} = require('../controllers/customBookingController');
const { getStaff, getStaffMember, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { getAllUsers, updateUserStatus } = require('../controllers/userController');
const { getDarshans, getDarshan, createDarshan, updateDarshan, deleteDarshan } = require('../controllers/darshanController');
const { getAllNewsletters, deleteNewsletter } = require('../controllers/newsletterController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

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

// Reviews
router.get('/reviews', getReviews);
router.put('/reviews/:id/status', updateReviewStatus);

// Custom Bookings
router.get('/bookings/custom', getCustomBookings);
router.get('/bookings/custom/:id', getCustomBooking);
router.post('/bookings/custom', createCustomBooking);
router.put('/bookings/custom/:id', updateCustomBooking);
router.delete('/bookings/custom/:id', deleteCustomBooking);
router.put('/bookings/custom/:id/status', updateCustomBookingStatus);

// Revenue
router.get('/revenue', getRevenue);

// Staff
router.get('/staff', getStaff);
router.get('/staff/:id', getStaffMember);
router.post('/staff', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'bankPassbook', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), createStaff);
router.put('/staff/:id', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'bankPassbook', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), updateStaff);
router.delete('/staff/:id', deleteStaff);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

// Darshans
router.get('/darshans', getDarshans);
router.get('/darshans/:id', getDarshan);
router.post('/darshans', createDarshan);
router.put('/darshans/:id', updateDarshan);
router.delete('/darshans/:id', deleteDarshan);

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const Room = require('../models/Room');
    const Booking = require('../models/Booking');
    const User = require('../models/User');
    const Staff = require('../models/Staff');
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalStaff = await Staff.countDocuments();
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);
    res.json({ totalRooms, totalBookings, totalUsers, totalStaff, recentBookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Newsletters
router.get('/newsletters', getAllNewsletters);
router.delete('/newsletters/:id', deleteNewsletter);

module.exports = router;