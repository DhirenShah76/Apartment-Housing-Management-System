const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicketStatus } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTickets)
    .post(protect, createTicket);

router.patch('/:id/status', protect, authorize('Admin'), updateTicketStatus);

module.exports = router;