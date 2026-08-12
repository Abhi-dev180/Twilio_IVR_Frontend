import React from 'react';

export default function StatsPanel({
  totalAttempts,
  completedAttempts,
  failedAttempts,
  inconclusiveAttempts,
  progressPercent
}) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Runs</p>
        <p className="text-2xl font-bold text-slate-100 mt-1">{totalAttempts}</p>
      </div>
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Completed / Success</p>
        <p className="text-2xl font-bold text-emerald-400 mt-1">{completedAttempts}</p>
      </div>
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Failed Tests</p>
        <p className="text-2xl font-bold text-rose-400 mt-1">{failedAttempts}</p>
      </div>
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Inconclusive / Pending</p>
        <p className="text-2xl font-bold text-amber-500 mt-1">{inconclusiveAttempts}</p>
      </div>
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg sm:col-span-2 lg:col-span-1">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Queue Progress</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-blue-400">{progressPercent}%</span>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
