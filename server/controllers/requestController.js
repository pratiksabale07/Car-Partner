const Request = require('../models/Request');
const { notifyNewRequest } = require('../utils/email');

// Public — no auth required
exports.createRequest = async (req, res) => {
  try {
    const { seekerName, seekerPhone, seekerEmail, vehicleType, purpose } = req.body;
    if (!seekerName || !seekerPhone || !seekerEmail || !vehicleType || !purpose)
      return res.status(400).json({ success: false, message: 'Name, phone, email, vehicle type and purpose are required' });

    const request = await Request.create(req.body);

    notifyNewRequest({ request }).catch(() => {});

    res.status(201).json({ success: true, message: 'Your request has been submitted. We will find a vehicle for you.', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.getAllRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Request.countDocuments(filter);
    const requests = await Request.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
