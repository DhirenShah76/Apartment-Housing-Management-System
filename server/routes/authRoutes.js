const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getTenants } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/tenants', protect, authorize('Admin'), getTenants);

module.exports = router;