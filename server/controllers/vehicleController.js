const Vehicle = require('../models/Vehicle');
const { notifyNewVehicle } = require('../utils/email');

exports.getAllVehicles = async (req, res) => {
  try {
    const { type, location, minPrice, maxPrice, rentalType, search, page = 1, limit = 12 } = req.query;
    const filter = { status: 'approved', isAvailable: true };

    if (type && type !== 'all') filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { make: { $regex: search, $options: 'i' } },
    ];
    if (rentalType && minPrice) filter[`pricing.${rentalType}`] = { $gte: Number(minPrice) };
    if (rentalType && maxPrice) filter[`pricing.${rentalType}`] = { ...filter[`pricing.${rentalType}`], $lte: Number(maxPrice) };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Vehicle.countDocuments(filter);
    const vehicles = await Vehicle.find(filter)
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, count: vehicles.length, total, pages: Math.ceil(total / limit), vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'name email phone avatar');
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, owner: req.user._id });

    notifyNewVehicle({
      vehicle,
      ownerName: req.user.name,
      ownerPhone: req.user.phone,
      ownerEmail: req.user.email,
    }).catch(() => {});

    res.status(201).json({ success: true, vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found or unauthorized' });

    Object.assign(vehicle, req.body);
    vehicle.status = 'pending';
    await vehicle.save();
    res.json({ success: true, vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found or unauthorized' });
    res.json({ success: true, message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeaturedVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: 'approved', isAvailable: true })
      .populate('owner', 'name avatar')
      .sort({ totalBookings: -1, rating: -1 })
      .limit(8);
    res.json({ success: true, vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
