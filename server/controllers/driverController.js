const Driver = require('../models/Driver');

// Public — register as a driver (Driver on Time)
exports.registerDriver = async (req, res) => {
  try {
    const { name, address, licenseNumber, phone, email, experience, preferredArea, availability } = req.body;

    if (!name || !address || !licenseNumber || !phone || !preferredArea) {
      return res.status(400).json({ success: false, message: 'Name, address, license number, phone, and preferred area are required' });
    }

    const documents = {};
    if (req.files?.drivingLicense?.[0]) documents.drivingLicense = req.files.drivingLicense[0].path;
    if (req.files?.aadhaarCard?.[0]) documents.aadhaarCard = req.files.aadhaarCard[0].path;
    if (req.files?.policeVerification?.[0]) documents.policeVerification = req.files.policeVerification[0].path;

    const driver = await Driver.create({
      name, address, licenseNumber, phone, email, experience, preferredArea, availability, documents,
    });

    res.status(201).json({ success: true, message: 'Registration successful! We will contact you within 24 hours.', driver });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json({ success: true, drivers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'verified', 'matched', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const driver = await Driver.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, driver });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
