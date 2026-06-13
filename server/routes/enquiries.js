const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public — submit a self-drive car enquiry
router.post('/', createEnquiry);

// Admin only
router.get('/', protect, authorize('admin'), getEnquiries);
router.patch('/:id/status', protect, authorize('admin'), updateEnquiryStatus);
router.delete('/:id', protect, authorize('admin'), deleteEnquiry);

module.exports = router;
