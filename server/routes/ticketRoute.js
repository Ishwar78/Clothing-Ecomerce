const express = require('express');
const Ticket = require('../models/Ticket');

const router = express.Router();

// 1. Get all tickets (Admin)
router.get('/', async (req, res) => {
    try {
        const { status, category, search } = req.query;
        let query = {};

        if (status && status !== 'ALL') {
            query.status = status;
        }

        if (category && category !== 'ALL') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { ticketId: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { orderId: { $regex: search, $options: 'i' } }
            ];
        }

        const tickets = await Ticket.find(query).sort({ createdAt: -1 });
        res.json({ success: true, tickets });
    } catch (error) {
        console.error('Fetch tickets error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching tickets' });
    }
});

// 2. Get user's own tickets (Customer Dashboard)
router.get('/my-tickets', async (req, res) => {
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

        const tickets = await Ticket.find(query).sort({ createdAt: -1 });
        res.json({ success: true, tickets });
    } catch (error) {
        console.error('Fetch my tickets error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching user tickets' });
    }
});

// 3. Create a new support ticket
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            userName,
            userEmail,
            userPhone,
            subject,
            category,
            orderId,
            message,
            priority
        } = req.body;

        if (!userName || !userEmail || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, subject, and message are required' 
            });
        }

        const randomCode = Math.floor(100000 + Math.random() * 900000);
        const ticketId = `TKT-${randomCode}`;

        const ticket = new Ticket({
            ticketId,
            userId: userId || null,
            userName: userName.trim(),
            userEmail: userEmail.toLowerCase().trim(),
            userPhone: userPhone || '',
            subject: subject.trim(),
            category: category || 'General Inquiry',
            orderId: orderId ? orderId.trim() : '',
            message: message.trim(),
            priority: priority || 'Medium',
            status: 'Open'
        });

        await ticket.save();
        res.status(201).json({ success: true, message: 'Ticket created successfully', ticket });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ success: false, message: 'Server error creating ticket' });
    }
});

// 4. Update ticket status / Admin Reply
router.put('/:id/status', async (req, res) => {
    try {
        const { status, adminReply } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        if (status) ticket.status = status;
        if (adminReply !== undefined) ticket.adminReply = adminReply;

        await ticket.save();
        res.json({ success: true, message: 'Ticket updated successfully', ticket });
    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({ success: false, message: 'Server error updating ticket' });
    }
});

// 5. Delete ticket (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
        res.json({ success: true, message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Delete ticket error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting ticket' });
    }
});

module.exports = router;
