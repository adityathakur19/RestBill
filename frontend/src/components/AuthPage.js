import React, { useState } from 'react';
import { Mail, Phone, Lock, KeyRound, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', {
      response: error.response?.data,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

const AuthFlow = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [loginData, setLoginData] = useState({
    identifier: '', // can be email or phone number
    password: ''
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    phoneNumber: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    tempToken: '' // to store temporary reset token
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation helpers
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // Matches backend validation: at least 6 characters long
    return password.length >= 6;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    // Validation checks (same as before)
    if (!signupData.username) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }
    if (!validateEmail(signupData.email)) {
      setError('Invalid email format');
      setIsLoading(false);
      return;
    }
    if (!signupData.phoneNumber) {
      setError('Phone number is required');
      setIsLoading(false);
      return;
    }
    if (!validatePassword(signupData.password)) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/signup', {
        username: signupData.username,
        email: signupData.email,
        phoneNumber: signupData.phoneNumber,
        password: signupData.password,
      });
  
      // Store token and set authentication
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAuthenticated', 'true');
  
      setMessage('Signup successful! Redirecting...');
  
      // Wait for 2 seconds and then navigate to the dashboard
      setTimeout(() => {
        window.location.href = '/'; // Full page reload to update authentication state
      }, 2000); 
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
  
    // Ensure identifier is not empty
    if (!loginData.identifier.trim()) {
      setError('Email/Phone/Username is required');
      setIsLoading(false);
      return;
    }

    // Ensure password is not empty
    if (!loginData.password.trim()) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await api.post('/login', {
        identifier: loginData.identifier.trim(),
        password: loginData.password.trim(),
      });
  
      // Store token and set authentication
      localStorage.setItem('token', response.data.token || 'default-token');
      localStorage.setItem('isAuthenticated', 'true');
      
      setMessage('Login successful! Redirecting...');
      
      // Wait for 2 seconds and then navigate to the dashboard
      setTimeout(() => {
        window.location.href = '/'; // Full page reload to update authentication state
      }, 2000);
    } catch (err) {
      console.error('Login Error:', {
        response: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
      
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!resetPasswordData.phoneNumber) {
      setError('Phone number is required');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/send-otp', {
        phoneNumber: resetPasswordData.phoneNumber
      });

      setMessage('OTP sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!resetPasswordData.otp) {
      setError('OTP is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/verify-otp', {
        phoneNumber: resetPasswordData.phoneNumber,
        otp: resetPasswordData.otp
      });

      setResetPasswordData(prev => ({
        ...prev,
        tempToken: response.data.tempToken
      }));
      
      setMessage('OTP verified successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    // Validate reset password fields
    if (!validatePassword(resetPasswordData.newPassword)) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/reset-password', {
        tempToken: resetPasswordData.tempToken,
        newPassword: resetPasswordData.newPassword
      });

      setMessage('Password reset successful!');
      setActiveTab('login');
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* Tab Navigation */}
        <div className="flex mb-6">
          {['login', 'signup', 'resetPassword'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                // Reset error and message when switching tabs
                setError('');
                setMessage('');
              }}
              className={`flex-1 p-2 ${
                activeTab === tab 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              } rounded-md mr-2 last:mr-0 transition duration-300`}
            >
              {tab === 'resetPassword' ? 'Reset Password' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            {message}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Email or Phone Number or Username"
                  value={loginData.identifier}
                  onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-2 rounded-md transition duration-300 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Username"
                  value={signupData.username}
                  onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={signupData.phoneNumber}
                  onChange={(e) => setSignupData({...signupData, phoneNumber: e.target.value})}
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-2 rounded-md transition duration-300 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Signing up...' : 'Signup'}
              </button>
            </div>
          </form>
        )}

        {/* Reset Password Form */}
        {activeTab === 'resetPassword' && (
          <form onSubmit={handlePasswordReset}>
            <div className="space-y-4">
              {/* Phone Number */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={resetPasswordData.phoneNumber}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className={`w-full p-2 rounded-md transition duration-300 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              {/* OTP */}
              <div className="relative mt-4">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={resetPasswordData.otp}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      otp: e.target.value,
                    })
                  }
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className={`w-full p-2 rounded-md transition duration-300 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>

              {/* New Password */}
              <div className="relative mt-4">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative mt-4">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-2 rounded-md transition duration-300 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthFlow;