const CustomBooking = require('../models/CustomBooking');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file types
    if (file.fieldname === 'aadharCard') {
      if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for Aadhar card. Only images and PDF allowed.'), false);
      }
    } else if (file.fieldname === 'profilePic') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for profile picture. Only images allowed.'), false);
      }
    } else {
      cb(new Error('Unexpected field'), false);
    }
  }
});

// Middleware for handling file uploads
const uploadFields = upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 }
]);

// Get all custom bookings with pagination
exports.getCustomBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBookings = await CustomBooking.countDocuments();
    const bookings = await CustomBooking.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNext: page * limit < totalBookings,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single custom booking
exports.getCustomBooking = async (req, res) => {
  try {
    const booking = await CustomBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Custom booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new custom booking
exports.createCustomBooking = [
  uploadFields,
  async (req, res) => {
    try {
      const bookingData = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body.address,
        roomAmount: parseFloat(req.body.roomAmount),
        numberOfRooms: parseInt(req.body.numberOfRooms) || 1,
        numberOfGuests: parseInt(req.body.numberOfGuests) || 1,
        roomNo: req.body.roomNo
      };

      // Handle file uploads
      if (req.files) {
        if (req.files.aadharCard && req.files.aadharCard[0]) {
          bookingData.aadharCard = req.files.aadharCard[0].filename;
        }
        if (req.files.profilePic && req.files.profilePic[0]) {
          bookingData.profilePic = req.files.profilePic[0].filename;
        }
      }

      const booking = new CustomBooking(bookingData);
      await booking.save();
      res.status(201).json(booking);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

// Update custom booking
exports.updateCustomBooking = [
  uploadFields,
  async (req, res) => {
    try {
      const booking = await CustomBooking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Custom booking not found' });

      // Update fields
      const updateData = {};
      const fields = ['name', 'email', 'mobile', 'address', 'roomAmount', 'numberOfRooms', 'numberOfGuests', 'roomNo', 'status'];

      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          if (['roomAmount', 'numberOfRooms', 'numberOfGuests'].includes(field)) {
            updateData[field] = parseFloat(req.body[field]) || parseInt(req.body[field]);
          } else {
            updateData[field] = req.body[field];
          }
        }
      });

      // Handle file uploads (replace existing files)
      if (req.files) {
        if (req.files.aadharCard && req.files.aadharCard[0]) {
          updateData.aadharCard = req.files.aadharCard[0].filename;
          // TODO: Delete old file if exists
        }
        if (req.files.profilePic && req.files.profilePic[0]) {
          updateData.profilePic = req.files.profilePic[0].filename;
          // TODO: Delete old file if exists
        }
      }

      const updatedBooking = await CustomBooking.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updatedBooking);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

// Delete custom booking
exports.deleteCustomBooking = async (req, res) => {
  try {
    const booking = await CustomBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Custom booking not found' });

    // TODO: Delete associated files (aadharCard and profilePic)

    await CustomBooking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Custom booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update booking status
exports.updateCustomBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await CustomBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Custom booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};