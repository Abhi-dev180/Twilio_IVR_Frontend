// import React from 'react';

// export default function StatsPanel({
//   totalAttempts,
//   completedAttempts,
//   failedAttempts,
//   inconclusiveAttempts,
//   progressPercent,
//   showProgress = true
// }) {
//   return (
//     <section className={`grid grid-cols-1 sm:grid-cols-2 ${showProgress ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4 mb-8`}>
//       <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
//         <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Runs</p>
//         <p className="text-2xl font-bold text-slate-100 mt-1">{totalAttempts}</p>
//       </div>
//       <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
//         <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Completed / Success</p>
//         <p className="text-2xl font-bold text-emerald-400 mt-1">{completedAttempts}</p>
//       </div>
//       <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
//         <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Failed Tests</p>
//         <p className="text-2xl font-bold text-rose-400 mt-1">{failedAttempts}</p>
//       </div>
//       <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
//         <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Inconclusive / Pending</p>
//         <p className="text-2xl font-bold text-amber-500 mt-1">{inconclusiveAttempts}</p>
//       </div>
//       {showProgress && (
//         <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg sm:col-span-2 lg:col-span-1">
//           <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Queue Progress</p>
//           <div className="flex items-center gap-2 mt-1">
//             <span className="text-2xl font-bold text-blue-400">{progressPercent}%</span>
//             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
//               <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }



// import React from 'react';
// import { Layers, CheckCircle2, AlertTriangle, Clock, Activity } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function StatsPanel({
//   totalAttempts = 0,
//   completedAttempts = 0,
//   failedAttempts = 0,
//   inconclusiveAttempts = 0,
//   progressPercent = 0,
//   showProgress = true,
// }) {
//   const stats = [
//     {
//       title: 'Total Runs',
//       value: totalAttempts,
//       color: 'text-black-800',
//       subColor: 'text-black',
//       bgGradient: 'from-pink-700/20 to-pink-700/10',
//       iconBg: 'bg-pink-300/40',
//       iconColor: 'text-pink-900',
//       icon: Layers,
//     },
//     {
//       title: 'Completed',
//       value: completedAttempts,
//       color: 'text-emerald-900',
//       subColor: 'text-emerald-400',
//       bgGradient: 'from-emerald-600/20 to-emerald-700',
//       iconBg: 'bg-emerald-300/100',
//       iconColor: 'text-emerald-900',
//       icon: CheckCircle2,
//     },
//     {
//       title: 'Failed',
//       value: failedAttempts,
//       color: 'text-rose-300',
//       subColor: 'text-rose-400/70',
//       bgGradient: 'from-rose-600/20 to-rose-700',
//       iconBg: 'bg-rose-300/20',
//       iconColor: 'text-rose-900',
//       icon: AlertTriangle,
//     },
//     {
//       title: 'Inconclusive',
//       value: inconclusiveAttempts,
//       color: 'text-amber-300',
//       subColor: 'text-amber-400/70',
//       bgGradient: 'from-amber-600/20 to-amber-700/10',
//       iconBg: 'bg-amber-300/20',
//       iconColor: 'text-amber-900',
//       icon: Clock,
//     },
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.06,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 14, scale: 0.98 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 260,
//         damping: 22,
//       },
//     },
//     hover: {
//       y: -3,
//       scale: 1.02,
//       transition: { duration: 0.2 },
//     },
//   };

//   const iconVariants = {
//     hidden: { rotate: -8, scale: 0.9, opacity: 0.7 },
//     visible: {
//       rotate: 0,
//       scale: 1,
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 300,
//         damping: 18,
//       },
//     },
//   };

//   return (
//     <motion.section
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className={`grid grid-cols-2 sm:grid-cols-2 ${showProgress ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
//         } gap-3 sm:gap-4 mb-6`}
//     >
//       {stats.map((stat) => {
//         const Icon = stat.icon;
//         return (
//           <motion.div
//             key={stat.title}
//             variants={itemVariants}
//             whileHover="hover"
//             className={`relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md p-4 shadow-xl`}
//           >
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-wider text-black">
//                   {stat.title}
//                 </p>
//                 <motion.p
//                   className={`mt-2 text-2xl font-bold font-mono ${stat.color}`}
//                   initial={{ opacity: 0, y: 6 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.08, duration: 0.35 }}
//                 >
//                   {stat.value.toLocaleString()}
//                 </motion.p>
//               </div>

//               <motion.div
//                 variants={iconVariants}
//                 className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 ${stat.iconBg}`}
//               >
//                 <Icon className={`h-4 w-4 ${stat.iconColor}`} />
//               </motion.div>
//             </div>
//           </motion.div>
//         );
//       })}

//       {showProgress && (
//         <motion.div
//           variants={itemVariants}
//           whileHover="hover"
//           className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-br from-blue-600/20 to-indigo-700/10 backdrop-blur-md p-4 shadow-xl sm:col-span-2 lg:col-span-1"
//         >
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-black">
//                 Queue Progress
//               </p>

//               <div className="mt-3">
//                 <motion.div
//                   className="flex items-baseline justify-between"
//                   initial={{ opacity: 0, y: 6 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1, duration: 0.35 }}
//                 >
//                   <span className="text-2xl font-bold font-mono text-blue-300">
//                     {Math.min(100, Math.max(0, progressPercent))}%
//                   </span>
//                 </motion.div>

//                 <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-slate-900/70 ring-1 ring-slate-700/50">
//                   <motion.div
//                     className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400"
//                     initial={{ width: 0, x: -10, opacity: 0 }}
//                     animate={{
//                       width: `${Math.min(100, Math.max(0, progressPercent))}%`,
//                       x: 0,
//                       opacity: 1,
//                     }}
//                     transition={{ duration: 0.6, ease: 'easeOut' }}
//                     style={{ borderRadius: 9999 }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <motion.div
//               variants={iconVariants}
//               className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/50 bg-blue-400/20"
//             >
//               <Activity className="h-4 w-4 text-blue-300" />
//             </motion.div>
//           </div>
//         </motion.div>
//       )}
//     </motion.section>
//   );
// }


import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsPanel({
  totalAttempts = 0,
  completedAttempts = 0,
  failedAttempts = 0,
  inconclusiveAttempts = 0,
  progressPercent = 0,
  showProgress = true,
}) {
  const stats = [
    {
      title: 'Total Runs',
      value: totalAttempts,
      gradient: 'from-violet-500 via-indigo-500 to-blue-600',
      glow: 'shadow-indigo-500/25',
      icon: Layers,
    },
    {
      title: 'Completed',
      value: completedAttempts,
      gradient: 'from-emerald-400 via-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/25',
      icon: CheckCircle2,
    },
    {
      title: 'Failed',
      value: failedAttempts,
      gradient: 'from-rose-500 via-rose-500 to-red-600',
      glow: 'shadow-rose-500/25',
      icon: AlertTriangle,
    },
    {
      title: 'Inconclusive',
      value: inconclusiveAttempts,
      gradient: 'from-amber-400 via-orange-500 to-orange-600',
      glow: 'shadow-orange-500/25',
      icon: Clock,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 260, damping: 22 },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    hidden: { rotate: -10, scale: 0.85, opacity: 0 },
    visible: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 18 },
    },
  };

  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-2 ${
        showProgress ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
      } gap-2.5 sm:gap-4 mb-6`}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover="hover"
            className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.gradient} p-3 sm:p-4 shadow-lg ${stat.glow} hover:shadow-xl transition-shadow`}
          >
            {/* Decorative glow blob */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />
            {/* Diagonal sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/80 truncate">
                  {stat.title}
                </p>
                <motion.p
                  className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-bold font-mono text-white drop-shadow-sm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.35 }}
                >
                  {stat.value.toLocaleString()}
                </motion.p>
              </div>

              <motion.div
                variants={iconVariants}
                className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-white" />
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {showProgress && (
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-500 p-3 sm:p-4 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-shadow col-span-2 lg:col-span-1"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

          <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/80 truncate">
                Queue Progress
              </p>

              <div className="mt-2 sm:mt-3">
                <motion.div
                  className="flex items-baseline justify-between"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                >
                  <span className="text-xl sm:text-3xl font-bold font-mono text-white drop-shadow-sm">
                    {clampedProgress}%
                  </span>
                </motion.div>

                <div className="mt-2 h-3 sm:h-3.5 w-full overflow-hidden rounded-full bg-white/25 ring-1 ring-white/30">
                  <motion.div
                    className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    initial={{ width: 0, x: -10, opacity: 0 }}
                    animate={{ width: `${clampedProgress}%`, x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ borderRadius: 9999 }}
                  />
                </div>
              </div>
            </div>

            <motion.div
              variants={iconVariants}
              className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30"
            >
              <Activity className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-white" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}