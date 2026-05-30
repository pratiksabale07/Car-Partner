const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getOwnerBookings, cancelBooking, addReview,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/vehicle/:vehicleId', protect, authorize('renter'), createBooking);
router.get('/my', protect, authorize('renter'), getMyBookings);
router.get('/owner', protect, authorize('owner'), getOwnerBookings);
router.put('/:id/cancel', protect, authorize('renter'), cancelBooking);
router.put('/:id/review', protect, authorize('renter'), addReview);

module.exports = router;
