import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Loader({ 
  title = "Twilio IVR QA Platform", 
  message = "Initializing live connection & audio channels..." 
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden w-full">
      {/* Glow ambient backgrounds */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5 z-10"
      >
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/30 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
