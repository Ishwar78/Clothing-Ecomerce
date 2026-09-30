const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });
        res.json({ success: true, categories });
    } catch (error) {
        console.error('Fetch categories error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create a category
router.post('/', async (req, res) => {
    try {
        const { name, image, subcategories } = req.body;
        const path = '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const category = new Category({
            name,
            path,
            image,
            subcategories: subcategories || []
        });
        
        await category.save();
        res.status(201).json({ success: true, category });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    try {
        const { name, image, subcategories } = req.body;
        const path = '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, path, image, subcategories },
            { new: true }
        );
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        res.json({ success: true, category });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
