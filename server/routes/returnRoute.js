const express = require('express');
const ReturnRequest = require('../models/ReturnRequest');

const router = express.Router();

// 1. Get all return requests (Admin)
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        if (status && status !== 'ALL') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { returnId: { $regex: search, $options: 'i' } },
                { orderId: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } },
                { productName: { $regex: search, $options: 'i' } },
                { upiId: { $regex: search, $options: 'i' } }
            ];
        }

        const returns = await ReturnRequest.find(query).sort({ createdAt: -1 });
        res.json({ success: true, returns });
    } catch (error) {
        console.error('Fetch returns error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching return requests' });
    }
});

// 2. Get user's return requests (Customer Dashboard)
router.get('/my-returns', async (req, res) => {
    try {
        const { email, userId } = req.query;
        if (!email && !userId) {
            return res.status(400).json({ success: false, message: 'Email or userId is required' });
        }

        const query = {
            $or: []
        };
        if (email) query.$or.push({ userEmail: email.toLowerCase().trim() });
        if (userId) query.$or.push({ userId });

        const returns = await ReturnRequest.find(query).sort({ createdAt: -1 });
        res.json({ success: true, returns });
    } catch (error) {
        console.error('Fetch my returns error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching user return requests' });
    }
});

// 3. Create a new return request (Customer)
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            userName,
            userEmail,
            userPhone,
            orderId,
            productName,
            productImage,
            productPrice,
            productSize,
            productColor,
            reason,
            message,
            defectImage,
            refundMethod,
            upiId,
            bankDetails
        } = req.body;

        if (!userName || !userEmail || !orderId || !productName || !reason || !message || !refundMethod) {
            return res.status(400).json({ 
                success: false, 
                message: 'Customer info, order, product, reason, problem message, and refund method are required' 
            });
        }

        if (refundMethod === 'UPI' && !upiId?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid UPI ID for refund' 
            });
        }

        if (refundMethod === 'Bank Account') {
            if (!bankDetails?.accountHolderName || !bankDetails?.accountNumber || !bankDetails?.bankName || !bankDetails?.ifscCode) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Please provide all Bank details (Holder Name, Account No, Bank Name, IFSC)' 
                });
            }
        }

        const randomCode = Math.floor(100000 + Math.random() * 900000);
        const returnId = `RET-${randomCode}`;

        const newReturn = new ReturnRequest({
            returnId,
            userId: userId || null,
            userName: userName.trim(),
            userEmail: userEmail.toLowerCase().trim(),
            userPhone: userPhone || '',
            orderId: orderId.trim(),
            productName: productName.trim(),
            productImage: productImage || '',
            productPrice: Number(productPrice) || 0,
            productSize: productSize || '',
            productColor: productColor || '',
            reason: reason.trim(),
            message: message.trim(),
            defectImage: defectImage || '',
            refundMethod,
            upiId: refundMethod === 'UPI' ? upiId.trim() : '',
            bankDetails: refundMethod === 'Bank Account' ? {
                accountHolderName: bankDetails.accountHolderName.trim(),
                accountNumber: bankDetails.accountNumber.trim(),
                bankName: bankDetails.bankName.trim(),
                ifscCode: bankDetails.ifscCode.trim().toUpperCase()
            } : {},
            status: 'Requested'
        });

        await newReturn.save();
        res.status(201).json({ success: true, message: 'Return request submitted successfully', returnRequest: newReturn });
    } catch (error) {
        console.error('Create return request error:', error);
        res.status(500).json({ success: false, message: 'Server error creating return request' });
    }
});

// 4. Update return request status / Admin Notes
router.put('/:id/status', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const returnRequest = await ReturnRequest.findById(req.params.id);

        if (!returnRequest) {
            return res.status(404).json({ success: false, message: 'Return request not found' });
        }

        if (status) returnRequest.status = status;
        if (adminNotes !== undefined) returnRequest.adminNotes = adminNotes;

        await returnRequest.save();
        res.json({ success: true, message: 'Return request updated successfully', returnRequest });
    } catch (error) {
        console.error('Update return request error:', error);
        res.status(500).json({ success: false, message: 'Server error updating return request' });
    }
});

// 5. Delete return request (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const returnRequest = await ReturnRequest.findByIdAndDelete(req.params.id);
        if (!returnRequest) {
            return res.status(404).json({ success: false, message: 'Return request not found' });
        }
        res.json({ success: true, message: 'Return request deleted successfully' });
    } catch (error) {
        console.error('Delete return request error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting return request' });
    }
});

module.exports = router;
