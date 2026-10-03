const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    followers: { type: String, default: '10K followers' },
    image: { type: String, required: true },
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Influencer', influencerSchema);
