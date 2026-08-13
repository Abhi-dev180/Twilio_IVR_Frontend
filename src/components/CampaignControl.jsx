import React from 'react';
import { Play, XCircle, Activity } from 'lucide-react';

export default function CampaignControl({
  campaignRunning,
  loading,
  handleStartCampaign,
  handleStopCampaign,
  selectedLineId,
  setSelectedLineId,
  lines,
  testValue,
  setTestValue,
  maxRetries,
  setMaxRetries
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
        <Activity className="w-5 h-5 text-emerald-500" /> Campaign Control Panel
      </h2>
      <div className="space-y-4">
        <p className="text-xs text-slate-500 mb-3">
          Place automated test calls across the selected pool line using numbers loaded from <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-100 font-mono">test_targets.json</code>.
        </p>

        {/* Campaign Line Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Select Outgoing Line</label>
          <select
            value={selectedLineId}
            onChange={(e) => setSelectedLineId(e.target.value)}
            disabled={campaignRunning}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-900 focus:bg-white"
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
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Simulated DTMF Value (16 Digits)</label>
            <input
              type="text"
              maxLength={16}
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              disabled={campaignRunning}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-900 focus:bg-white font-mono tracking-wider"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Max Retries on Failure</label>
            <input
              type="number"
              min={0}
              max={10}
              value={maxRetries}
              onChange={(e) => setMaxRetries(parseInt(e.target.value) || 0)}
              disabled={campaignRunning}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-900 focus:bg-white font-mono"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {!campaignRunning ? (
            <button
              onClick={handleStartCampaign}
              disabled={loading || lines.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Start Campaign
            </button>
          ) : (
            <button
              onClick={handleStopCampaign}
              disabled={loading}
              className="flex-1 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-md flex items-center justify-center gap-2 animate-pulse"
            >
              <XCircle className="w-4 h-4" /> Stop Campaign
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
