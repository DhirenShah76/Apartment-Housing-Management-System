const express = require('express');
const router = express.Router();
const { getPayments, recordPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPayments)
    .post(protect, authorize('Admin'), recordPayment);

module.exports = router;