import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Activity } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://ivr-backend-osqt.onrender.com/api/call';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email) {
      setError('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const { token, message } = response.data;

      toast.success(message || 'Login successful!');
      localStorage.setItem('adminToken', token);
      setToken(token);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to authenticate.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* Left Side - IVR Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <img 
          src="/ivr-bg.png" 
          alt="IVR Calling" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-950/90 mix-blend-multiply"></div>
        <div className="relative z-10 p-12 max-w-xl text-white">
          <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
            <Activity className="w-8 h-8 text-blue-300" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">
            Automate Your <br/>IVR Testing
          </h2>
          <p className="text-blue-100/80 text-lg leading-relaxed font-medium">
            Validate IVR flows, test multi-line dialing, and ensure seamless customer experiences with our automated testing platform.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
          
          {/* Logo and title */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-widest lg:hidden mb-6">
              <Activity className="w-4 h-4 text-blue-600" /> IVR QA Platform
            </p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Please enter your details to sign in.</p>
          </div>

          {/* Validation Errors */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-xs text-slate-700 font-semibold mb-1.5">Email</label>
              <input
                type="text"
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs text-slate-700 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#forgot" className="text-xs text-blue-600 hover:underline font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl py-3 text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
