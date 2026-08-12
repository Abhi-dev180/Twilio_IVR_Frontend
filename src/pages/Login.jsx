// import React, { useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Eye, EyeOff, Activity } from 'lucide-react';

// const API_BASE = import.meta.env.VITE_API_URL;

// export default function Login({ setToken }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // Client-side validation
//     if (!email) {
//       setError('Email address is required.');
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }
//     if (!password) {
//       setError('Password is required.');
//       return;
//     }
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
//       const { token, message } = response.data;

//       toast.success(message || 'Login successful!');
//       localStorage.setItem('adminToken', token);
//       setToken(token);
//     } catch (err) {
//       const errMsg = err.response?.data?.error || 'Failed to authenticate.';
//       setError(errMsg);
//       toast.error(errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex font-sans">

//       {/* Left Side - IVR Illustration */}
//       <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
//         <img 
//           src="/ivr-bg.png" 
//           alt="IVR Calling" 
//           className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
//         />
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-950/90 mix-blend-multiply"></div>
//         <div className="relative z-10 p-12 max-w-xl text-white">
//           <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
//             <Activity className="w-8 h-8 text-blue-300" />
//           </div>
//           <h2 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">
//             Automate Your <br/>IVR Testing
//           </h2>
//           <p className="text-blue-100/80 text-lg leading-relaxed font-medium">
//             Validate IVR flows, test multi-line dialing, and ensure seamless customer experiences with our automated testing platform.
//           </p>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12">
//         <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">

//           {/* Logo and title */}
//           <div className="mb-8">
//             <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-widest lg:hidden mb-6">
//               <Activity className="w-4 h-4 text-blue-600" /> IVR QA Platform
//             </p>
//             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
//             <p className="text-slate-500 text-sm mt-2 font-medium">Please enter your details to sign in.</p>
//           </div>

//           {/* Validation Errors */}
//           {error && (
//             <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium text-center">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email field */}
//             <div>
//               <label className="block text-xs text-slate-700 font-semibold mb-1.5">Email</label>
//               <input
//                 type="text"
//                 placeholder="username@gmail.com"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setError('');
//                 }}
//                 className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
//               />
//             </div>

//             {/* Password field */}
//             <div>
//               <label className="block text-xs text-slate-700 font-semibold mb-1.5">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                     setError('');
//                   }}
//                   className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             {/* Forgot Password */}
//             <div className="text-right">
//               <a href="#forgot" className="text-xs text-blue-600 hover:underline font-medium">
//                 Forgot Password?
//               </a>
//             </div>

//             {/* Sign In Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl py-3 text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
//             >
//               {loading ? (
//                 <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
//               ) : (
//                 'Sign in'
//               )}
//             </button>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Activity, Phone, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL;

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-950 overflow-hidden">
      {/* ================= LEFT SIDE ================= */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden items-center justify-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Main content */}
        <motion.div
          className="relative z-10 px-14 max-w-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo / Icon */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="relative inline-flex">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <motion.div
                className="absolute -inset-1 bg-blue-400/40 rounded-2xl blur-md -z-10"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            variants={itemVariants}
            className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] tracking-tight mb-5"
          >
            Automate Your
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              IVR Testing
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-gray-300/90 text-lg leading-relaxed mb-12 max-w-md"
          >
            Validate complex IVR flows, run multi-line dialing tests, and deliver seamless customer experiences — all from one powerful platform.
          </motion.p>

          {/* Feature cards */}
          <motion.div variants={itemVariants} className="space-y-4">
            {[
              { icon: Phone, title: 'Multi-line Dialing', desc: 'Test hundreds of concurrent calls' },
              { icon: ShieldCheck, title: 'Flow Validation', desc: 'Catch broken paths before customers do' },
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Instant insights & detailed reports' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="mt-0.5 w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{feature.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-24 right-16 w-3 h-3 rounded-full bg-blue-400/60"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-32 left-20 w-2 h-2 rounded-full bg-indigo-400/50"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1.2 }}
        />
        <motion.div
          className="absolute top-1/2 right-10 w-1.5 h-1.5 rounded-full bg-sky-300/70"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 0.6 }}
        />
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full lg:w-[52%] bg-slate-50 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50">
            {/* Mobile logo */}
            <div className="lg:hidden mb-7 flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700 tracking-wide">IVR QA Platform</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Enter your credentials to access the platform
              </p>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-700 text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <a
                  href="#forgot"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline underline-offset-2"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015 }}
                whileTap={{ scale: loading ? 1 : 0.985 }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl py-3.5 text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in
                    <Zap className="w-4 h-4 opacity-80" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Secure access • IVR QA Platform
          </p>
        </motion.div>
      </div>
    </div>
  );
}