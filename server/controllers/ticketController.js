const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Get tickets (Tenants view their own; Admins view all)
// @route   GET /api/tickets
const getTickets = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Tenant') {
            query.tenant = req.user._id;
        }

        const tickets = await Ticket.find(query)
            .populate('tenant', 'name email phone')
            .populate('unit', 'unitNumber floor')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: tickets.length, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Submit a new maintenance ticket
// @route   POST /api/tickets
const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;

        const user = await User.findById(req.user._id);

        const ticket = await Ticket.create({
            title,
            description,
            category: category || 'General',
            priority: priority || 'Medium',
            tenant: req.user._id,
            unit: user.unitId || null
        });

        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update ticket status (Admin only)
// @route   PATCH /api/tickets/:id/status
const updateTicketStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        if (status) ticket.status = status;
        if (adminNotes !== undefined) ticket.adminNotes = adminNotes;

        await ticket.save();

        res.json({ success: true, message: 'Ticket status updated', data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getTickets, createTicket, updateTicketStatus };