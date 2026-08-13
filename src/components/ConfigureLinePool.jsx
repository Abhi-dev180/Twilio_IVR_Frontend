// import React from 'react';
// import { PlusCircle } from 'lucide-react';

// export default function ConfigureLinePool({
//   handleAddLine,
//   newLineNumber,
//   setNewLineNumber,
//   addingLine
// }) {
//   return (
//     <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
//       <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
//         <PlusCircle className="w-5 h-5" /> Configure Line Pool
//       </h2>
//       <form onSubmit={handleAddLine} className="space-y-4">
//         <div>
//           <label className="block text-xs font-medium text-slate-400 mb-1">Twilio Phone Number</label>
//           <input
//             type="text"
//             placeholder="+1234567890"
//             value={newLineNumber}
//             onChange={(e) => setNewLineNumber(e.target.value)}
//             className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={addingLine}
//           className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
//         >
//           {addingLine ? 'Registering...' : 'Register Phone Line'}
//         </button>
//       </form>
//     </section>
//   );
// }


import React from 'react';
import { PlusCircle, PhoneCall, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfigureLinePool({
  handleAddLine,
  newLineNumber,
  setNewLineNumber,
  addingLine,
}) {
  // E.164 format check (e.g., +1234567890)
  const isValidE164 = /^\+[1-9]\d{1,14}$/.test(newLineNumber.trim());

  return (
    <section className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all">
      {/* Subtle Corner Glow */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2.5 text-slate-100">
          <span className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <PlusCircle className="w-5 h-5" />
          </span>
          Configure Line Pool
        </h2>
        <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/50">
          E.164 Format
        </span>
      </div>

      <form onSubmit={handleAddLine} className="space-y-4">
        {/* Input Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" /> Twilio Phone Number
            </label>
            {newLineNumber.length > 0 && (
              <span
                className={`text-[10px] font-mono font-medium ${isValidE164 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
              >
                {isValidE164 ? 'Valid Number' : 'Include country code (+)'}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="tel"
              placeholder="+1234567890"
              value={newLineNumber}
              onChange={(e) => setNewLineNumber(e.target.value)}
              disabled={addingLine}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
            />
            {isValidE164 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3" />
            ) : (
              newLineNumber.length > 0 && (
                <ShieldAlert className="w-4 h-4 text-amber-500 absolute right-3.5 top-3" />
              )
            )}
          </div>
        </div>

        {/* Submit Action Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={addingLine || !isValidE164}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:from-indigo-700 active:to-blue-700 text-white font-semibold rounded-xl py-3 text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
        >
          {addingLine ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registering Line...</span>
            </div>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" /> Register Phone Line
            </>
          )}
        </motion.button>
      </form>
    </section>
  );
}