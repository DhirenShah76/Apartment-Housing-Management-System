const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date, required: true },
        paymentDate: { type: Date, default: null },
        status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
        method: { type: String, enum: ['Cash', 'Card', 'Bank Transfer', 'Pending'], default: 'Pending' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);