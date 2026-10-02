const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    inquiryId: { 
        type: String, 
        default: () => 'INQ-' + Math.floor(100000 + Math.random() * 900000) 
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General' },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Contacted', 'Resolved'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
