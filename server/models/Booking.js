const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  rentalType: { type: String, enum: ['hourly', 'daily', 'monthly', 'yearly'], required: true },
  quantity: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  purpose: { type: String },
  pickupLocation: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  adminNote: { type: String },
  cancelReason: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
