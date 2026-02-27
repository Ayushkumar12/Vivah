const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
} else {
    console.warn('WARNING: Cloudinary credentials missing in .env. Image uploads will not work.');
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vivah_matrimony',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
