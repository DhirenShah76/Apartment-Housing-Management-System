const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
    {
        unitNumber: { type: String, required: true, unique: true, trim: true },
        floor: { type: Number, required: true },
        bedrooms: { type: Number, required: true, default: 1 },
        rentAmount: { type: Number, required: true },
        status: { type: String, enum: ['Vacant', 'Occupied', 'Maintenance'], default: 'Vacant' },
        currentTenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Unit', unitSchema);