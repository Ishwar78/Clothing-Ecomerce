const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productSlug: { type: String, default: '' },
    productName: { type: String, required: true },
    productImage: { type: String, default: '' },
    userName: { type: String, required: true },
    userEmail: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    status: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
