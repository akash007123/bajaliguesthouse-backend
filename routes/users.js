const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { auth, requireRole } = require('../middleware/auth');
const { getBookings, createBooking } = require('../controllers/bookingController');
const { getProfile, updateProfile } = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substring(2) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.use(auth);
router.use(requireRole('user'));

router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:id/cancel', require('../controllers/bookingController').cancelBooking);
router.post('/bookings/:id/review', require('../controllers/bookingController').submitReview);
router.get('/profile', getProfile);
router.put('/profile', upload.single('profilePicture'), updateProfile);

module.exports = router;