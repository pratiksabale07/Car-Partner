const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const driverDocStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'carpartner/driver-docs',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  }),
});

module.exports = { cloudinary, driverDocStorage };
