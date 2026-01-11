const express = require('express');
const router = express.Router();
const multer = require('multer');
const { signup, login } = require('../controllers/authController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/signup', upload.single('profilePicture'), signup);
router.post('/login', login);

module.exports = router;