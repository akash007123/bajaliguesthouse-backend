const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userMobile: String,
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['New', 'Pending', 'Approved', 'Cancelled', 'Completed'], default: 'New' },
  specialRequests: String,
  reviewed: { type: Boolean, default: false },
  rating: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

// Virtual for id
bookingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
bookingSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Booking', bookingSchema);