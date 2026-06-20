const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, updateUserStatus, deleteUser,
  getAllVehiclesAdmin, updateVehicleStatus, deleteVehicle,
  getMatches,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/matches', getMatches);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/vehicles', getAllVehiclesAdmin);
router.put('/vehicles/:id/status', updateVehicleStatus);
router.delete('/vehicles/:id', deleteVehicle);

module.exports = router;
