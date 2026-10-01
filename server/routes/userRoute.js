const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
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
