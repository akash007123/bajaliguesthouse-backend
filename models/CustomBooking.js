const mongoose = require('mongoose');

const customBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  aadharCard: { type: String }, // File path for uploaded aadhar card
  profilePic: { type: String }, // File path for uploaded profile picture
  roomAmount: { type: Number, required: true },
  numberOfRooms: { type: Number, required: true, default: 1 },
  numberOfGuests: { type: Number, required: true, default: 1 },
  roomNo: { type: String, required: true },
  status: { type: String, enum: ['confirmed', 'Active', 'Completed', 'Cancelled'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtual for id
customBookingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
customBookingSchema.set('toJSON', {
  virtuals: true
});

// Update the updatedAt field before saving
customBookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CustomBooking', customBookingSchema);