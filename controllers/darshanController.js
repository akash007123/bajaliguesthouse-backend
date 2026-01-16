const Darshan = require('../models/Darshan');

exports.getDarshans = async (req, res) => {
  try {
    const darshans = await Darshan.find({ isActive: true });
    const darshansWithId = darshans.map(darshan => ({ ...darshan.toObject(), id: darshan._id.toString() }));
    res.json(darshansWithId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDarshan = async (req, res) => {
  try {
    const darshan = await Darshan.findById(req.params.id);
    if (!darshan) return res.status(404).json({ message: 'Darshan not found' });
    res.json({ ...darshan.toObject(), id: darshan._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDarshan = async (req, res) => {
  const darshan = new Darshan(req.body);
  try {
    const newDarshan = await darshan.save();
    res.status(201).json({ ...newDarshan.toObject(), id: newDarshan._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateDarshan = async (req, res) => {
  try {
    const darshan = await Darshan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!darshan) return res.status(404).json({ message: 'Darshan not found' });
    res.json({ ...darshan.toObject(), id: darshan._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDarshan = async (req, res) => {
  try {
    const darshan = await Darshan.findByIdAndDelete(req.params.id);
    if (!darshan) return res.status(404).json({ message: 'Darshan not found' });
    res.json({ message: 'Darshan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};