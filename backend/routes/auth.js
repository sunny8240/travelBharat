const express = require('express');
const router = express.Router();
const { 
  adminLogin,
  getCurrentUser,
  createAdminUser
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Admin login
router.post('/admin-login', adminLogin);

// Current user
router.get('/me', protect, getCurrentUser);

module.exports = router;
