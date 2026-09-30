const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    image: { type: String },
    subcategories: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
