const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: { type: String },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    position: { 
        type: String, 
        default: 'hero',
        enum: ['hero', 'pre-trending-1', 'pre-trending-2', 'post-influencer-1', 'post-influencer-2', 'sale']
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
