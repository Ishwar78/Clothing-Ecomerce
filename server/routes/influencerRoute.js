const express = require('express');
const Influencer = require('../models/Influencer');

const router = express.Router();

const defaultInfluencers = [
    {
        name: "@stylewithsbv",
        followers: "24K followers",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
        link: "https://instagram.com",
        order: 1,
        isActive: true
    },
    {
        name: "@the.fashion.diaries",
        followers: "51K followers",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=85",
        link: "https://instagram.com",
        order: 2,
        isActive: true
    },
    {
        name: "@neha.in.style",
        followers: "35K followers",
        image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=85",
        link: "https://instagram.com",
        order: 3,
        isActive: true
    },
    {
        name: "@glamwithpooja",
        followers: "43K followers",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=85",
        link: "https://instagram.com",
        order: 4,
        isActive: true
    },
    {
        name: "@neha.outfits",
        followers: "27K followers",
        image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=85",
        link: "https://instagram.com",
        order: 5,
        isActive: true
    },
    {
        name: "@urbanethnicgirl",
        followers: "27K followers",
        image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=600&q=85",
        link: "https://instagram.com",
        order: 6,
        isActive: true
    }
];

// 1. Get all influencers
router.get('/', async (req, res) => {
    try {
        let influencers = await Influencer.find().sort({ order: 1, createdAt: -1 });
        if (influencers.length === 0) {
            influencers = await Influencer.insertMany(defaultInfluencers);
        }
        res.json({ success: true, influencers });
    } catch (error) {
        console.error('Fetch influencers error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Create influencer
router.post('/', async (req, res) => {
    try {
        const { name, followers, image, link, order, isActive } = req.body;
        if (!name || !image) {
            return res.status(400).json({ success: false, message: 'Name and image are required' });
        }

        const influencer = new Influencer({
            name: name.trim(),
            followers: followers ? followers.trim() : '10K followers',
            image: image.trim(),
            link: link ? link.trim() : '',
            order: Number(order) || 0,
            isActive: isActive !== undefined ? isActive : true
        });

        await influencer.save();
        res.status(201).json({ success: true, influencer, message: 'Influencer added successfully' });
    } catch (error) {
        console.error('Create influencer error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3. Update influencer
router.put('/:id', async (req, res) => {
    try {
        const influencer = await Influencer.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!influencer) {
            return res.status(404).json({ success: false, message: 'Influencer not found' });
        }

        res.json({ success: true, influencer, message: 'Influencer updated successfully' });
    } catch (error) {
        console.error('Update influencer error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 4. Delete influencer
router.delete('/:id', async (req, res) => {
    try {
        const influencer = await Influencer.findByIdAndDelete(req.params.id);
        if (!influencer) {
            return res.status(404).json({ success: false, message: 'Influencer not found' });
        }
        res.json({ success: true, message: 'Influencer deleted successfully' });
    } catch (error) {
        console.error('Delete influencer error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
