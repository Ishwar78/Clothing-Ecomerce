const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String },
    subject: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Order Issue', 'Payment & Refund', 'Delivery Tracking', 'Product Query', 'Size & Exchange', 'General Inquiry'], 
        default: 'General Inquiry' 
    },
    orderId: { type: String },
    message: { type: String, required: true },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Urgent'], 
        default: 'Medium' 
    },
    status: { 
        type: String, 
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'], 
        default: 'Open' 
    },
    adminReply: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
