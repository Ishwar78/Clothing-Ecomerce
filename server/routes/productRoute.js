const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const router = express.Router();

const slugify = (text) => text ? text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        // Backfill slugs in background if missing
        products.forEach(p => {
            if (!p.slug && p.name) {
                p.slug = slugify(p.name);
                p.save().catch(err => console.error('Backfill slug error:', err));
            }
        });
        res.json({ success: true, products });
    } catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get a single product by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
    try {
        const param = req.params.idOrSlug;
        const isObjectId = mongoose.Types.ObjectId.isValid(param);
        let product = null;

        if (isObjectId) {
            product = await Product.findById(param);
        }
        if (!product) {
            product = await Product.findOne({
                $or: [
                    { slug: param },
                    { name: new RegExp('^' + param.replace(/-/g, ' ') + '$', 'i') }
                ]
            });
        }

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Fetch product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create a product
router.post('/', async (req, res) => {
    try {
        const slug = req.body.slug || slugify(req.body.name);
        const product = new Product({
            ...req.body,
            slug
        });
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.body.name && !req.body.slug) {
            updateData.slug = slugify(req.body.name);
        }
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
