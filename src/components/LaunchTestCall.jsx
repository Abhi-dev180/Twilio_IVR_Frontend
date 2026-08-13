// import React from 'react';
// import { Play, Phone } from 'lucide-react';

// export default function LaunchTestCall({
//   handleTriggerCall,
//   handleStopCall,
//   selectedLineId,
//   setSelectedLineId,
//   lines,
//   targetNumber,
//   setTargetNumber,
//   testValue,
//   setTestValue,
//   loading
// }) {
//   return (
//     <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
//       <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
//         <Play className="w-5 h-5" /> Launch Single Test Call
//       </h2>
//       <form onSubmit={handleTriggerCall} className="space-y-4">
//         <div>
//           <label className="block text-xs font-medium text-slate-400 mb-1">Select Outgoing Line</label>
//           <select
//             value={selectedLineId}
//             onChange={(e) => setSelectedLineId(e.target.value)}
//             className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-slate-300"
//           >
//             {lines.length === 0 ? (
//               <option value="">No lines registered</option>
//             ) : (
//               lines.map(line => (
//                 <option key={line.id} value={line.id}>
//                   {line.phone_number} ({line.status})
//                 </option>
//               ))
//             )}
//           </select>
//         </div>

//         <div>
//           <label className="block text-xs font-medium text-slate-400 mb-1">Target IVR Number</label>
//           <input
//             type="text"
//             value={targetNumber}
//             onChange={(e) => setTargetNumber(e.target.value)}
//             className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
//           />
//         </div>

//         <div>
//           <label className="block text-xs font-medium text-slate-400 mb-1">Simulated DTMF Value (16 Digits)</label>
//           <input
//             type="text"
//             maxLength={16}
//             value={testValue}
//             onChange={(e) => setTestValue(e.target.value)}
//             className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono tracking-wider text-slate-300"
//           />
//         </div>

//         <div className="flex gap-2">
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
//           >
//             <Phone className="w-4 h-4" /> {loading ? 'Triggering...' : 'Start Test Call'}
//           </button>

//           {loading && (
//             <button
//               type="button"
//               onClick={handleStopCall}
//               className="px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
//             >
//               Stop
//             </button>
//           )}
//         </div>
//       </form>
//     </section>
//   );
// }





import React from 'react';
import { Play, PhoneCall, Grid3x3, CheckCircle2, ShieldAlert, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LaunchTestCall({
  handleTriggerCall,
  handleStopCall,
  selectedLineId,
  setSelectedLineId,
  lines,
  targetNumber,
  setTargetNumber,
  testValue,
  setTestValue,
  loading,
}) {
  const isValidE164 = /^\+[1-9]\d{1,14}$/.test(targetNumber.trim());
  const isValidDtmf = testValue.trim().length === 16;
  const isFormValid = isValidE164 && isValidDtmf && lines.length > 0;

  return (
    <section className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all">
      {/* Background Accent Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2.5 text-slate-100">
          <span className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Play className="w-5 h-5 fill-blue-400/20" />
          </span>
          Launch Single Test Call
        </h2>
        <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/50">
          Manual Trigger
        </span>
      </div>

      <form onSubmit={handleTriggerCall} className="space-y-4">
        {/* Line Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Select Outgoing Line
          </label>
          <div className="relative">
            <select
              value={selectedLineId}
              onChange={(e) => setSelectedLineId(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer appearance-none shadow-inner"
            >
              {lines.length === 0 ? (
                <option value="">No lines registered</option>
              ) : (
                lines.map((line) => (
                  <option key={line.id} value={line.id} className="bg-slate-900 text-slate-200">
                    {line.phone_number} ({line.status || 'Active'})
                  </option>
                ))
              )}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-500 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Target IVR Number Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" /> Target IVR Number
            </label>
            {targetNumber.length > 0 && (
              <span
                className={`text-[10px] font-mono font-medium ${isValidE164 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
              >
                {isValidE164 ? 'Valid Number' : 'Include (+)'}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="tel"
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
              disabled={loading}
              placeholder="+1234567890"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
            />
            {isValidE164 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3" />
            ) : (
              targetNumber.length > 0 && (
                <ShieldAlert className="w-4 h-4 text-amber-500 absolute right-3.5 top-3" />
              )
            )}
          </div>
        </div>

        {/* DTMF Value Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Grid3x3 className="w-3.5 h-3.5 text-slate-400" /> Simulated DTMF Value (16 Digits)
            </label>
            <span
              className={`text-[10px] font-mono font-medium ${isValidDtmf ? 'text-emerald-400' : 'text-slate-500'
                }`}
            >
              {testValue.length}/16
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              maxLength={16}
              value={testValue}
              onChange={(e) => setTestValue(e.target.value.replace(/\D/g, ''))}
              disabled={loading}
              placeholder="1234567890123456"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
            />
            {isValidDtmf ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3" />
            ) : (
              testValue.length > 0 && (
                <ShieldAlert className="w-4 h-4 text-amber-500 absolute right-3.5 top-3" />
              )
            )}
          </div>
        </div>

        {/* Trigger / Abort Action Controls */}
        <div className="flex gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !isFormValid}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold rounded-xl py-3 text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Triggering Call...</span>
              </div>
            ) : (
              <>
                <PhoneCall className="w-4 h-4" /> Start Test Call
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {loading && (
              <motion.button
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleStopCall}
                className="px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:from-rose-700 active:to-red-700 text-white font-semibold rounded-xl py-3 text-sm transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-white" /> Stop
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </section>
  );
}