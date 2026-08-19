const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Tenant reference is required']
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: [true, 'Unit reference is required']
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Admin reference is required']
    },
    amount: {
        type: Number,
        required: [true, 'Payment amount is required']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    paymentDate: {
        type: Date,
        default: null
    },
    method: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'Online Card', 'Cheque', 'Unpaid'],
        default: 'Cash'
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue'],
        default: 'Pending'
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);