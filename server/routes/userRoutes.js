const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getProfiles,
    getProfileById,
    updateProfile,
    toggleShortlist,
    getShortlistedProfiles,
    getVisitors,
    getNotifications,
    markNotificationRead,
    uploadImage,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/login', authUser);
router.post('/register', registerUser);
router.get('/profiles', getProfiles);
router.get('/profile/:id', getProfileById);
router.put('/profile', protect, updateProfile);
router.post('/shortlist/:id', protect, toggleShortlist);
router.get('/shortlisted', protect, getShortlistedProfiles);
router.get('/visitors', protect, getVisitors);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id', protect, markNotificationRead);
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
