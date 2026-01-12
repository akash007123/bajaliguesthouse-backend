const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  bankPassbook: {
    type: String, // File path
    required: false
  },
  profilePic: {
    type: String, // File path
    required: false
  },
  documents: [{
    name: {
      type: String,
      required: true
    },
    file: {
      type: String, // File path
      required: true
    }
  }],
  bankDetails: {
    bankName: String,
    accountNo: String,
    ifsc: String,
    branch: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);