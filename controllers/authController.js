const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password, mobile, address, role } = req.body;
  const profilePicture = req.file ? req.file.path : null;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, mobile, address, profilePicture, role: role || 'user' });
    await user.save();

    const token = jwt.sign({ id: user._id, name, email, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, name, email, mobile, address, profilePicture, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, name: user.name, email, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email, profilePicture: user.profilePicture, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};