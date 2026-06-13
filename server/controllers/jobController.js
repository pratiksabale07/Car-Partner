const JobPosting = require('../models/JobPosting');

// Public — post a driver job opening (Driver on Time)
exports.createJob = async (req, res) => {
  try {
    const { name, phone, email, area, carType, jobType, timing, salary, requirements } = req.body;

    if (!name || !phone || !area || !carType || !jobType || !timing) {
      return res.status(400).json({ success: false, message: 'Name, phone, area, car type, job type, and timing are required' });
    }

    const job = await JobPosting.create({ name, phone, email, area, carType, jobType, timing, salary, requirements });

    res.status(201).json({ success: true, message: 'Job posted successfully! Admin will review and contact you soon.', job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.getJobs = async (req, res) => {
  try {
    const jobs = await JobPosting.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'active', 'matched', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const job = await JobPosting.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin only
exports.deleteJob = async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
