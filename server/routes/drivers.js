const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerDriver, getDrivers, updateDriverStatus, deleteDriver } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

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
