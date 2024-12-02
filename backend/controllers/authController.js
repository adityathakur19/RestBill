const User = require('../models/User');
const OTPService = require('../services/otpService');
const jwt = require('jsonwebtoken');

// User Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    if (!username || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Removed password hashing
    const user = new User({ username, email, phoneNumber, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email, phone number, or username and password are required' });
    }

    // More flexible user finding logic
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() }, 
        { phoneNumber: identifier.trim() },
        { username: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Removed password comparison
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const otpResponse = await OTPService.sendOTPViaSMS(phoneNumber);
    if (otpResponse.success) {
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    const isVerified = await OTPService.verifyOTP(phoneNumber, otp);
    if (isVerified) {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// Reset Password with OTP
exports.resetPasswordWithOTP = async (req, res) => {
  try {
    const { phoneNumber, otp, newPassword } = req.body;

    if (!phoneNumber || !otp || !newPassword) {
      return res.status(400).json({ message: 'Phone number, OTP, and new password are required' });
    }

    const isVerified = await OTPService.verifyOTP(phoneNumber, otp);
    if (!isVerified) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Removed password hashing
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password Reset Error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};