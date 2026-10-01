const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    shortDescription: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    subcategory: { type: String },
    images: [{ type: String }],
    badge: { type: String }, // e.g., 'New', 'Sale', 'Bestseller'
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    highlights: [{ type: String }],
    specifications: [{
        key: { type: String },
        value: { type: String }
    }],
    faqs: [{
        question: { type: String },
        answer: { type: String }
    }],
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
