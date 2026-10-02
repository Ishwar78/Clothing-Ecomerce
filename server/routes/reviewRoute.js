const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');

const router = express.Router();

// 1. Get reviews (Storefront or Admin)
// Supports filtering by productId or productSlug
router.get('/', async (req, res) => {
    try {
        const { productId, productSlug } = req.query;
        let query = {};
        if (productId) {
            query.productId = productId;
        } else if (productSlug) {
            query.productSlug = productSlug;
        }

        const reviews = await Review.find(query).sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        console.error('Fetch reviews error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Submit a review (Product detail page)
router.post('/', async (req, res) => {
    try {
        const {
            productId,
            productSlug,
            productName,
            productImage,
            userName,
            userEmail,
            rating,
            comment
        } = req.body;

        if (!productId || !userName || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Product, your name, rating, and review text are required.'
            });
        }

        const numRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));

        const review = new Review({
            productId: String(productId),
            productSlug: productSlug || '',
            productName: productName || 'Product',
            productImage: productImage || '',
            userName: userName.trim(),
            userEmail: userEmail ? userEmail.trim() : '',
            rating: numRating,
            comment: comment.trim(),
            isVerified: true,
            status: 'Approved'
        });

        await review.save();

        // Optionally update product average rating
        try {
            const allReviews = await Review.find({ productId: String(productId), status: 'Approved' });
            if (allReviews.length > 0) {
                const avg = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
                await Product.findByIdAndUpdate(productId, {
                    $set: {
                        rating: Number(avg),
                        reviews: allReviews.length
                    }
                });
            }
        } catch (updateErr) {
            console.error('Error updating product rating stats:', updateErr);
        }

        res.status(201).json({
            success: true,
            review,
            message: 'Thank you! Your review has been submitted successfully.'
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3. Update review status or details (Admin)
router.put('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.json({ success: true, review, message: 'Review updated successfully' });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 4. Delete review (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
