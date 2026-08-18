const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Plumbing', 'Electrical', 'Appliance', 'General'], default: 'General' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null },
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);