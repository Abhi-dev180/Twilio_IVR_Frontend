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
      color: 'text-black-800',
      subColor: 'text-black',
      bgGradient: 'from-pink-700/20 to-pink-700/10',
      iconBg: 'bg-pink-300/40',
      iconColor: 'text-pink-600',
      icon: Layers,
    },
    {
      title: 'Completed',
      value: completedAttempts,
      color: 'text-emerald-900',
      subColor: 'text-emerald-400',
      bgGradient: 'from-emerald-600/20 to-emerald-700',
      iconBg: 'bg-emerald-900/100',
      iconColor: 'text-emerald-300',
      icon: CheckCircle2,
    },
    {
      title: 'Failed',
      value: failedAttempts,
      color: 'text-rose-300',
      subColor: 'text-rose-400/70',
      bgGradient: 'from-rose-600/20 to-rose-700',
      iconBg: 'bg-rose-400/20',
      iconColor: 'text-rose-800',
      icon: AlertTriangle,
    },
    {
      title: 'Inconclusive',
      value: inconclusiveAttempts,
      color: 'text-amber-300',
      subColor: 'text-amber-400/70',
      bgGradient: 'from-amber-600/20 to-amber-700/10',
      iconBg: 'bg-amber-400/20',
      iconColor: 'text-amber-800',
      icon: Clock,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 22,
      },
    },
    hover: {
      y: -3,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    hidden: { rotate: -8, scale: 0.9, opacity: 0.7 },
    visible: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 18,
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-2 sm:grid-cols-2 ${showProgress ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
        } gap-3 sm:gap-4 mb-6`}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover="hover"
            className={`relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md p-4 shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-black">
                  {stat.title}
                </p>
                <motion.p
                  className={`mt-2 text-2xl font-bold font-mono ${stat.color}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.35 }}
                >
                  {stat.value.toLocaleString()}
                </motion.p>
              </div>

              <motion.div
                variants={iconVariants}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 ${stat.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {showProgress && (
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-br from-blue-600/20 to-indigo-700/10 backdrop-blur-md p-4 shadow-xl sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-black">
                Queue Progress
              </p>

              <div className="mt-3">
                <motion.div
                  className="flex items-baseline justify-between"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                >
                  <span className="text-2xl font-bold font-mono text-blue-300">
                    {Math.min(100, Math.max(0, progressPercent))}%
                  </span>
                </motion.div>

                <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-slate-900/70 ring-1 ring-slate-700/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400"
                    initial={{ width: 0, x: -10, opacity: 0 }}
                    animate={{
                      width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                      x: 0,
                      opacity: 1,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ borderRadius: 9999 }}
                  />
                </div>
              </div>
            </div>

            <motion.div
              variants={iconVariants}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/50 bg-blue-400/20"
            >
              <Activity className="h-4 w-4 text-blue-300" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}