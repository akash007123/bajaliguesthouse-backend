const Staff = require('../models/Staff');

exports.getStaff = async (req, res) => {
  console.log('getStaff called');
  try {
    const staff = await Staff.find().lean();
    const staffWithId = staff.map(member => ({ ...member, id: member._id.toString() }));
    res.json(staffWithId);
  } catch (err) {
    console.error('Error in getStaff:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

// Test comment

exports.getStaffMember = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json({ ...staff.toObject(), id: staff._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const staffData = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePic && req.files.profilePic[0]) {
        staffData.profilePic = `${req.protocol}://${req.get('host')}/uploads/${req.files.profilePic[0].filename}`;
      }
      if (req.files.bankPassbook && req.files.bankPassbook[0]) {
        staffData.bankPassbook = `${req.protocol}://${req.get('host')}/uploads/${req.files.bankPassbook[0].filename}`;
      }
      if (req.files.documents) {
        staffData.documents = req.files.documents.map((file, index) => ({
          name: req.body.documentNames ? req.body.documentNames[index] : `Document ${index + 1}`,
          file: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        }));
      }
    }

    // Parse bankDetails if it's a string
    if (typeof staffData.bankDetails === 'string') {
      staffData.bankDetails = JSON.parse(staffData.bankDetails);
    }

    const staff = new Staff(staffData);
    const newStaff = await staff.save();
    res.status(201).json({ ...newStaff.toObject(), id: newStaff._id.toString() });
  } catch (err) {
    console.error('Error in createStaff:', err);
    res.status(400).json({ message: err.message, stack: err.stack });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const staffData = { ...req.body };

    // Handle file uploads (similar to create)
    if (req.files) {
      if (req.files.profilePic && req.files.profilePic[0]) {
        staffData.profilePic = `${req.protocol}://${req.get('host')}/uploads/${req.files.profilePic[0].filename}`;
      }
      if (req.files.bankPassbook && req.files.bankPassbook[0]) {
        staffData.bankPassbook = `${req.protocol}://${req.get('host')}/uploads/${req.files.bankPassbook[0].filename}`;
      }
      if (req.files.documents) {
        staffData.documents = req.files.documents.map((file, index) => ({
          name: req.body.documentNames ? req.body.documentNames[index] : `Document ${index + 1}`,
          file: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        }));
      }
    }

    if (typeof staffData.bankDetails === 'string') {
      staffData.bankDetails = JSON.parse(staffData.bankDetails);
    }

    const staff = await Staff.findByIdAndUpdate(req.params.id, staffData, { new: true });
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json({ ...staff.toObject(), id: staff._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json({ message: 'Staff member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};