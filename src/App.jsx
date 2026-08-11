import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Phone, 
  Play, 
  Activity, 
  Terminal, 
  Settings, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  PlusCircle,
  Hash
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/call';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

export default function App() {
  const [lines, setLines] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [testValue, setTestValue] = useState('1234567890123456');
  const [selectedLineId, setSelectedLineId] = useState('');
  const [targetNumber, setTargetNumber] = useState('+1234567890');
  const [newLineNumber, setNewLineNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingLine, setAddingLine] = useState(false);
  const [campaignRunning, setCampaignRunning] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/status`);
      setLines(res.data.lines || []);
      setAttempts(res.data.attempts || []);
      setCampaignRunning(res.data.campaignRunning || false);
      // Default line selection if not set
      if (res.data.lines?.length > 0 && !selectedLineId) {
        setSelectedLineId(res.data.lines[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Establish WebSocket Connection
    let ws;
    let reconnectTimeout;

    function connect() {
      console.log('Connecting to WebSocket...');
      ws = new WebSocket(WS_URL);

      ws.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          if (type === 'line_update') {
            setLines(prev => {
              const idx = prev.findIndex(l => l.id === payload.id);
              if (idx !== -1) {
                const copy = [...prev];
                copy[idx] = payload;
                return copy;
              }
              return [...prev, payload];
            });
          } else if (type === 'campaign_status') {
            setCampaignRunning(payload.running);
            if (payload.running) {
              toast.success('Campaign run is now active!', { icon: '🚀' });
            } else {
              toast('Campaign run has been stopped.', { icon: '🛑' });
            }
          } else if (type === 'attempt_update') {
            setAttempts(prev => {
              const idx = prev.findIndex(a => a.id === payload.id);
              
              // Trigger toaster alerts
              const prevAttempt = prev[idx];
              if (!prevAttempt || prevAttempt.status !== payload.status) {
                if (payload.status === 'completed') {
                  toast.success(`Attempt #${payload.id} (Value: ${payload.test_value}) completed!`);
                } else if (payload.status === 'failed') {
                  toast.error(`Attempt #${payload.id} failed!`);
                } else if (payload.status === 'active') {
                  toast(`Attempt #${payload.id} call is active`, { icon: '📞' });
                }
              }

              if (idx !== -1) {
                const copy = [...prev];
                copy[idx] = payload;
                return copy;
              }
              return [payload, ...prev];
            });
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed. Reconnecting in 3s...');
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket encountered an error:', err);
        ws.close();
      };
    }

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, [selectedLineId]);

  const handleStartCampaign = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/campaign/start`);
      toast.success('Campaign initiated! Loading 50 target contacts...');
      fetchData();
    } catch (err) {
      toast.error('Failed to start campaign.');
    } finally {
      setLoading(false);
    }
  };

  const handleStopCampaign = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/campaign/stop`);
      toast.success('Campaign stopped.');
      fetchData();
    } catch (err) {
      toast.error('Failed to stop campaign.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerCall = async (e) => {
    e.preventDefault();
    if (!selectedLineId) {
      toast.error('Please select or add a phone line first.');
      return;
    }
    setLoading(true);
    toast.promise(
      axios.post(`${API_BASE}/trigger`, {
        testValue,
        phoneNumberId: selectedLineId,
        toPhoneNumber: targetNumber
      }),
      {
        loading: 'Initiating outbound call...',
        success: (res) => {
          setLoading(false);
          fetchData();
          return `Call triggered successfully! SID: ${res.data.attempt.call_sid || 'Simulated'}`;
        },
        error: (err) => {
          setLoading(false);
          return `Failed to start call: ${err.response?.data?.error || err.message}`;
        }
      }
    );
  };

  const handleAddLine = async (e) => {
    e.preventDefault();
    if (!newLineNumber) return;
    setAddingLine(true);
    try {
      await axios.post(`${API_BASE}/line`, {
        phoneNumber: newLineNumber,
        maxAttempts: 100
      });
      toast.success(`Phone line ${newLineNumber} registered successfully!`);
      setNewLineNumber('');
      fetchData();
    } catch (err) {
      toast.error('Failed to add phone line.');
    } finally {
      setAddingLine(false);
    }
  };

  const totalAttempts = attempts.length;
  const completedAttempts = attempts.filter(a => a.status === 'completed').length;
  const failedAttempts = attempts.filter(a => a.status === 'failed' && a.result_details?.result === 'failed').length;
  const inconclusiveAttempts = attempts.filter(a => a.status === 'failed' && a.result_details?.result === 'inconclusive').length;
  const progressPercent = totalAttempts > 0 ? Math.round((completedAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="min-h-screen p-6 lg:p-12 text-slate-100 flex flex-col justify-between">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }} />

      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Twilio IVR QA Platform
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Automated Multi-line Voice & DTMF validation system</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-xs font-semibold text-slate-300">SYSTEM ACTIVE (MILESTONE 2)</span>
        </div>
      </header>

      {/* Stats Panel */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg col-span-2 md:col-span-1">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Queue Progress</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-400">{progressPercent}%</span>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-auto">
        
        {/* Left Column: Call triggers and Line Configurations */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Campaign Control Panel */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
              <Activity className="w-5 h-5" /> Campaign Control Panel
            </h2>
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Place 50 automated test calls across registered pool lines using numbers loaded from <code className="text-indigo-400">test_targets.json</code>.
              </p>
              
              <div className="flex gap-3">
                {!campaignRunning ? (
                  <button
                    onClick={handleStartCampaign}
                    disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Start Campaign
                  </button>
                ) : (
                  <button
                    onClick={handleStopCampaign}
                    disabled={loading}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 animate-pulse"
                  >
                    <XCircle className="w-4 h-4" /> Stop Campaign
                  </button>
                )}
              </div>
            </div>
          </section>
          
          {/* Configure Phone Line */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
              <PlusCircle className="w-5 h-5" /> Configure Line Pool
            </h2>
            <form onSubmit={handleAddLine} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Twilio Phone Number</label>
                <input
                  type="text"
                  placeholder="+1234567890"
                  value={newLineNumber}
                  onChange={(e) => setNewLineNumber(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={addingLine}
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {addingLine ? 'Registering...' : 'Register Phone Line'}
              </button>
            </form>
          </section>

          {/* Trigger Outbound Call */}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> {loading ? 'Triggering...' : 'Start Test Call'}
              </button>
            </form>
          </section>

        </div>

        {/* Right Column: Status Lists & Logs */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Active Lines Status */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
              <Phone className="w-5 h-5" /> Phone Line Pool
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lines.length === 0 ? (
                <p className="text-slate-500 text-sm col-span-2">No phone lines configured yet.</p>
              ) : (
                lines.map(line => (
                  <div key={line.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-300">{line.phone_number}</p>
                      <p className="text-xs text-slate-500">Processed: {line.attempts_processed} attempts</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      line.status === 'busy' 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {line.status.toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Test Attempts & Realtime Logger */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex-1 flex flex-col">
            <h2 className="text-lg font-bold mb-4 flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-500" /> Active Call Logs & History
              </span>
              <button 
                onClick={fetchData} 
                className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 rounded-lg text-slate-400 transition-colors"
                title="Refresh Logs"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[400px] flex-1 pr-2">
              {attempts.length === 0 ? (
                <p className="text-slate-500 text-sm">No attempts executed yet. Launch a test call above.</p>
              ) : (
                attempts.map(attempt => (
                  <div key={attempt.id} className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-300">Attempt #{attempt.id}</span>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {attempt.test_value}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
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
                      {attempt.logs?.map((log, i) => (
                        <div key={i} className="truncate">{log}</div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-600 border-t border-slate-900 pt-6">
        Twilio Voice Automated QA Platform • Built for Matthew & Partner
      </footer>
    </div>
  );
}
