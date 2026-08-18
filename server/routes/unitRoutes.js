const express = require('express');
const router = express.Router();
const { getUnits, createUnit, assignTenant, unassignTenant } = require('../controllers/unitController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getUnits)
    .post(protect, authorize('Admin'), createUnit);

router.patch('/:id/assign', protect, authorize('Admin'), assignTenant);
router.patch('/:id/unassign', protect, authorize('Admin'), unassignTenant);

module.exports = router;