const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const users = [
    {
        fullName: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'password123',
        age: 26,
        gender: 'Female',
        height: "5'4\"",
        caste: 'Brahmin',
        motherTongue: 'Hindi',
        location: {
            city: 'Delhi',
            state: 'Delhi',
            country: 'India'
        },
        profession: 'Software Engineer',
        education: 'B.Tech CS',
        income: '15-20 LPA',
        photos: [
            'https://images.unsplash.com/photo-1594744803329-a584af1cb51e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1589317621382-0cbef7ffcc4c?q=80&w=800&auto=format&fit=crop'
        ],
        bio: 'Looking for someone who values family and has a modern outlook on life.',
        interests: ['Cooking', 'Trekking'],
        familyDetails: {
            fatherStatus: 'Retired Government Officer',
            motherStatus: 'Homemaker',
            siblings: '1 younger brother',
            familyValues: 'Moderate'
        },
        subscriptionTier: 'Gold',
        isVerified: true
    },
    {
        fullName: 'Rahul Verma',
        email: 'rahul@example.com',
        password: 'password123',
        age: 29,
        gender: 'Male',
        height: "5'11\"",
        caste: 'Khatri',
        motherTongue: 'Punjabi',
        location: {
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India'
        },
        profession: 'Marketing Manager',
        education: 'MBA',
        income: '25-30 LPA',
        photos: [
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop'
        ],
        bio: 'Professional living in Mumbai, love fitness and outdoor activities.',
        interests: ['Fitness', 'Cycling'],
        familyDetails: {
            fatherStatus: 'Businessman',
            motherStatus: 'Businesswoman',
            familyValues: 'Liberal'
        },
        subscriptionTier: 'Diamond',
        isVerified: true
    },
    {
        fullName: 'Ananya Iyer',
        email: 'ananya@example.com',
        password: 'password123',
        age: 25,
        gender: 'Female',
        height: "5'6\"",
        caste: 'Iyer',
        motherTongue: 'Tamil',
        location: {
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India'
        },
        profession: 'Data Scientist',
        education: 'MS Data Science',
        income: '12-15 LPA',
        photos: [
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
        ],
        bio: 'Bharatanatyam dancer and tech enthusiast. Looking for a soulmate who appreciates art and science.',
        interests: ['Dancing', 'Reading', 'AI'],
        familyDetails: {
            fatherStatus: 'Doctor',
            motherStatus: 'Professor',
            siblings: '1 elder sister',
            familyValues: 'Traditional'
        },
        subscriptionTier: 'Free',
        isVerified: false
    },
    {
        fullName: 'Jaspreet Singh',
        email: 'jaspreet@example.com',
        password: 'password123',
        age: 28,
        gender: 'Male',
        height: "6'0\"",
        caste: 'Jat',
        motherTongue: 'Punjabi',
        location: {
            city: 'Chandigarh',
            state: 'Punjab',
            country: 'India'
        },
        profession: 'Pharmacist',
        education: 'B.Pharm',
        income: '10-12 LPA',
        photos: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
        ],
        bio: 'Gentle soul from Chandigarh. Love nature and long drives.',
        interests: ['Bhangra', 'Farming', 'Music'],
        familyDetails: {
            fatherStatus: 'Landlord',
            motherStatus: 'Homemaker',
            siblings: '2 brothers',
            familyValues: 'Traditional'
        },
        subscriptionTier: 'Silver',
        isVerified: true
    },
    {
        fullName: 'Fatima Khan',
        email: 'fatima@example.com',
        password: 'password123',
        age: 24,
        gender: 'Female',
        height: "5'3\"",
        caste: 'Sunni',
        motherTongue: 'Urdu',
        location: {
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India'
        },
        profession: 'Architect',
        education: 'B.Arch',
        income: '8-10 LPA',
        photos: [
            'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop'
        ],
        bio: 'Passionate about heritage and design. Looking for a respectful partner.',
        interests: ['Painting', 'History', 'Cooking'],
        familyDetails: {
            fatherStatus: 'Architect',
            motherStatus: 'Artist',
            siblings: '1 sister',
            familyValues: 'Moderate'
        },
        subscriptionTier: 'Free',
        isVerified: true
    },
    {
        fullName: 'David Dsouza',
        email: 'david@example.com',
        password: 'password123',
        age: 31,
        gender: 'Male',
        height: "5'9\"",
        caste: 'Roman Catholic',
        motherTongue: 'English',
        location: {
            city: 'Goa',
            state: 'Goa',
            country: 'India'
        },
        profession: 'Chef',
        education: 'Hotel Management',
        income: '18-22 LPA',
        photos: [
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop'
        ],
        bio: 'Foodie, musician, and nature lover. Looking for someone to share life adventures with.',
        interests: ['Cooking', 'Guitar', 'Surfing'],
        familyDetails: {
            fatherStatus: 'Business Owner',
            motherStatus: 'Teacher',
            siblings: 'None',
            familyValues: 'Liberal'
        },
        subscriptionTier: 'Gold',
        isVerified: true
    }
];

const importData = async () => {
    try {
        await User.deleteMany();
        await User.create(users);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
