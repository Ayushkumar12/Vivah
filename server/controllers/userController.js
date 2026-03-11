const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { cloudinary } = require('../config/cloudinary');

const countWords = (str) => {
    if (!str) return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
};


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                gender: user.gender,
                age: user.age,
                photos: user.photos,
                subscriptionTier: user.subscriptionTier,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const {
            fullName, email, password, gender, age, religion,
            caste, motherTongue, height, weight, skinColor, city, state,
            profession, education, income, bio, interests,
            familyDetails, photos
        } = req.body;

        if (bio && countWords(bio) > 300) {
            res.status(400).json({ message: 'Bio must be 300 words or less' });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            fullName,
            email,
            password,
            gender,
            age,
            religion,
            caste,
            motherTongue,
            height,
            weight,
            skinColor,
            location: { city, state },
            profession,
            education,
            income,
            bio,
            interests,
            familyDetails,
            photos: photos || [],
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all profiles with filters
// @route   GET /api/users/profiles
// @access  Public
const getProfiles = async (req, res) => {
    try {
        const { religion, ageMin, ageMax, gender, city, search } = req.query;
        let query = { isAdmin: { $ne: true } }; // Never show admin accounts as profiles

        if (religion && religion !== 'All') query.religion = religion;
        if (gender && gender !== 'All') query.gender = gender;
        if (city && city !== 'All') query['location.city'] = new RegExp(city, 'i');

        if (ageMin || ageMax) {
            query.age = {};
            if (ageMin) query.age.$gte = parseInt(ageMin);
            if (ageMax) query.age.$lte = parseInt(ageMax);
        }

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { profession: { $regex: search, $options: 'i' } },
                { education: { $regex: search, $options: 'i' } },
            ];
        }

        const profiles = await User.find(query).select('-password');
        res.json(profiles);
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile by ID
// @route   GET /api/users/profile/:id
// @access  Public
const getProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user && user.isAdmin) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        if (user) {
            // Record visitor if authenticated
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer')) {
                try {
                    const token = authHeader.split(' ')[1];
                    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
                    const visitorId = decoded.id;

                    if (visitorId && visitorId !== user._id.toString()) {
                        await User.findByIdAndUpdate(user._id, {
                            $push: { visitors: { user: visitorId, visitedAt: new Date() } }
                        });
                    }
                } catch (err) {
                    console.warn('Visitor record failed: Invalid token');
                }
            }

            res.json({
                ...user._doc,
                id: user._id
            });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Profile Fetch Error Details:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not found in request' });
        }
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;
            user.religion = req.body.religion || user.religion;
            user.caste = req.body.caste || user.caste;
            user.motherTongue = req.body.motherTongue || user.motherTongue;
            user.height = req.body.height || user.height;
            user.weight = req.body.weight || user.weight;
            user.skinColor = req.body.skinColor || user.skinColor;
            user.profession = req.body.profession || user.profession;
            user.education = req.body.education || user.education;
            user.income = req.body.income || user.income;

            if (req.body.bio) {
                if (countWords(req.body.bio) > 300) {
                    return res.status(400).json({ message: 'Bio must be 300 words or less' });
                }
                user.bio = req.body.bio;
            }

            user.interests = req.body.interests || user.interests;
            user.familyDetails = req.body.familyDetails || user.familyDetails;
            user.location = req.body.location || user.location;

            if (req.body.photos) {
                user.photos = req.body.photos;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            const userObj = updatedUser.toObject();
            delete userObj.password;

            res.json({
                ...userObj,
                id: updatedUser._id,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Error Details:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Upload image to Cloudinary
// @route   POST /api/users/upload
// @access  Private
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ url: req.file.path });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
};

// @desc    Toggle shortlist a profile
// @route   POST /api/users/shortlist/:id
// @access  Private
const toggleShortlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const profilId = req.params.id;

        if (user.shortlisted.includes(profilId)) {
            user.shortlisted = user.shortlisted.filter(id => id.toString() !== profilId);
            await user.save();
            res.json({ message: 'Removed from shortlist', isShortlisted: false });
        } else {
            user.shortlisted.push(profilId);
            await user.save();
            res.json({ message: 'Added to shortlist', isShortlisted: true });
        }
    } catch (error) {
        console.error('Shortlist Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get shortlisted profiles
// @route   GET /api/users/shortlisted
// @access  Private
const getShortlistedProfiles = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('shortlisted', '-password');
        res.json(user.shortlisted);
    } catch (error) {
        console.error('Shortlist Fetch Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get profile visitors
// @route   GET /api/users/visitors
// @access  Private
const getVisitors = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('visitors.user', 'fullName photos age location religion profession');

        // Return unique visitors, sorted by most recent
        const uniqueVisitors = [];
        const seenIds = new Set();

        const sortedVisitors = user.visitors.sort((a, b) => b.visitedAt - a.visitedAt);

        for (const visitor of sortedVisitors) {
            if (!seenIds.has(visitor.user._id.toString())) {
                uniqueVisitors.push(visitor);
                seenIds.add(visitor.user._id.toString());
            }
        }

        res.json(uniqueVisitors.slice(0, 10)); // Top 10 recent unique visitors
    } catch (error) {
        console.error('Visitors Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('notifications.from', 'fullName photos');

        res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
        console.error('Notifications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id
// @access  Private
const markNotificationRead = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const notification = user.notifications.id(req.params.id);

        if (notification) {
            notification.read = true;
            await user.save();
            res.json({ message: 'Notification marked as read' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        console.error('Notification Update Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    authUser,
    registerUser,
    getProfiles,
    getProfileById,
    updateProfile,
    uploadImage,
    toggleShortlist,
    getShortlistedProfiles,
    getVisitors,
    getNotifications,
    markNotificationRead,
};
