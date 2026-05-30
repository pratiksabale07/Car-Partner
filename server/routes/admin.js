const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, updateUserStatus,
  getAllVehiclesAdmin, updateVehicleStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/vehicles', getAllVehiclesAdmin);
router.put('/vehicles/:id/status', updateVehicleStatus);

module.exports = router;
