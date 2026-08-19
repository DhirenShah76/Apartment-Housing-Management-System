const Unit = require('../models/Unit');
const User = require('../models/User');

// @desc    Get units managed by the logged-in admin
// @route   GET /api/units
const getUnits = async (req, res) => {
    try {
        const filter = req.user.role === 'Admin' ? { admin: req.user._id } : {};
        const units = await Unit.find(filter).populate('currentTenant', 'name email phone');
        res.json({ success: true, count: units.length, data: units });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a unit belonging to the logged-in admin
// @route   POST /api/units
const createUnit = async (req, res) => {
    try {
        const { unitNumber, floor, bedrooms, rentAmount } = req.body;

        const existingUnit = await Unit.findOne({ unitNumber, admin: req.user._id });
        if (existingUnit) {
            return res.status(400).json({ success: false, message: `Unit ${unitNumber} already exists in your directory` });
        }

        const unit = await Unit.create({
            unitNumber,
            floor,
            bedrooms,
            rentAmount,
            admin: req.user._id
        });

        res.status(201).json({ success: true, data: unit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Assign tenant to unit
// @route   PATCH /api/units/:id/assign
const assignTenant = async (req, res) => {
    try {
        const { tenantId } = req.body;
        const unit = await Unit.findOne({ _id: req.params.id, admin: req.user._id });

        if (!unit) {
            return res.status(404).json({ success: false, message: 'Unit not found or unauthorized' });
        }

        const tenant = await User.findById(tenantId);
        if (!tenant || tenant.role !== 'Tenant') {
            return res.status(400).json({ success: false, message: 'Invalid tenant selected' });
        }

        unit.currentTenant = tenant._id;
        unit.status = 'Occupied';
        await unit.save();

        res.json({ success: true, message: `Tenant assigned to Unit ${unit.unitNumber}`, data: unit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Vacate / Unassign unit
// @route   PATCH /api/units/:id/unassign
const unassignTenant = async (req, res) => {
    try {
        const unit = await Unit.findOne({ _id: req.params.id, admin: req.user._id });

        if (!unit) {
            return res.status(404).json({ success: false, message: 'Unit not found or unauthorized' });
        }

        unit.currentTenant = null;
        unit.status = 'Vacant';
        await unit.save();

        res.json({ success: true, message: `Unit ${unit.unitNumber} is now vacant`, data: unit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getUnits, createUnit, assignTenant, unassignTenant };