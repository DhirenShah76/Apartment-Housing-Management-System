const Payment = require('../models/Payment');
const Unit = require('../models/Unit');

// @desc    Get payment records
// @route   GET /api/payments
const getPayments = async (req, res) => {
    try {
        let payments;
        if (req.user.role === 'Admin') {
            payments = await Payment.find({ admin: req.user._id })
                .populate('tenant', 'name email phone')
                .populate('unit', 'unitNumber floor')
                .sort({ dueDate: -1 });
        } else {
            payments = await Payment.find({ tenant: req.user._id })
                .populate('unit', 'unitNumber floor')
                .sort({ dueDate: -1 });
        }

        res.json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Record rent invoice or cash collection (Admin only)
// @route   POST /api/payments
const recordPayment = async (req, res) => {
    try {
        const { unitId, amount, dueDate, method, status, notes } = req.body;

        const unit = await Unit.findOne({ _id: unitId, admin: req.user._id });
        if (!unit || !unit.currentTenant) {
            return res.status(400).json({ success: false, message: 'Select an occupied unit managed by you.' });
        }

        const payment = await Payment.create({
            admin: req.user._id,
            tenant: unit.currentTenant,
            unit: unit._id,
            amount: Number(amount),
            dueDate,
            paymentDate: status === 'Paid' ? new Date() : null,
            method: method || 'Cash',
            status: status || 'Pending',
            notes: notes || ''
        });

        const populatedPayment = await Payment.findById(payment._id)
            .populate('tenant', 'name email')
            .populate('unit', 'unitNumber floor');

        res.status(201).json({ success: true, data: populatedPayment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update rent payment status (e.g. Mark Paid / Cash Received)
// @route   PATCH /api/payments/:id/status
const updatePaymentStatus = async (req, res) => {
    try {
        const { status, method } = req.body;
        const payment = await Payment.findOne({ _id: req.params.id, admin: req.user._id });

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment record not found or unauthorized' });
        }

        payment.status = status;
        if (method) payment.method = method;
        if (status === 'Paid' && !payment.paymentDate) {
            payment.paymentDate = new Date();
        } else if (status !== 'Paid') {
            payment.paymentDate = null;
        }

        await payment.save();
        res.json({ success: true, message: 'Payment status updated', data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getPayments, recordPayment, updatePaymentStatus };