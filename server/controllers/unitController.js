const Unit = require('../models/Unit');
const User = require('../models/User');

// @desc    Get all units
// @route   GET /api/units
const getUnits = async (req, res) => {
    try {
        const units = await Unit.find().populate('currentTenant', 'name email phone');
        res.json({ success: true, count: units.length, data: units });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new unit
// @route   POST /api/units
const createUnit = async (req, res) => {
    try {
        const { unitNumber, floor, bedrooms, rentAmount } = req.body;

        const existingUnit = await Unit.findOne({ unitNumber });
        if (existingUnit) {
            return res.status(400).json({ success: false, message: `Unit ${unitNumber} already exists` });
        }

        const unit = await Unit.create({
            unitNumber,
            floor,
            bedrooms: bedrooms || 1,
            rentAmount,
            status: 'Vacant'
        });

        res.status(201).json({ success: true, data: unit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Assign a tenant to an apartment unit
// @route   PATCH /api/units/:id/assign
const assignTenant = async (req, res) => {
    try {
        const { tenantId } = req.body;
        const unitId = req.params.id;

        const unit = await Unit.findById(unitId);
        if (!unit) {
            return res.status(404).json({ success: false, message: 'Unit not found' });
        }

        const tenant = await User.findById(tenantId);
        if (!tenant || tenant.role !== 'Tenant') {
            return res.status(400).json({ success: false, message: 'Invalid tenant user ID' });
        }

        // Update unit and tenant documents
        unit.currentTenant = tenant._id;
        unit.status = 'Occupied';
        await unit.save();

        tenant.unitId = unit._id;
        await tenant.save();

        res.json({
            success: true,
            message: `Tenant ${tenant.name} assigned to Unit ${unit.unitNumber}`,
            data: unit
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Unassign / Vacate a unit
// @route   PATCH /api/units/:id/unassign
const unassignTenant = async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.id);
        if (!unit) {
            return res.status(404).json({ success: false, message: 'Unit not found' });
        }

        if (unit.currentTenant) {
            await User.findByIdAndUpdate(unit.currentTenant, { unitId: null });
        }

        unit.currentTenant = null;
        unit.status = 'Vacant';
        await unit.save();

        res.json({ success: true, message: `Unit ${unit.unitNumber} marked as Vacant`, data: unit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getUnits, createUnit, assignTenant, unassignTenant };