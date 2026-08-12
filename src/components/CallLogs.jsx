import React, { useState } from 'react';
import { Terminal, RefreshCw, Search } from 'lucide-react';

export default function CallLogs({ attempts, fetchData }) {
  const [expandedLogs, setExpandedLogs] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const toggleLog = (id) => {
    setExpandedLogs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredAttempts = attempts.filter(attempt => {
    // 1. Search term matching
    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed !== '') {
      return (
        attempt.id.toString().includes(trimmed) ||
        (attempt.test_value && attempt.test_value.toLowerCase().includes(trimmed)) ||
        (attempt.target_phone_number && attempt.target_phone_number.toLowerCase().includes(trimmed)) ||
        (attempt.result_details?.transcript && attempt.result_details.transcript.toLowerCase().includes(trimmed)) ||
        (attempt.logs && attempt.logs.some(l => l.toLowerCase().includes(trimmed)))
      );
    }

    // 2. Status matching (runs only if search is empty)
    if (statusFilter !== 'all' && attempt.status !== statusFilter) {
      return false;
    }

    // 3. Time matching (runs only if search is empty)
    if (timeFilter !== 'all') {
      const attemptDate = new Date(attempt.updated_at || attempt.created_at);
      const today = new Date();
      
      const isToday = attemptDate.getDate() === today.getDate() &&
        attemptDate.getMonth() === today.getMonth() &&
        attemptDate.getFullYear() === today.getFullYear();
      
      if (timeFilter === 'today' && !isToday) return false;

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const isYesterday = attemptDate.getDate() === yesterday.getDate() &&
        attemptDate.getMonth() === yesterday.getMonth() &&
        attemptDate.getFullYear() === yesterday.getFullYear();

      if (timeFilter === 'yesterday' && !isYesterday) return false;
    }

    return true;
  });

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex-1 flex flex-col">
      {/* Title Header */}
      <h2 className="text-lg font-bold mb-4 flex items-center justify-between text-slate-300">
        <span className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-500" /> Active Call Logs & History
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
            {filteredAttempts.length} found
          </span>
        </span>
        <button 
          onClick={fetchData} 
          className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 rounded-lg text-slate-400 transition-colors"
          title="Refresh Logs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </h2>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs or attempts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-300"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Date Filter */}
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-300"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-300"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={() => {
            setSearchTerm('');
            setTimeFilter('all');
            setStatusFilter('all');
          }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Logs View list */}
      <div className="space-y-4 overflow-y-auto max-h-[400px] flex-1 pr-2">
        {filteredAttempts.length === 0 ? (
          <p className="text-slate-500 text-sm">No matching attempts found.</p>
        ) : (
          filteredAttempts.map(attempt => (
            <div key={attempt.id} className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-300">Attempt #{attempt.id}</span>
                  <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 break-all">
                    {attempt.test_value}
                  </span>
                </div>
                <span className={`self-start sm:self-auto px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                  attempt.status === 'completed' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : attempt.status === 'failed' 
                    ? 'bg-rose-500/10 text-rose-400' 
                    : 'bg-blue-500/10 text-blue-400 animate-pulse'
                }`}>
                  {attempt.status.toUpperCase()}
                </span>
              </div>

              {/* Show execution logs */}
              <div className="bg-black/40 border border-slate-900 p-2.5 rounded-lg text-xs font-mono text-slate-400 space-y-1">
                {(attempt.logs || []).slice(0, expandedLogs[attempt.id] ? attempt.logs.length : 3).map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap break-all">{log}</div>
                ))}
              </div>
              {attempt.logs && attempt.logs.length > 3 && (
                <button 
                  onClick={() => toggleLog(attempt.id)}
                  className="text-xs text-blue-600 hover:underline font-semibold block mt-1 text-left"
                >
                  {expandedLogs[attempt.id] ? 'See Less ▲' : `See More (${attempt.logs.length - 3} lines) ▼`}
                </button>
              )}

              {/* Show recording URL and transcriptions if available */}
              {attempt.result_details?.recording_url && (
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="font-semibold text-slate-500">Call Recording:</span>
                  <a 
                    href={attempt.result_details.recording_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                  >
                    Listen to Recording 🎧
                  </a>
                </div>
              )}

              {attempt.result_details?.transcript && (
                <div className="mt-2 bg-slate-100 p-2.5 rounded-lg text-xs border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">IVR Transcript:</span>
                  <p className="text-slate-600 italic">"{attempt.result_details.transcript}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};
