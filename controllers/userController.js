const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    // Ensure profilePicture is a full URL
    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
      user.profilePicture = `${req.protocol}://${req.get('host')}/${user.profilePicture}`;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { currentPassword, newPassword, ...updateData } = req.body;

    // If updating password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }
      const user = await User.findById(req.user.id);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Handle profile picture upload
    if (req.file) {
      updateData.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};