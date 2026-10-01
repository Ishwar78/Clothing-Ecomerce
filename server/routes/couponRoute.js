const express = require('express');
const Coupon = require('../models/Coupon');

const router = express.Router();

// 1. Get all coupons (Admin and Storefront)
router.get('/', async (req, res) => {
    try {
        const { activeOnly } = req.query;
        let query = {};
        if (activeOnly === 'true') {
            query.isActive = true;
            query.$or = [
                { expiryDate: { $exists: false } },
                { expiryDate: null },
                { expiryDate: { $gte: new Date() } }
            ];
        }
        const coupons = await Coupon.find(query).sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        console.error('Fetch coupons error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Create coupon (Admin)
router.post('/', async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            expiryDate,
            isActive,
            description
        } = req.body;

        if (!code || !discountValue) {
            return res.status(400).json({ success: false, message: 'Code and Discount Value are required' });
        }

        const normalizedCode = code.trim().toUpperCase();
        const existing = await Coupon.findOne({ code: normalizedCode });
        if (existing) {
            return res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
        }

        const newCoupon = new Coupon({
            code: normalizedCode,
            discountType: discountType === 'flat' ? 'flat' : 'percentage',
            discountValue: Number(discountValue),
            minOrderAmount: Number(minOrderAmount) || 0,
            maxDiscount: Number(maxDiscount) || 0,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            isActive: isActive !== false,
            description: description || ''
        });

        await newCoupon.save();
        res.status(201).json({ success: true, coupon: newCoupon, message: 'Coupon created successfully' });
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

// 3. Update coupon (Admin)
router.put('/:id', async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            expiryDate,
            isActive,
            description
        } = req.body;

        const updateData = {};
        if (code) updateData.code = code.trim().toUpperCase();
        if (discountType) updateData.discountType = discountType;
        if (discountValue !== undefined) updateData.discountValue = Number(discountValue);
        if (minOrderAmount !== undefined) updateData.minOrderAmount = Number(minOrderAmount);
        if (maxDiscount !== undefined) updateData.maxDiscount = Number(maxDiscount);
        if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (description !== undefined) updateData.description = description;

        const coupon = await Coupon.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.json({ success: true, coupon, message: 'Coupon updated successfully' });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

// 4. Delete coupon (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 5. Validate and calculate discount
router.post('/validate', async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }

        const normalizedCode = code.trim().toUpperCase();
        const coupon = await Coupon.findOne({ code: normalizedCode });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: 'This coupon is inactive' });
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ success: false, message: 'This coupon has expired' });
        }

        const orderSubtotal = Number(subtotal) || 0;
        if (coupon.minOrderAmount > 0 && orderSubtotal < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`
            });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = Math.round((orderSubtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        // Cannot discount more than subtotal
        if (discount > orderSubtotal) {
            discount = orderSubtotal;
        }

        res.json({
            success: true,
            valid: true,
            coupon,
            discount,
            message: `Coupon applied: Saved ₹${discount}!`
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
