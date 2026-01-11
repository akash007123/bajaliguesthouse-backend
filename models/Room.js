const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Deluxe', 'Executive', 'Presidential', 'Standard'], required: true },
  price: { type: Number, required: true },
  discountPrice: Number,
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  amenities: [String],
  images: [String],
  isAC: { type: Boolean, default: true },
  capacity: { type: Number, required: true },
  bedType: { type: String, required: true },
  size: { type: Number, required: true },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Room', roomSchema);