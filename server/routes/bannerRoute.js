const express = require('express');
const Banner = require('../models/Banner');

const router = express.Router();

// Get all banners
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.json({ success: true, banners });
    } catch (error) {
        console.error('Fetch banners error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create banner
router.post('/', async (req, res) => {
    try {
        const banner = new Banner(req.body);
        await banner.save();
        res.status(201).json({ success: true, banner });
    } catch (error) {
        console.error('Create banner error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update banner
router.put('/:id', async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }
        res.json({ success: true, banner });
    } catch (error) {
        console.error('Update banner error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete banner
router.delete('/:id', async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }
        res.json({ success: true, message: 'Banner deleted' });
    } catch (error) {
        console.error('Delete banner error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
