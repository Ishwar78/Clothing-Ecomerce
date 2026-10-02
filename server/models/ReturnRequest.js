const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
    returnId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String },
    orderId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    productPrice: { type: Number },
    productSize: { type: String },
    productColor: { type: String },
    reason: { 
        type: String, 
        required: true,
        enum: [
            'Defective / Damaged Item', 
            'Wrong Item Delivered', 
            'Size / Fit Not Correct', 
            'Fabric Quality Issue', 
            'Missing Accessories / Parts', 
            'Item Not Matching Picture', 
            'Other'
        ] 
    },
    message: { type: String, required: true },
    defectImage: { type: String },
    refundMethod: { 
        type: String, 
        required: true, 
        enum: ['UPI', 'Bank Account'] 
    },
    upiId: { type: String },
    bankDetails: {
        accountHolderName: { type: String },
        accountNumber: { type: String },
        bankName: { type: String },
        ifscCode: { type: String }
    },
    status: { 
        type: String, 
        enum: ['Requested', 'Approved', 'Rejected', 'Refund Completed'], 
        default: 'Requested' 
    },
    adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
