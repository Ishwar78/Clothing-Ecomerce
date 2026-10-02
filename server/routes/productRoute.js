const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const router = express.Router();

const slugify = (text) => text ? text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        // Backfill slugs and round any existing decimal prices in background
        products.forEach(p => {
            let changed = false;
            if (!p.slug && p.name) {
                p.slug = slugify(p.name);
                changed = true;
            }
            if (p.price !== undefined && p.price !== null && p.price !== Math.round(Number(p.price) || 0)) {
                p.price = Math.round(Number(p.price) || 0);
                changed = true;
            }
            if (p.originalPrice !== undefined && p.originalPrice !== null && p.originalPrice !== Math.round(Number(p.originalPrice) || 0)) {
                p.originalPrice = Math.round(Number(p.originalPrice) || 0);
                changed = true;
            }
            if (changed) {
                p.save().catch(err => console.error('Backfill product price/slug error:', err));
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
        const data = { ...req.body, slug };
        if (data.price !== undefined) data.price = Math.round(Number(data.price) || 0);
        if (data.originalPrice !== undefined) data.originalPrice = Math.round(Number(data.originalPrice) || 0);
        const product = new Product(data);
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
        if (updateData.price !== undefined) {
            updateData.price = Math.round(Number(updateData.price) || 0);
        }
        if (updateData.originalPrice !== undefined) {
            updateData.originalPrice = Math.round(Number(updateData.originalPrice) || 0);
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
