const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  sendOTP, 
  verifyOTP, 
  resetPasswordWithOTP 
} = require('../controllers/authController');

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPasswordWithOTP);

module.exports = router;
