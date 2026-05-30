const express = require('express');
const router = express.Router();
const { createRequest, getAllRequests, updateRequest } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

// Public — no auth needed
router.post('/', createRequest);

// Admin only
router.get('/all', protect, authorize('admin'), getAllRequests);
router.put('/:id', protect, authorize('admin'), updateRequest);

module.exports = router;
