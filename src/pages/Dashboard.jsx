// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { Activity, LogOut } from 'lucide-react';

// import StatsPanel from '../components/StatsPanel';
// import CampaignControl from '../components/CampaignControl';
// import ConfigureLinePool from '../components/ConfigureLinePool';
// import LaunchTestCall from '../components/LaunchTestCall';
// import PhoneLinePool from '../components/PhoneLinePool';
// import CallLogs from '../components/CallLogs';

// const API_BASE = import.meta.env.VITE_API_URL;
// const WS_URL = import.meta.env.VITE_WS_URL;

// export default function Dashboard({ token, setToken }) {
//   const [lines, setLines] = useState([]);
//   const attemptStatuses = useRef({});
//   const [attempts, setAttempts] = useState([]);
//   const [testValue, setTestValue] = useState('1234567890123456');
//   const [selectedLineId, setSelectedLineId] = useState('');
//   const [targetNumber, setTargetNumber] = useState('+1234567890');
//   const [newLineNumber, setNewLineNumber] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [addingLine, setAddingLine] = useState(false);
//   const [campaignRunning, setCampaignRunning] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   // Set auth header and interceptors
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [token]);

//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response && [401, 403].includes(error.response.status)) {
//           localStorage.removeItem('adminToken');
//           setToken('');
//           toast.error('Session expired. Please log in again.');
//         }
//         return Promise.reject(error);
//       }
//     );
//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, [setToken]);

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     setToken('');
//     toast.success('Logged out successfully.');
//   };

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/status`);
//       setLines(res.data.lines || []);
//       setAttempts(res.data.attempts || []);
//       (res.data.attempts || []).forEach(a => {
//         attemptStatuses.current[a.id] = a.status;
//       });
//       setCampaignRunning(res.data.campaignRunning || false);
//       // Default line selection if not set
//       if (res.data.lines?.length > 0 && !selectedLineId) {
//         setSelectedLineId(res.data.lines[0].id.toString());
//       }
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();

//     let isMounted = true;
//     // Establish WebSocket Connection
//     let ws;
//     let reconnectTimeout;

//     function connect() {
//       if (!isMounted) return;
//       console.log('Connecting to WebSocket...');
//       ws = new WebSocket(WS_URL);

//       ws.onmessage = (event) => {
//         try {
//           const { type, payload } = JSON.parse(event.data);
//           if (type === 'line_update') {
//             setLines(prev => {
//               const idx = prev.findIndex(l => l.id === payload.id);
//               if (idx !== -1) {
//                 const copy = [...prev];
//                 copy[idx] = payload;
//                 return copy;
//               }
//               return [...prev, payload];
//             });
//           } else if (type === 'campaign_status') {
//             setCampaignRunning(payload.running);
//             if (payload.running) {
//               toast.success('Campaign run is now active!', { icon: '🚀' });
//             } else {
//               toast('Campaign run has been stopped.', { icon: '🛑' });
//             }
//           } else if (type === 'attempt_update') {
//             // Trigger toaster alerts outside of the state updater (React Strict Mode runs state updaters twice in dev)
//             const prevStatus = attemptStatuses.current[payload.id];
//             if (prevStatus !== payload.status) {
//               attemptStatuses.current[payload.id] = payload.status;
//               if (payload.status === 'completed') {
//                 toast.success(`Attempt #${payload.id} (Value: ${payload.test_value}) completed!`);
//               } else if (payload.status === 'failed') {
//                 toast.error(`Attempt #${payload.id} failed!`);
//               } else if (payload.status === 'active') {
//                 toast(`Attempt #${payload.id} call is active`, { icon: '📞' });
//               }
//             }

//             setAttempts(prev => {
//               const idx = prev.findIndex(a => a.id === payload.id);
//               if (idx !== -1) {
//                 const copy = [...prev];
//                 copy[idx] = payload;
//                 return copy;
//               }
//               return [payload, ...prev];
//             });
//           }
//         } catch (err) {
//           console.error('Error handling WebSocket message:', err);
//         }
//       };

//       ws.onclose = () => {
//         console.log('WebSocket connection closed. Reconnecting in 3s...');
//         reconnectTimeout = setTimeout(connect, 3000);
//       };

//       ws.onerror = (err) => {
//         console.error('WebSocket encountered an error:', err);
//         ws.close();
//       };
//     }

//     const handleOnline = () => {
//       toast.success("Back online!", { id: 'network-status-toast' });
//     };

//     const handleOffline = () => {
//       toast.error("Internet connection lost. Please check your network.", {
//         id: 'network-status-toast',
//         duration: Infinity
//       });
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     if (!navigator.onLine) {
//       handleOffline();
//     }

//     connect();

//     return () => {
//       isMounted = false;
//       if (ws) {
//         ws.onclose = null; // Prevent ghost reconnects
//         ws.close();
//       }
//       clearTimeout(reconnectTimeout);
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   const handleStartCampaign = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${API_BASE}/campaign/start`, {
//         phoneNumberId: selectedLineId,
//         testValue
//       });
//       const count = response.data.targetCount || 0;
//       toast.success(`Campaign initiated! Loading ${count} target contacts...`);
//       fetchData();
//     } catch (err) {
//       toast.error('Failed to start campaign.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStopCampaign = async () => {
//     setLoading(true);
//     try {
//       await axios.post(`${API_BASE}/campaign/stop`);
//       toast.success('Campaign stopped.');
//       fetchData();
//     } catch (err) {
//       toast.error('Failed to stop campaign.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTriggerCall = async (e) => {
//     e.preventDefault();
//     if (!selectedLineId) {
//       toast.error('Please select or add a phone line first.');
//       return;
//     }
//     setLoading(true);
//     toast.promise(
//       axios.post(`${API_BASE}/trigger`, {
//         testValue,
//         phoneNumberId: selectedLineId,
//         toPhoneNumber: targetNumber
//       }),
//       {
//         loading: 'Initiating outbound call...',
//         success: (res) => {
//           setLoading(false);
//           fetchData();
//           return `Call triggered successfully! SID: ${res.data.attempt.call_sid || 'Simulated'}`;
//         },
//         error: (err) => {
//           setLoading(false);
//           return `Failed to start call: ${err.response?.data?.error || err.message}`;
//         }
//       }
//     );
//   };

//   const handleAddLine = async (e) => {
//     e.preventDefault();
//     if (!newLineNumber) return;
//     setAddingLine(true);
//     try {
//       await axios.post(`${API_BASE}/line`, {
//         phoneNumber: newLineNumber,
//         maxAttempts: 100
//       });
//       toast.success(`Phone line ${newLineNumber} registered successfully!`);
//       setNewLineNumber('');
//       fetchData();
//     } catch (err) {
//       toast.error('Failed to add phone line.');
//     } finally {
//       setAddingLine(false);
//     }
//   };

//   const handleDeleteLine = (lineId) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2 p-1">
//         <p className="text-sm font-semibold text-slate-900">Are you sure you want to delete this phone line?</p>
//         <div className="flex justify-end gap-2 mt-1">
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="px-3 py-1 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
//           >
//             No
//           </button>
//           <button
//             onClick={async () => {
//               toast.dismiss(t.id);
//               try {
//                 await axios.delete(`${API_BASE}/line/${lineId}`);
//                 toast.success('Phone line deleted successfully.');
//                 fetchData();
//               } catch (err) {
//                 toast.error('Failed to delete phone line.');
//               }
//             }}
//             className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
//           >
//             Yes
//           </button>
//         </div>
//       </div>
//     ), {
//       id: 'confirm-delete-toast',
//       duration: 7000,
//       position: 'top-right',
//       style: {
//         background: '#ffffff',
//         border: '1px solid #cbd5e1',
//         color: '#000000',
//         minWidth: '300px'
//       }
//     });
//   };

//   const handleUpdateLine = async (lineId, newNumber) => {
//     if (!newNumber) return;
//     try {
//       await axios.put(`${API_BASE}/line/${lineId}`, { phoneNumber: newNumber });
//       toast.success('Phone line updated successfully.');
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to update phone line.');
//     }
//   };

//   const totalAttempts = attempts.length;
//   const completedAttempts = attempts.filter(a => a.status === 'completed').length;
//   const failedAttempts = attempts.filter(a => a.status === 'failed').length;
//   const inconclusiveAttempts = attempts.filter(a => ['queued', 'retry', 'active'].includes(a.status)).length;

//   const latestBatchId = attempts.find(a => a.batch_id)?.batch_id;
//   const activeAttempts = latestBatchId ? attempts.filter(a => a.batch_id === latestBatchId) : [];
//   const activeTotalAttempts = activeAttempts.length;
//   const activeFinishedAttempts = activeAttempts.filter(a => ['completed', 'failed'].includes(a.status)).length;
//   const progressPercent = activeTotalAttempts > 0 ? Math.round((activeFinishedAttempts / activeTotalAttempts) * 100) : 0;

//   // Show progress if campaign is manually set to running OR we have active calls not yet 100% finished
//   const showProgress = campaignRunning || (activeTotalAttempts > 0 && progressPercent < 100);

//   if (initialLoading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
//             <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
//           </div>
//           <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Twilio IVR Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 sm:p-6 lg:p-12 text-slate-100 flex flex-col justify-between">
//       <Toaster position="top-right" toastOptions={{
//         style: {
//           background: '#1e293b',
//           color: '#f8fafc',
//           border: '1px solid rgba(255, 255, 255, 0.1)'
//         }
//       }} />

//       {/* Header */}
//       <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <span className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
//               <Activity className="w-6 h-6 animate-pulse" />
//             </span>
//             <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
//               Twilio IVR QA Platform
//             </h1>
//           </div>
//           <p className="text-slate-400 text-sm mt-1">Automated Multi-line Voice & DTMF validation system</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-md">
//             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
//             <span className="text-xs font-semibold text-slate-300">SYSTEM ACTIVE (MILESTONE 2)</span>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
//             title="Sign Out"
//           >
//             <LogOut className="w-3.5 h-3.5" /> Logout
//           </button>
//         </div>
//       </header>

//       <StatsPanel
//         totalAttempts={totalAttempts}
//         completedAttempts={completedAttempts}
//         failedAttempts={failedAttempts}
//         inconclusiveAttempts={inconclusiveAttempts}
//         progressPercent={progressPercent}
//         showProgress={showProgress}
//       />

//       {/* Main Grid */}
//       <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-auto">

//         {/* Left Column: Call triggers and Line Configurations */}
//         <div className="lg:col-span-1 flex flex-col gap-6">
//           <CampaignControl
//             campaignRunning={campaignRunning}
//             loading={loading}
//             handleStartCampaign={handleStartCampaign}
//             handleStopCampaign={handleStopCampaign}
//             selectedLineId={selectedLineId}
//             setSelectedLineId={setSelectedLineId}
//             lines={lines}
//             testValue={testValue}
//             setTestValue={setTestValue}
//           />

//           <ConfigureLinePool
//             handleAddLine={handleAddLine}
//             newLineNumber={newLineNumber}
//             setNewLineNumber={setNewLineNumber}
//             addingLine={addingLine}
//           />

//           <LaunchTestCall
//             handleTriggerCall={handleTriggerCall}
//             handleStopCall={handleStopCampaign}
//             selectedLineId={selectedLineId}
//             setSelectedLineId={setSelectedLineId}
//             lines={lines}
//             targetNumber={targetNumber}
//             setTargetNumber={setTargetNumber}
//             testValue={testValue}
//             setTestValue={setTestValue}
//             loading={loading}
//           />
//         </div>

//         {/* Right Column: Status Lists & Logs */}
//         <div className="lg:col-span-2 flex flex-col gap-6">
//           <PhoneLinePool
//             lines={lines}
//             attempts={attempts}
//             handleDeleteLine={handleDeleteLine}
//             handleUpdateLine={handleUpdateLine}
//           />

//           <CallLogs attempts={attempts} fetchData={fetchData} />
//         </div>

//       </main>

//       {/* Footer */}
//       <footer className="mt-12 text-center text-xs text-slate-600 border-t border-slate-900 pt-6">
//         Twilio Voice Automated QA Platform • Built for Matthew & Partner
//       </footer>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Activity, LogOut, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import StatsPanel from '../components/StatsPanel';
import ConfigureLinePool from '../components/ConfigureLinePool';
import LaunchTestCall from '../components/LaunchTestCall';
import PhoneLinePool from '../components/PhoneLinePool';
import CallLogs from '../components/CallLogs';
import Loader from '../components/Loader';

const API_BASE = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] },
  },
};

export default function Dashboard({ token, setToken }) {
  const [lines, setLines] = useState([]);
  const attemptStatuses = useRef({});
  const [attempts, setAttempts] = useState([]);
  const [testValue, setTestValue] = useState(() => {
    return localStorage.getItem('savedTestValue') || '4520340097972148';
  });
  const [selectedLineId, setSelectedLineId] = useState('');
  const [targetNumber, setTargetNumber] = useState(() => {
    return localStorage.getItem('savedTargetNumber') || '+1234567890';
  });

  useEffect(() => {
    localStorage.setItem('savedTestValue', testValue);
  }, [testValue]);

  useEffect(() => {
    localStorage.setItem('savedTargetNumber', targetNumber);
  }, [targetNumber]);
  const [newLineNumber, setNewLineNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingLine, setAddingLine] = useState(false);
  const [campaignRunning, setCampaignRunning] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [maxRetries, setMaxRetries] = useState(() => {
    const saved = localStorage.getItem('savedMaxRetries');
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  // Set auth header and interceptors
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('savedMaxRetries', maxRetries);
  }, [maxRetries]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
          localStorage.removeItem('adminToken');
          setToken('');
          toast.error('Session expired. Please log in again.');
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [setToken]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    toast.success('Logged out successfully.');
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/status`);
      setLines(res.data.lines || []);
      setAttempts(res.data.attempts || []);
      (res.data.attempts || []).forEach((a) => {
        attemptStatuses.current[a.id] = a.status;
      });
      setCampaignRunning(res.data.campaignRunning || false);
      if (res.data.lines?.length > 0 && !selectedLineId) {
        setSelectedLineId(res.data.lines[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    let isMounted = true;
    let ws;
    let reconnectTimeout;

    function connect() {
      if (!isMounted) return;
      console.log('Connecting to WebSocket...');
      ws = new WebSocket(WS_URL);

      ws.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          if (type === 'line_update') {
            setLines((prev) => {
              const idx = prev.findIndex((l) => l.id === payload.id);
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
            const prevStatus = attemptStatuses.current[payload.id];
            if (prevStatus !== payload.status) {
              attemptStatuses.current[payload.id] = payload.status;
              if (payload.status === 'completed') {
                toast.success(
                  `Attempt #${payload.id} (Value: ${payload.test_value}) completed!`
                );
              } else if (payload.status === 'failed') {
                toast.error(`Attempt #${payload.id} failed!`);
              } else if (payload.status === 'active') {
                toast(`Attempt #${payload.id} call is active`, { icon: '📞' });
              }
            }

            setAttempts((prev) => {
              const idx = prev.findIndex((a) => a.id === payload.id);
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

    const handleOnline = () => {
      toast.success('Back online!', { id: 'network-status-toast' });
    };

    const handleOffline = () => {
      toast.error('Internet connection lost. Please check your network.', {
        id: 'network-status-toast',
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      handleOffline();
    }

    connect();

    return () => {
      isMounted = false;
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      clearTimeout(reconnectTimeout);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleStartCampaign = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/campaign/start`, {
        phoneNumberId: selectedLineId,
        testValue,
      });
      const count = response.data.targetCount || 0;
      toast.success(`Campaign initiated! Loading ${count} target contacts...`);
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
      axios.post(`${API_BASE}/campaign/start-test-code`, {
        sixteenDigit: testValue,
        phoneNumberId: selectedLineId,
        toPhoneNumber: '+12495075171',
        maxRetries: 3
      }),
      {
        loading: 'Initiating Test code brute force call...',
        success: (res) => {
          setLoading(false);
          fetchData();
          return `Test code Tester initiated successfully! Batch: ${res.data.batchId}`;
        },
        error: (err) => {
          setLoading(false);
          return `Failed to start call: ${err.response?.data?.error || err.message}`;
        },
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
        maxAttempts: 100,
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

  const handleDeleteLine = (lineId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 p-1">
          <p className="text-sm font-semibold text-slate-900">
            Are you sure you want to delete this phone line?
          </p>
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              No
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(`${API_BASE}/line/${lineId}`);
                  toast.success('Phone line deleted successfully.');
                  fetchData();
                } catch (err) {
                  toast.error('Failed to delete phone line.');
                }
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Yes
            </button>
          </div>
        </div>
      ),
      {
        id: 'confirm-delete-toast',
        duration: 7000,
        position: 'top-right',
        style: {
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          color: '#000000',
          minWidth: '300px',
        },
      }
    );
  };

  const handleUpdateLine = async (lineId, newNumber) => {
    if (!newNumber) return;
    try {
      await axios.put(`${API_BASE}/line/${lineId}`, { phoneNumber: newNumber });
      toast.success('Phone line updated successfully.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update phone line.');
    }
  };

  const totalAttempts = attempts.length;
  const completedAttempts = attempts.filter((a) => a.status === 'completed').length;
  const failedAttempts = attempts.filter((a) => a.status === 'failed').length;
  const inconclusiveAttempts = attempts.filter((a) =>
    ['queued', 'retry', 'active'].includes(a.status)
  ).length;

  const latestBatchId = attempts.find((a) => a.batch_id)?.batch_id;
  const activeAttempts = latestBatchId
    ? attempts.filter((a) => a.batch_id === latestBatchId)
    : [];
  const activeTotalAttempts = activeAttempts.length;
  const activeFinishedAttempts = activeAttempts.filter((a) =>
    ['completed', 'failed'].includes(a.status)
  ).length;
  
  let progressPercent = 0;
  if (activeTotalAttempts > 0) {
    if (activeTotalAttempts === 1 && activeAttempts[0].test_value && activeAttempts[0].test_value.includes(':')) {
      const currentCode = parseInt(activeAttempts[0].test_value.split(':')[1], 10) || 0;
      progressPercent = Math.min(100, Math.max(0, Math.round((currentCode / 999) * 100)));
      if (['completed', 'failed'].includes(activeAttempts[0].status)) {
        progressPercent = 100;
      }
    } else {
      progressPercent = Math.round((activeFinishedAttempts / activeTotalAttempts) * 100);
    }
  }

  const showProgress =
    campaignRunning || (activeTotalAttempts > 0 && progressPercent < 100) || (activeTotalAttempts === 1 && activeAttempts[0].status === 'active');

  if (initialLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(12px)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '0.75rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          },
        }}
      />

      {/* Main Wrapper */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="group flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 shadow-lg shadow-blue-500/10"
                >
                  <Activity className="h-5 w-5 text-blue-400 transition-colors group-hover:text-cyan-300" />
                </motion.div>

                <div>
                  <h1 className="bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                    Twilio IVR QA Platform
                  </h1>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <p className="text-xs font-medium tracking-wide text-slate-900">
                      Automated voice testing platform
                    </p>
                  </div>
                </div>
              </motion.div>
              <p className="text-white text-xs sm:text-sm mt-0.5">
                Automated multi-line voice execution & DTMF validation system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 border border-emerald-500/30 rounded-xl shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                System Active
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-all shadow-sm"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" /> Logout
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <StatsPanel
            totalAttempts={totalAttempts}
            completedAttempts={completedAttempts}
            failedAttempts={failedAttempts}
            inconclusiveAttempts={inconclusiveAttempts}
            progressPercent={progressPercent}
            showProgress={showProgress}
          />
        </motion.div>

        {/* Main Dashboard Grid */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Controls & Triggers (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            <motion.div variants={itemVariants}>
              <LaunchTestCall
                handleTriggerCall={handleTriggerCall}
                handleStopCall={handleStopCampaign}
                selectedLineId={selectedLineId}
                setSelectedLineId={setSelectedLineId}
                lines={lines}
                targetNumber={targetNumber}
                setTargetNumber={setTargetNumber}
                testValue={testValue}
                setTestValue={setTestValue}
                loading={loading}
                campaignRunning={campaignRunning}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ConfigureLinePool
                handleAddLine={handleAddLine}
                newLineNumber={newLineNumber}
                setNewLineNumber={setNewLineNumber}
                addingLine={addingLine}
                campaignRunning={campaignRunning}
              />
            </motion.div>
          </div>

          {/* Right Column: Active Pools & Execution Logs (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div variants={itemVariants}>
              <PhoneLinePool
                lines={lines}
                attempts={attempts}
                handleDeleteLine={handleDeleteLine}
                handleUpdateLine={handleUpdateLine}
                campaignRunning={campaignRunning}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex-1 flex flex-col">
              <CallLogs attempts={attempts} fetchData={fetchData} />
            </motion.div>
          </div>
        </motion.main>
      </div>

      {/* Modern Footer */}
      <footer className="mt-12 py-6 border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-500" /> Twilio Voice Automated QA Platform
          </p>
          <p className="text-slate-600">Built for Matthew & Partner</p>
        </div>
      </footer>
    </div>
  );
}