const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  seekerName: { type: String, required: true, trim: true },
  seekerPhone: { type: String, required: true, trim: true },
  seekerEmail: { type: String, required: true, trim: true, lowercase: true },
  vehicleType: { type: String, required: true },
  purpose: { type: String, required: true },
  rentalType: { type: String, enum: ['hourly', 'daily', 'monthly', 'yearly'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String },
  budget: { type: Number },
  quantity: { type: Number, default: 1 },
  additionalDetails: { type: String },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'fulfilled', 'rejected'],
    default: 'pending',
  },
  adminResponse: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
