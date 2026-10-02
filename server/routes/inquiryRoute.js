const express = require('express');
const Inquiry = require('../models/Inquiry');

const router = express.Router();

// 1. Get all inquiries (Admin)
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json({ success: true, inquiries });
    } catch (error) {
        console.error('Fetch inquiries error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Submit new inquiry (Storefront contact page)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email and message are required' });
        }

        const inquiry = new Inquiry({
            inquiryId: 'INQ-' + Math.floor(100000 + Math.random() * 900000),
            name: name.trim(),
            email: email.trim(),
            phone: phone ? phone.trim() : '',
            subject: subject || 'General',
            message: message.trim()
        });

        await inquiry.save();
        res.status(201).json({
            success: true,
            inquiry,
            message: 'Thank you! Your message has been sent successfully.'
        });
    } catch (error) {
        console.error('Submit inquiry error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3. Update inquiry status (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true }
        );

        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        res.json({ success: true, inquiry, message: 'Inquiry updated successfully' });
    } catch (error) {
        console.error('Update inquiry error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 4. Delete inquiry (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }
        res.json({ success: true, message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error('Delete inquiry error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
