const Inquiry = require('../models/Inquiry');
const Vehicle = require('../models/Vehicle');
const { notifyNewInquiry } = require('../utils/email');

// Public — no auth required
exports.createInquiry = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId).populate('owner', 'name email phone');
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    if (vehicle.status !== 'approved')
      return res.status(400).json({ success: false, message: 'This vehicle is not available for inquiries' });

    const { seekerName, seekerPhone, seekerEmail, startDate, endDate, rentalType, purpose, message } = req.body;

    if (!seekerName || !seekerPhone || !seekerEmail)
      return res.status(400).json({ success: false, message: 'Your name, phone, and email are required' });

    const inquiry = await Inquiry.create({
      vehicle: vehicle._id,
      owner: vehicle.owner._id,
      seekerName, seekerPhone, seekerEmail,
      startDate, endDate, rentalType, purpose, message,
    });

    notifyNewInquiry({
      inquiry,
      vehicleTitle: vehicle.title,
      vehicleType: vehicle.type,
      ownerName: vehicle.owner.name,
      ownerPhone: vehicle.owner.phone,
      ownerEmail: vehicle.owner.email,
    }).catch(() => {});

    res.status(201).json({ success: true, message: 'Your inquiry has been submitted. We will contact you shortly.', inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.getAllInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .populate('vehicle', 'title type images location pricing')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('vehicle', 'title type images location')
      .populate('owner', 'name email phone');
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Owner — see inquiries for their own vehicles
exports.getOwnerInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user._id })
      .populate('vehicle', 'title type images')
      .sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
