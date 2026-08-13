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
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
            <rect
              x="2" y="2" width="76" height="76" rx="16"
              fill="none" stroke="currentColor" strokeWidth="4"
              className="text-blue-500/20"
            />
            <motion.rect
              x="2" y="2" width="76" height="76" rx="16"
              fill="none" stroke="currentColor" strokeWidth="4"
              className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ pathLength: [0.1, 0.4, 0.1], pathOffset: [0, 0.6, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
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
