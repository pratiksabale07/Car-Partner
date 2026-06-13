const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  // Car owner / poster details
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  // Job details
  area: { type: String, required: true, trim: true },
  carType: { type: String, required: true, trim: true },
  jobType: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'monthly', 'temporary'],
  },
  timing: { type: String, required: true, trim: true },
  salary: { type: String, trim: true },
  requirements: { type: String, trim: true },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'active', 'matched', 'closed'],
  },
}, { timestamps: true });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
