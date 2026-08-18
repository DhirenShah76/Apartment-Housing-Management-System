const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Get payments (Tenants view own dues; Admins view all)
// @route   GET /api/payments
const getPayments = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Tenant') {
            query.tenant = req.user._id;
        }

        const payments = await Payment.find(query)
            .populate('tenant', 'name email')
            .populate('unit', 'unitNumber rentAmount')
            .sort({ dueDate: -1 });

        res.json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Record or create a rent bill/payment
// @route   POST /api/payments
const recordPayment = async (req, res) => {
    try {
        const { tenantId, unitId, amount, dueDate, status, method } = req.body;

        const payment = await Payment.create({
            tenant: tenantId,
            unit: unitId,
            amount,
            dueDate,
            paymentDate: status === 'Paid' ? new Date() : null,
            status: status || 'Pending',
            method: method || 'Pending'
        });

        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getPayments, recordPayment };