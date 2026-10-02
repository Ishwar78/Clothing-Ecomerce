const express = require('express');
const ContactInfo = require('../models/ContactInfo');

const router = express.Router();

// 1. Get contact information
router.get('/', async (req, res) => {
    try {
        let contact = await ContactInfo.findOne();
        if (!contact) {
            contact = new ContactInfo();
            await contact.save();
        }
        res.json({ success: true, contact });
    } catch (error) {
        console.error('Fetch contact error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Update contact information (Admin)
router.put('/', async (req, res) => {
    try {
        let contact = await ContactInfo.findOne();
        if (!contact) {
            contact = new ContactInfo(req.body);
        } else {
            Object.assign(contact, req.body);
        }
        await contact.save();
        res.json({
            success: true,
            contact,
            message: 'Contact details updated successfully'
        });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
