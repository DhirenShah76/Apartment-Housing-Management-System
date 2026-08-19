const express = require('express');
const router = express.Router();
const { getPayments, recordPayment, updatePaymentStatus } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPayments)
    .post(protect, authorize('Admin'), recordPayment);

router.route('/:id/status')
    .patch(protect, authorize('Admin'), updatePaymentStatus);

module.exports = router;