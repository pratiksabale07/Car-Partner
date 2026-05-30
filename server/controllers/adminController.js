const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Inquiry = require('../models/Inquiry');
const Request = require('../models/Request');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalOwners, totalVehicles, totalInquiries, totalRequests, pendingVehicles, pendingInquiries] =
      await Promise.all([
        User.countDocuments({ role: 'owner' }),
        Vehicle.countDocuments({ status: 'approved' }),
        Inquiry.countDocuments(),
        Request.countDocuments(),
        Vehicle.countDocuments({ status: 'pending' }),
        Inquiry.countDocuments({ status: 'pending' }),
      ]);

    const recentInquiries = await Inquiry.find()
      .populate('vehicle', 'title type')
      .populate('owner', 'name phone')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: { totalOwners, totalVehicles, totalInquiries, totalRequests, pendingVehicles, pendingInquiries },
      recentInquiries,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { role: 'owner' };
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ success: true, total, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllVehiclesAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Vehicle.countDocuments(filter);
    const vehicles = await Vehicle.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVehicleStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { status, adminNote }, { new: true })
      .populate('owner', 'name email phone');
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
