const twilio = require('twilio');
const crypto = require('crypto');

class OTPService {
  constructor() {
    this.otpAttempts = new Map(); // Tracks OTP attempts for rate-limiting
    this.otpCache = new Map();    // Temporary OTP storage (consider Redis for production)

    // Initialize Twilio client only if credentials are present
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    } else {
      console.warn('Twilio credentials are missing. OTPService is not fully functional.');
    }
  }

  // Generate a 6-digit OTP
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Check OTP attempts for rate-limiting (max 3 attempts per hour)
  async checkOTPAttempts(phoneNumber) {
    const now = Date.now();
    const attempts = this.otpAttempts.get(phoneNumber) || [];

    // Remove attempts older than 1 hour
    const recentAttempts = attempts.filter((time) => now - time < 3600000);

    if (recentAttempts.length >= 3) {
      return { allowed: false, message: 'Too many OTP requests. Please try again later.' };
    }

    recentAttempts.push(now);
    this.otpAttempts.set(phoneNumber, recentAttempts);
    return { allowed: true };
  }

  // Send OTP via SMS using Twilio
  async sendOTPViaSMS(phoneNumber) {
    try {
      if (!this.twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
        throw new Error('Twilio is not configured properly.');
      }

      // Check OTP attempts
      const attemptCheck = await this.checkOTPAttempts(phoneNumber);
      if (!attemptCheck.allowed) {
        return { success: false, message: attemptCheck.message };
      }

      // Generate and store OTP
      const otp = this.generateOTP();
      this.otpCache.set(phoneNumber, { otp, createdAt: Date.now() });

      // Send SMS
      await this.twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return {
        success: true,
        message: 'OTP sent successfully.',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Only return OTP in development
      };
    } catch (error) {
      console.error('OTP Send Error:', error.message);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber, userOTP) {
    try {
      const storedOTP = this.otpCache.get(phoneNumber);

      if (!storedOTP) {
        return { success: false, message: 'Invalid or expired OTP.' };
      }

      const now = Date.now();

      // Check OTP expiration (15 minutes)
      if (now - storedOTP.createdAt > 15 * 60 * 1000) {
        this.otpCache.delete(phoneNumber);
        return { success: false, message: 'OTP has expired. Please request a new one.' };
      }

      if (storedOTP.otp === userOTP) {
        this.otpCache.delete(phoneNumber); // Clear OTP after successful verification
        return { success: true, message: 'OTP verified successfully.' };
      }

      return { success: false, message: 'Incorrect OTP. Please try again.' };
    } catch (error) {
      console.error('OTP Verification Error:', error.message);
      return { success: false, message: 'An error occurred during verification.' };
    }
  }
}

module.exports = new OTPService();
