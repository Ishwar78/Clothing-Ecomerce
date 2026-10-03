const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../utils/mailer');

const router = express.Router();

// -------------------------------------------------------------
// OTP-BASED AUTHENTICATION (SIGNUP & LOGIN)
// -------------------------------------------------------------

// 1. Send OTP for Signup
router.post('/send-signup-otp', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!email || !name) {
            return res.status(400).json({ success: false, message: 'Name and email are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists. Please login instead.'
            });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing signup OTP for this email
        await Otp.deleteMany({ email: normalizedEmail, purpose: 'signup' });

        // Save new OTP
        await Otp.create({
            email: normalizedEmail,
            otp: otpCode,
            purpose: 'signup'
        });

        // Send OTP email
        await sendOtpEmail(normalizedEmail, otpCode, 'signup', name);

        res.json({
            success: true,
            message: `Verification code sent to ${normalizedEmail}.`
        });
    } catch (error) {
        console.error('Send signup OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send verification code: ' + (error.message || 'Server error')
        });
    }
});

// 2. Verify OTP & Complete Signup
router.post('/verify-signup-otp', async (req, res) => {
    try {
        const { name, email, phone, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const cleanOtp = String(otp).trim();

        // Find OTP record
        const record = await Otp.findOne({
            email: normalizedEmail,
            purpose: 'signup'
        }).sort({ createdAt: -1 });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired or was not requested. Please request a new code.'
            });
        }

        if (record.otp !== cleanOtp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code. Please check and try again.'
            });
        }

        // Valid OTP -> Delete it
        await Otp.deleteMany({ email: normalizedEmail, purpose: 'signup' });

        // Create User
        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            user = new User({
                name: (name || 'Member').trim(),
                email: normalizedEmail,
                phone: (phone || '').trim(),
                password: ''
            });
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'user' },
            process.env.JWT_SECRET || 'user_secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            message: 'Account verified and created successfully!'
        });
    } catch (error) {
        console.error('Verify signup OTP error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error verifying code'
        });
    }
});

// 3. Send OTP for Login
router.post('/send-login-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email address is required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email. Please create an account first.'
            });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing login OTP for this email
        await Otp.deleteMany({ email: normalizedEmail, purpose: 'login' });

        // Save new OTP
        await Otp.create({
            email: normalizedEmail,
            otp: otpCode,
            purpose: 'login'
        });

        // Send OTP email
        await sendOtpEmail(normalizedEmail, otpCode, 'login', user.name);

        res.json({
            success: true,
            message: `Verification code sent to ${normalizedEmail}.`
        });
    } catch (error) {
        console.error('Send login OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send login code: ' + (error.message || 'Server error')
        });
    }
});

// 4. Verify OTP & Complete Login
router.post('/verify-login-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const cleanOtp = String(otp).trim();

        // Find OTP record
        const record = await Otp.findOne({
            email: normalizedEmail,
            purpose: 'login'
        }).sort({ createdAt: -1 });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired or was not requested. Please request a new code.'
            });
        }

        if (record.otp !== cleanOtp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code. Please check and try again.'
            });
        }

        // Valid OTP -> Delete it
        await Otp.deleteMany({ email: normalizedEmail, purpose: 'login' });

        // Find User
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'user' },
            process.env.JWT_SECRET || 'user_secret',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            message: 'Logged in successfully!'
        });
    } catch (error) {
        console.error('Verify login OTP error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error verifying code'
        });
    }
});

// -------------------------------------------------------------
// LEGACY PASSWORD AUTHENTICATION (BACKWARD COMPATIBILITY)
// -------------------------------------------------------------

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = password ? await bcrypt.hash(password, salt) : '';
        
        user = new User({
            name,
            email,
            phone,
            password: hashedPassword
        });
        
        await user.save();
        
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Please signup first' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }
        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'user' },
            process.env.JWT_SECRET || 'user_secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all users (For Admin Dashboard)
router.get('/all', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get saved addresses for a user
router.get('/addresses', async (req, res) => {
    try {
        const { email, userId } = req.query;
        if (!email && !userId) {
            return res.json({ success: true, addresses: [] });
        }

        const query = userId ? { _id: userId } : { email: email.trim().toLowerCase() };
        const user = await User.findOne(query);

        if (!user) {
            return res.json({ success: true, addresses: [] });
        }

        res.json({ success: true, addresses: user.savedAddresses || [] });
    } catch (error) {
        console.error('Fetch addresses error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add a saved address
router.post('/addresses', async (req, res) => {
    try {
        const { email, userId, address } = req.body;
        if (!address || (!email && !userId)) {
            return res.status(400).json({ success: false, message: 'User and Address are required' });
        }

        const query = userId ? { _id: userId } : { email: email.trim().toLowerCase() };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.savedAddresses) user.savedAddresses = [];

        // Check duplicate
        const isDuplicate = user.savedAddresses.some(
            a => a.address.trim().toLowerCase() === (address.address || '').trim().toLowerCase() &&
                 a.pincode.trim() === (address.pincode || '').trim()
        );

        if (!isDuplicate) {
            user.savedAddresses.push({
                fullName: address.fullName,
                phone: address.phone,
                email: address.email || user.email,
                address: address.address,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                isDefault: user.savedAddresses.length === 0
            });
            await user.save();
        }

        res.json({ success: true, addresses: user.savedAddresses, message: 'Address saved successfully' });
    } catch (error) {
        console.error('Save address error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

// Delete a saved address
router.delete('/addresses/:addressId', async (req, res) => {
    try {
        const { email, userId } = req.query;
        const { addressId } = req.params;

        const query = userId ? { _id: userId } : { email: email?.trim().toLowerCase() };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.savedAddresses = user.savedAddresses.filter(a => a._id.toString() !== addressId);
        await user.save();

        res.json({ success: true, addresses: user.savedAddresses, message: 'Address removed successfully' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
