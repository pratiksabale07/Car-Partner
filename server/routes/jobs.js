const express = require('express');
const router = express.Router();
const { createJob, getJobs, updateJobStatus, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public — post a driver job opening
router.post('/', createJob);

// Admin only
router.get('/', protect, authorize('admin'), getJobs);
router.patch('/:id/status', protect, authorize('admin'), updateJobStatus);
router.delete('/:id', protect, authorize('admin'), deleteJob);

module.exports = router;
