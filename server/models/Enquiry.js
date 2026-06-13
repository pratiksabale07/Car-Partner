const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  vehicleType: { type: String, required: true, enum: ['manual', 'automatic'] },
  destination: { type: String, required: true, trim: true },
  status: {
    type: String,
    default: 'new',
    enum: ['new', 'contacted', 'booked', 'cancelled'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
