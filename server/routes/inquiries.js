const express = require('express');
const router = express.Router();
const { createInquiry, getAllInquiries, updateInquiry, getOwnerInquiries } = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public — no auth needed
router.post('/vehicle/:vehicleId', createInquiry);

// Owner — inquiries about their vehicles
router.get('/my', protect, authorize('owner'), getOwnerInquiries);

// Admin only
router.get('/all', protect, authorize('admin'), getAllInquiries);
router.put('/:id', protect, authorize('admin'), updateInquiry);

module.exports = router;
