const Enquiry = require('../models/Enquiry');

// Public — submit a self-drive car enquiry (Driver on Time)
exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, date, vehicleType, destination } = req.body;

    if (!name || !phone || !date || !vehicleType || !destination) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const enquiry = await Enquiry.create({ name, phone, date, vehicleType, destination });

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully! We will contact you soon.', enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'booked', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
