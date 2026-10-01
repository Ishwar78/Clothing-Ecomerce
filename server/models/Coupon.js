const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'flat'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
