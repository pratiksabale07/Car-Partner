const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['truck', 'car', 'tractor', 'bus', 'van', 'motorcycle', 'crane', 'excavator', 'pickup', 'trailer', 'other'],
    required: true,
  },
  description: { type: String },
  make: { type: String },
  model: { type: String },
  year: { type: Number },
  capacity: { type: String },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'], default: 'diesel' },
  transmission: { type: String, enum: ['manual', 'automatic'], default: 'manual' },
  location: { type: String, required: true },
  images: [{ type: String }],
  pricing: {
    hourly: { type: Number, default: 0 },
    daily: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 },
  },
  features: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  registrationNumber: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
