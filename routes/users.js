const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth, requireRole } = require('../middleware/auth');
const { getBookings, createBooking } = require('../controllers/bookingController');
const { getProfile, updateProfile } = require('../controllers/userController');

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
router.use(requireRole('user'));

router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:id/cancel', require('../controllers/bookingController').cancelBooking);
router.get('/profile', getProfile);
router.put('/profile', upload.single('profilePicture'), updateProfile);

module.exports = router;