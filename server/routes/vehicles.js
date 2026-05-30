const express = require('express');
const router = express.Router();
const {
  getAllVehicles, getVehicle, createVehicle, updateVehicle,
  deleteVehicle, getMyVehicles, getFeaturedVehicles,
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/my', protect, authorize('owner'), getMyVehicles);
router.get('/:id', getVehicle);
router.post('/', protect, authorize('owner'), createVehicle);
router.put('/:id', protect, authorize('owner'), updateVehicle);
router.delete('/:id', protect, authorize('owner'), deleteVehicle);

module.exports = router;
