import React from 'react';
import { Play, Phone } from 'lucide-react';

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
  loading
}) {
  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
        <Play className="w-5 h-5" /> Launch Single Test Call
      </h2>
      <form onSubmit={handleTriggerCall} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Select Outgoing Line</label>
          <select
            value={selectedLineId}
            onChange={(e) => setSelectedLineId(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-slate-300"
          >
            {lines.length === 0 ? (
              <option value="">No lines registered</option>
            ) : (
              lines.map(line => (
                <option key={line.id} value={line.id}>
                  {line.phone_number} ({line.status})
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Target IVR Number</label>
          <input
            type="text"
            value={targetNumber}
            onChange={(e) => setTargetNumber(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Simulated DTMF Value (16 Digits)</label>
          <input
            type="text"
            maxLength={16}
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono tracking-wider text-slate-300"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> {loading ? 'Triggering...' : 'Start Test Call'}
          </button>

          {loading && (
            <button
              type="button"
              onClick={handleStopCall}
              className="px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
            >
              Stop
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
