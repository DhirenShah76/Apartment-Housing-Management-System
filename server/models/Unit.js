const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    unitNumber: {
        type: String,
        required: [true, 'Unit number is required'],
        trim: true
    },
    floor: {
        type: Number,
        required: [true, 'Floor number is required']
    },
    bedrooms: {
        type: Number,
        default: 1
    },
    rentAmount: {
        type: Number,
        required: [true, 'Monthly rent amount is required']
    },
    status: {
        type: String,
        enum: ['Vacant', 'Occupied', 'Under Maintenance'],
        default: 'Vacant'
    },
    currentTenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Unit', unitSchema);