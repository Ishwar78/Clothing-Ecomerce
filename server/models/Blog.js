const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    category: {
        type: String,
        default: 'Fashion',
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: 'Joyfulmarts Editorial'
    },
    readTime: {
        type: String,
        default: '5 min read'
    },
    seoTitle: {
        type: String,
        default: ''
    },
    seoDescription: {
        type: String,
        default: ''
    },
    seoKeywords: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
