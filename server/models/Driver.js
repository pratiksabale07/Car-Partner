const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
  licenseNumber: { type: String, required: true, trim: true },
  experience: { type: String, trim: true },
  preferredArea: { type: String, required: true, trim: true },
  availability: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'flexible'],
    default: 'flexible',
  },
  documents: {
    drivingLicense: { type: String },
    aadhaarCard: { type: String },
    policeVerification: { type: String },
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'verified', 'matched', 'inactive'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
