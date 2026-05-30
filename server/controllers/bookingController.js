const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

exports.createBooking = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    if (!vehicle.isAvailable || vehicle.status !== 'approved')
      return res.status(400).json({ success: false, message: 'Vehicle not available for booking' });
    if (vehicle.owner.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot book your own vehicle' });

    const { startDate, endDate, rentalType, purpose, pickupLocation } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;

    let duration;
    const price = vehicle.pricing[rentalType] || 0;
    if (rentalType === 'hourly') duration = diff / (1000 * 60 * 60);
    else if (rentalType === 'daily') duration = diff / (1000 * 60 * 60 * 24);
    else if (rentalType === 'monthly') duration = diff / (1000 * 60 * 60 * 24 * 30);
    else duration = diff / (1000 * 60 * 60 * 24 * 365);

    const totalAmount = Math.ceil(duration) * price;

    const booking = await Booking.create({
      vehicle: vehicle._id,
      renter: req.user._id,
      owner: vehicle.owner,
      startDate: start,
      endDate: end,
      rentalType,
      totalAmount,
      purpose,
      pickupLocation,
    });

    await booking.populate(['vehicle', 'renter']);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate('vehicle', 'title type images location pricing')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('vehicle', 'title type images')
      .populate('renter', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, renter: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!['pending', 'approved'].includes(booking.status))
      return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });

    booking.status = 'cancelled';
    booking.cancelReason = req.body.reason || 'Cancelled by user';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, renter: req.user._id, status: 'completed' });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found or not completed' });

    booking.rating = req.body.rating;
    booking.review = req.body.review;
    await booking.save();

    const vehicle = await Vehicle.findById(booking.vehicle);
    const reviews = await Booking.find({ vehicle: booking.vehicle, rating: { $exists: true } });
    vehicle.rating = reviews.reduce((acc, b) => acc + b.rating, 0) / reviews.length;
    vehicle.totalRatings = reviews.length;
    await vehicle.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
