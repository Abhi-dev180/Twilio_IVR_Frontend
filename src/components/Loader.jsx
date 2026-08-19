// import React from 'react';
// import { Activity } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function Loader({ 
//   title = "Twilio IVR QA Platform", 
//   message = "Initializing live connection & audio channels..." 
// }) {
//   return (
//     <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden w-full">
//       {/* Glow ambient backgrounds */}
//       <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="flex flex-col items-center gap-5 z-10"
//       >
//         <div className="relative w-20 h-20">
//           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
//             <rect
//               x="2" y="2" width="76" height="76" rx="16"
//               fill="none" stroke="currentColor" strokeWidth="4"
//               className="text-blue-500/20"
//             />
//             <motion.rect
//               x="2" y="2" width="76" height="76" rx="16"
//               fill="none" stroke="currentColor" strokeWidth="4"
//               className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
//               strokeLinecap="round"
//               initial={{ pathLength: 0, pathOffset: 0 }}
//               animate={{ pathLength: [0.1, 0.4, 0.1], pathOffset: [0, 0.6, 1] }}
//               transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
//             />
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
//           </div>
//         </div>
//         <div className="text-center">
//           <h3 className="text-lg font-bold text-slate-100 tracking-tight">
//             {title}
//           </h3>
//           <p className="text-xs text-slate-400 mt-1 font-medium">
//             {message}
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }



import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Loader({
  title = 'Twilio IVR QA Platform',
  message = 'Initializing live connection & audio channels...',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-[#265392] flex flex-col items-center justify-center relative overflow-hidden w-full px-6"
    >
      {/* Faint dot grid for texture */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(4, 25, 55, 0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Glow ambient backgrounds */}
      <div className="absolute -top-24 -left-24 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4 sm:gap-5 z-10 max-w-xs sm:max-w-sm text-center"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
          <svg className="absolute inset-0 w-full h-full motion-reduce:hidden" viewBox="0 0 80 80">
            <rect
              x="2"
              y="2"
              width="76"
              height="76"
              rx="16"
              fill="none"
              stroke="#3b82f6"
              strokeOpacity="0.2"
              strokeWidth="4"
            />
            <motion.rect
              x="2"
              y="2"
              width="76"
              height="76"
              rx="16"
              fill="none"
              stroke="#ffffffff"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ pathLength: [0.1, 0.4, 0.1], pathOffset: [0, 0.6, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>

          {/* Static fallback ring for reduced-motion users */}
          <svg className="absolute inset-0 w-full h-full hidden motion-reduce:block" viewBox="0 0 80 80">
            <rect
              x="2"
              y="2"
              width="76"
              height="76"
              rx="16"
              fill="none"
              stroke="#3b82f6"
              strokeOpacity="0.5"
              strokeWidth="4"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400 motion-safe:animate-pulse" />
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-red tracking-tight text-balance">
            {title}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#94a3b8] mt-1.5 font-medium leading-relaxed text-balance">
            {message}
          </p>
        </div>

        {/* Loading progress dots */}
        <div className="flex items-center gap-1.5 mt-1">
          {[0, 1, 2,3].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}