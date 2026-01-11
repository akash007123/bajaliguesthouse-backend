const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    const roomsWithId = rooms.map(room => ({ ...room.toObject(), id: room._id.toString() }));
    res.json(roomsWithId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room.toObject(), id: room._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRoom = async (req, res) => {
  const room = new Room(req.body);
  try {
    const newRoom = await room.save();
    res.status(201).json({ ...newRoom.toObject(), id: newRoom._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room.toObject(), id: room._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};