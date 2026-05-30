const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seekerName: { type: String, required: true, trim: true },
  seekerPhone: { type: String, required: true, trim: true },
  seekerEmail: { type: String, required: true, trim: true, lowercase: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  rentalType: { type: String, enum: ['hourly', 'daily', 'monthly', 'yearly'], required: true },
  purpose: { type: String },
  message: { type: String },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'deal-done', 'rejected'],
    default: 'pending',
  },
  adminNote: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
