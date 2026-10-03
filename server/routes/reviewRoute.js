const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

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

// Check if user is eligible to review (Must have purchased the product)
router.get('/can-review', async (req, res) => {
    try {
        const { productId, productName, email, userId } = req.query;
        if (!email && !userId) {
            return res.json({
                success: true,
                canReview: false,
                reason: 'login_required',
                message: 'Please login to write a review.'
            });
        }

        if (!productId && !productName) {
            return res.status(400).json({ success: false, message: 'Product is required.' });
        }

        const orConditions = [];
        if (email) {
            const cleanEmail = email.trim();
            orConditions.push({ 'user.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
            orConditions.push({ 'shippingAddress.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
        }
        if (userId) {
            orConditions.push({ 'user.userId': userId });
        }

        const orders = await Order.find({
            $or: orConditions,
            orderStatus: { $ne: 'Cancelled' }
        });

        const hasPurchased = orders.some(order => 
            order.items && order.items.some(item => {
                const matchId = productId && item.productId && String(item.productId) === String(productId);
                const matchName = productName && item.name && item.name.trim().toLowerCase() === productName.trim().toLowerCase();
                return matchId || matchName;
            })
        );

        if (hasPurchased) {
            return res.json({
                success: true,
                canReview: true,
                message: 'Verified buyer. You can review this product.'
            });
        } else {
            return res.json({
                success: true,
                canReview: false,
                reason: 'not_purchased',
                message: 'Only verified buyers who purchased this product can leave a review.'
            });
        }
    } catch (error) {
        console.error('Check review eligibility error:', error);
        res.status(500).json({ success: false, message: 'Server error checking eligibility' });
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
            userId,
            rating,
            comment,
            isAdminCreated
        } = req.body;

        if (!productId || !userName || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Product, your name, rating, and review text are required.'
            });
        }

        // Verify buyer if not created manually by admin
        if (!isAdminCreated) {
            if (!userEmail && !userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Please login to submit a review.'
                });
            }

            const orConditions = [];
            if (userEmail) {
                const cleanEmail = userEmail.trim();
                orConditions.push({ 'user.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
                orConditions.push({ 'shippingAddress.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
            }
            if (userId) {
                orConditions.push({ 'user.userId': userId });
            }

            const orders = await Order.find({
                $or: orConditions,
                orderStatus: { $ne: 'Cancelled' }
            });

            const hasPurchased = orders.some(order => 
                order.items && order.items.some(item => {
                    const matchId = productId && item.productId && String(item.productId) === String(productId);
                    const matchName = productName && item.name && item.name.trim().toLowerCase() === productName.trim().toLowerCase();
                    return matchId || matchName;
                })
            );

            if (!hasPurchased) {
                return res.status(403).json({
                    success: false,
                    message: 'Only verified buyers who have purchased this product can submit a review.'
                });
            }
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
