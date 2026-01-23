const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

exports.getBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.userId = req.user.id;
    }
    const bookings = await Booking.find(query).populate('roomId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  const { roomId, checkIn, checkOut, guests, specialRequests } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.available) return res.status(400).json({ message: 'Room is not available' });

    // Fetch user details
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if dates are valid
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check if booking dates are within room availability dates
    if (room.availableFrom && checkInDate < new Date(room.availableFrom)) {
      return res.status(400).json({ message: 'Room is not available on the selected check-in date' });
    }
    if (room.availableTo && checkOutDate > new Date(room.availableTo)) {
      return res.status(400).json({ message: 'Room is not available on the selected check-out date' });
    }

    if (guests > room.capacity) return res.status(400).json({ message: 'Number of guests exceeds room capacity' });

    // Check for overlapping bookings
    const existingBookings = await Booking.find({
      roomId,
      status: { $ne: 'Cancelled' },
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
        { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } }
      ]
    });
    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    const price = room.discountPrice || room.price;
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = price * days;

    const booking = new Booking({
      roomId,
      roomName: room.name,
      userId: req.user.id,
      userName: user.name,
      userEmail: user.email,
      userMobile: user.mobile,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      specialRequests
    });
    await booking.save();

    // Emit real-time notification to admins
    const io = req.app.get('io');
    if (io) {
      io.emit('newBooking', {
        id: booking._id,
        userName: user.name,
        roomName: room.name,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        totalPrice,
        createdAt: new Date().toISOString(),
        type: 'newBooking'
      });
    }

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const updateData = { status: req.body.status };
    if (req.body.status === 'Approved') {
      updateData.approvedBy = req.user.name; // Assuming req.user has name
      updateData.approvedAt = new Date();
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Emit real-time notification if booking is approved
    if (req.body.status === 'Approved') {
      const io = req.app.get('io');
      if (io) {
        io.emit('bookingApproved', {
          id: booking._id,
          userId: booking.userId,
          userName: booking.userName,
          roomName: booking.roomName,
          checkIn: booking.checkIn.toISOString(),
          checkOut: booking.checkOut.toISOString(),
          totalPrice: booking.totalPrice,
          createdAt: new Date().toISOString(),
          type: 'bookingApproved'
        });
      }
    }

    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });
    booking.status = 'Cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });
    if (booking.status !== 'Completed') return res.status(400).json({ message: 'Can only review completed bookings' });
    if (booking.reviewed) return res.status(400).json({ message: 'Booking already reviewed' });

    const { rating, feedback } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating' });

    booking.rating = rating;
    booking.feedback = feedback;
    booking.reviewed = true;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Booking.find({ reviewed: true }).populate('roomId');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { reviewApproved: req.body.approved }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Review not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Booking.find({ reviewed: true, reviewApproved: true }).populate('userId', 'profilePicture name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};