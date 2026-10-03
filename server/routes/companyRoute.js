const express = require('express');
const CompanyDetails = require('../models/CompanyDetails');

const router = express.Router();

// 1. Get company billing details
router.get('/', async (req, res) => {
    try {
        let details = await CompanyDetails.findOne();
        if (!details) {
            details = await CompanyDetails.create({});
        }
        res.json({ success: true, company: details });
    } catch (error) {
        console.error('Fetch company details error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Update company billing details
router.put('/', async (req, res) => {
    try {
        let details = await CompanyDetails.findOne();
        if (!details) {
            details = new CompanyDetails(req.body);
        } else {
            Object.assign(details, req.body);
        }
        await details.save();
        res.json({ success: true, company: details, message: 'Company details updated successfully' });
    } catch (error) {
        console.error('Update company details error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
