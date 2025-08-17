import React, { useState } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import axios from 'axios';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {}
        }
      );
    }
  };

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return 
    }
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      setLoading(true);
      const confirmationResult = await signInWithPhoneNumber(auth, '+91' + phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setStep(2);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return 
    }

    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      const res = await axios.post('http://localhost:5000/api/auth/verify-firebase-otp', {
        idToken
      });

      // Save token and user info
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Login to NatureMandi</h2>

        {step === 1 && (
          <>
            <label className="block text-sm mb-1 font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              maxLength={10}
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 w-full px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-sm mb-1 font-medium text-gray-700">OTP</label>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-gray-300 w-full px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <p className="text-xs mt-4 text-center text-gray-600">
              Didn't receive OTP?{' '}
              <button onClick={sendOtp} disabled={loading} className="text-green-600 underline">
                Resend
              </button>
            </p>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
