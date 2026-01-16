const mongoose = require('mongoose');

const darshanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, default: 'Temple' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Darshan', darshanSchema);