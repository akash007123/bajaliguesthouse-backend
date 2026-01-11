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
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      specialRequests
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
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