import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Cloud, Lock, Mail, Loader } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { login, verifyOtp, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showOtpInput) {
      const res = await login(email, password);
      if (res && res.otpSent) {
        setShowOtpInput(true);
      }
    } else {
      const success = await verifyOtp(email, otp);
      if (success) {
        navigate('/drive');
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-primary/25">
            <Cloud className="w-5 h-5" />
          </div>
          <span className="font-plus-jakarta font-extrabold text-3xl text-heading-text tracking-tight">RAHRUC</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-plus-jakarta font-bold text-heading-text">
          {showOtpInput ? 'Enter Verification Code' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-text">
          {showOtpInput ? (
            <span>We sent a 6-digit OTP code to <strong className="text-heading-text">{email}</strong></span>
          ) : (
            <>
              Or{' '}
              <Link to="/register" onClick={clearError} className="font-medium text-orange-primary hover:text-orange-primary/80 transition-colors">
                create a new account
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-border-subtle sm:rounded-2xl sm:px-10 shadow-sm">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {showOtpInput ? (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-body-text mb-1">
                  6-Digit OTP Code
                </label>
                <div className="mt-1 relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-border-subtle rounded-lg shadow-sm placeholder-secondary-text focus:outline-none focus:ring-orange-primary focus:border-orange-primary sm:text-sm bg-white text-center font-mono text-xl tracking-widest"
                    placeholder="000000"
                  />
                </div>
                <div className="mt-2 text-xs text-center text-secondary-text">
                  Please check your inbox or spam folder for the email code.
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-body-text">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-border-subtle rounded-lg shadow-sm placeholder-secondary-text focus:outline-none focus:ring-orange-primary focus:border-orange-primary sm:text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-body-text">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-border-subtle rounded-lg shadow-sm placeholder-secondary-text focus:outline-none focus:ring-orange-primary focus:border-orange-primary sm:text-sm bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-primary hover:bg-orange-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-primary transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : showOtpInput ? 'Verify Code & Login' : 'Send Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
