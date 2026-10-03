const express = require('express');
const StyleShare = require('../models/StyleShare');

const router = express.Router();

const initialSeedImages = [
    { image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=500&q=85", title: "Summer Chic", link: "https://instagram.com", order: 1, isActive: true },
    { image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=85", title: "Urban Elegance", link: "https://instagram.com", order: 2, isActive: true },
    { image: "/assets/women.png", title: "Traditional Grace", link: "https://instagram.com", order: 3, isActive: true },
    { image: "/assets/boys.png", title: "Youth Trend", link: "https://instagram.com", order: 4, isActive: true },
    { image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=85", title: "Festive Vibes", link: "https://instagram.com", order: 5, isActive: true },
    { image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=85", title: "Street Luxe", link: "https://instagram.com", order: 6, isActive: true }
];

// Helper to auto-seed initial items if empty
async function seedIfEmpty() {
    try {
        const count = await StyleShare.countDocuments();
        if (count === 0) {
            await StyleShare.insertMany(initialSeedImages);
            console.log('Seeded initial StyleShare items');
        }
    } catch (e) {
        console.error('Error seeding StyleShare:', e);
    }
}

// 1. Get active style items for Home storefront
router.get('/', async (req, res) => {
    try {
        await seedIfEmpty();
        const items = await StyleShare.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, items });
    } catch (error) {
        console.error('Fetch style items error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Get all style items for Admin
router.get('/all', async (req, res) => {
    try {
        await seedIfEmpty();
        const items = await StyleShare.find({}).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, items });
    } catch (error) {
        console.error('Fetch all style items error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3. Add new style item
router.post('/', async (req, res) => {
    try {
        const { image, title, link, order, isActive } = req.body;
        if (!image) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const newItem = new StyleShare({
            image,
            title: title || '',
            link: link || '',
            order: Number(order) || 0,
            isActive: isActive !== undefined ? isActive : true
        });

        await newItem.save();
        res.status(201).json({ success: true, item: newItem, message: 'Style item added successfully' });
    } catch (error) {
        console.error('Add style item error:', error);
        res.status(500).json({ success: false, message: 'Server error adding style item' });
    }
});

// 4. Update style item
router.put('/:id', async (req, res) => {
    try {
        const updated = await StyleShare.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Style item not found' });
        }

        res.json({ success: true, item: updated, message: 'Style item updated successfully' });
    } catch (error) {
        console.error('Update style item error:', error);
        res.status(500).json({ success: false, message: 'Server error updating style item' });
    }
});

// 5. Delete style item
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await StyleShare.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Style item not found' });
        }

        res.json({ success: true, message: 'Style item deleted successfully' });
    } catch (error) {
        console.error('Delete style item error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting style item' });
    }
});

module.exports = router;
