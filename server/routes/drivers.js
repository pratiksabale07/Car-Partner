const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerDriver, getDrivers, updateDriverStatus, deleteDriver } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');
const { driverDocStorage } = require('../config/cloudinary');

const upload = multer({ storage: driverDocStorage, limits: { fileSize: 5 * 1024 * 1024 } });

const uploadFields = upload.fields([
  { name: 'drivingLicense', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'policeVerification', maxCount: 1 },
]);

// Public — register as a driver
router.post('/', uploadFields, registerDriver);

// Admin only
router.get('/', protect, authorize('admin'), getDrivers);
router.patch('/:id/status', protect, authorize('admin'), updateDriverStatus);
router.delete('/:id', protect, authorize('admin'), deleteDriver);

module.exports = router;
