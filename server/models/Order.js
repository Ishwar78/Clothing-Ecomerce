const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: 'M'
    },
    color: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        userId: { type: String, default: '' },
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' }
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, default: '' },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    razorpayOrderId: {
        type: String,
        default: ''
    },
    razorpayPaymentId: {
        type: String,
        default: ''
    },
    razorpaySignature: {
        type: String,
        default: ''
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
