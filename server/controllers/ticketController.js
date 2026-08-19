const Ticket = require('../models/Ticket');
const Unit = require('../models/Unit');

// @desc    Get tickets (filtered by Admin's units or Tenant's own tickets)
// @route   GET /api/tickets
const getTickets = async (req, res) => {
    try {
        let tickets;
        if (req.user.role === 'Admin') {
            const adminUnits = await Unit.find({ admin: req.user._id }).select('_id');
            const unitIds = adminUnits.map(u => u._id);
            tickets = await Ticket.find({ unit: { $in: unitIds } })
                .populate('tenant', 'name email')
                .populate('unit', 'unitNumber floor')
                .sort({ createdAt: -1 });
        } else {
            tickets = await Ticket.find({ tenant: req.user._id })
                .populate('unit', 'unitNumber floor')
                .sort({ createdAt: -1 });
        }

        res.json({ success: true, count: tickets.length, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create ticket (Tenant)
// @route   POST /api/tickets
const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority, unitId } = req.body;

        let targetUnitId = unitId;
        if (!targetUnitId) {
            const tenantUnit = await Unit.findOne({ currentTenant: req.user._id });
            targetUnitId = tenantUnit?._id;
        }

        const ticket = await Ticket.create({
            tenant: req.user._id,
            unit: targetUnitId,
            title,
            description,
            category,
            priority
        });

        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update ticket status (Admin)
// @route   PATCH /api/tickets/:id/status
const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        ticket.status = status;
        await ticket.save();

        res.json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getTickets, createTicket, updateTicketStatus };