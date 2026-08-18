// import React, { useState } from 'react';
// import { Terminal, RefreshCw, Search } from 'lucide-react';

// export default function CallLogs({ attempts, fetchData }) {
//   const [expandedLogs, setExpandedLogs] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [timeFilter, setTimeFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');

//   const toggleLog = (id) => {
//     setExpandedLogs(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   const filteredAttempts = attempts.filter(attempt => {
//     // 1. Search term matching
//     const trimmed = searchTerm.trim().toLowerCase();
//     if (trimmed !== '') {
//       return (
//         attempt.id.toString().includes(trimmed) ||
//         (attempt.test_value && attempt.test_value.toLowerCase().includes(trimmed)) ||
//         (attempt.target_phone_number && attempt.target_phone_number.toLowerCase().includes(trimmed)) ||
//         (attempt.result_details?.transcript && attempt.result_details.transcript.toLowerCase().includes(trimmed)) ||
//         (attempt.logs && attempt.logs.some(l => l.toLowerCase().includes(trimmed)))
//       );
//     }

//     // 2. Status matching (runs only if search is empty)
//     if (statusFilter !== 'all' && attempt.status !== statusFilter) {
//       return false;
//     }

//     // 3. Time matching (runs only if search is empty)
//     if (timeFilter !== 'all') {
//       const attemptDate = new Date(attempt.updated_at || attempt.created_at);
//       const today = new Date();

//       const isToday = attemptDate.getDate() === today.getDate() &&
//         attemptDate.getMonth() === today.getMonth() &&
//         attemptDate.getFullYear() === today.getFullYear();

//       if (timeFilter === 'today' && !isToday) return false;

//       const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
//       const isYesterday = attemptDate.getDate() === yesterday.getDate() &&
//         attemptDate.getMonth() === yesterday.getMonth() &&
//         attemptDate.getFullYear() === yesterday.getFullYear();

//       if (timeFilter === 'yesterday' && !isYesterday) return false;
//     }

//     return true;
//   });

//   return (
//     <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex-1 flex flex-col">
//       {/* Title Header */}
//       <h2 className="text-lg font-bold mb-4 flex items-center justify-between text-slate-300">
//         <span className="flex items-center gap-2">
//           <Terminal className="w-5 h-5 text-emerald-500" /> Active Call Logs & History
//           <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
//             {filteredAttempts.length} found
//           </span>
//         </span>
//         <button 
//           onClick={fetchData} 
//           className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 rounded-lg text-slate-400 transition-colors"
//           title="Refresh Logs"
//         >
//           <RefreshCw className="w-4 h-4" />
//         </button>
//       </h2>

//       {/* Filter and Search Bar */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
//         {/* Search */}
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search logs or attempts..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-300"
//           />
//           <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
//         </div>

//         {/* Date Filter */}
//         <select
//           value={timeFilter}
//           onChange={(e) => setTimeFilter(e.target.value)}
//           className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-300"
//         >
//           <option value="all">All Dates</option>
//           <option value="today">Today</option>
//           <option value="yesterday">Yesterday</option>
//         </select>

//         {/* Status Filter */}
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-300"
//         >
//           <option value="all">All Statuses</option>
//           <option value="active">Active</option>
//           <option value="completed">Completed</option>
//           <option value="failed">Failed</option>
//         </select>

//         {/* Reset Button */}
//         <button
//           onClick={() => {
//             setSearchTerm('');
//             setTimeFilter('all');
//             setStatusFilter('all');
//           }}
//           className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
//         >
//           Reset Filters
//         </button>
//       </div>

//       {/* Logs View list */}
//       <div className="space-y-4 overflow-y-auto max-h-[400px] flex-1 pr-2">
//         {filteredAttempts.length === 0 ? (
//           <p className="text-slate-500 text-sm">No matching attempts found.</p>
//         ) : (
//           filteredAttempts.map(attempt => (
//             <div key={attempt.id} className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2">
//               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-sm font-bold text-slate-300">Attempt #{attempt.id}</span>
//                   <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 break-all">
//                     {attempt.test_value}
//                   </span>
//                 </div>
//                 <span className={`self-start sm:self-auto px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
//                   attempt.status === 'completed' 
//                     ? 'bg-emerald-500/10 text-emerald-400' 
//                     : attempt.status === 'failed' 
//                     ? 'bg-rose-500/10 text-rose-400' 
//                     : 'bg-blue-500/10 text-blue-400 animate-pulse'
//                 }`}>
//                   {attempt.status.toUpperCase()}
//                 </span>
//               </div>

//               {/* Show execution logs */}
//               <div className="bg-black/40 border border-slate-900 p-2.5 rounded-lg text-xs font-mono text-slate-400 space-y-1">
//                 {(attempt.logs || []).slice(0, expandedLogs[attempt.id] ? attempt.logs.length : 3).map((log, i) => (
//                   <div key={i} className="whitespace-pre-wrap break-all">{log}</div>
//                 ))}
//               </div>
//               {attempt.logs && attempt.logs.length > 3 && (
//                 <button 
//                   onClick={() => toggleLog(attempt.id)}
//                   className="text-xs text-blue-600 hover:underline font-semibold block mt-1 text-left"
//                 >
//                   {expandedLogs[attempt.id] ? 'See Less ▲' : `See More (${attempt.logs.length - 3} lines) ▼`}
//                 </button>
//               )}

//               {/* Show recording URL and transcriptions if available */}
//               {attempt.result_details?.recording_url && (
//                 <div className="flex items-center gap-2 mt-2 text-xs">
//                   <span className="font-semibold text-slate-500">Call Recording:</span>
//                   <a 
//                     href={attempt.result_details.recording_url} 
//                     target="_blank" 
//                     rel="noreferrer" 
//                     className="text-blue-600 hover:underline font-medium flex items-center gap-1"
//                   >
//                     Listen to Recording 🎧
//                   </a>
//                 </div>
//               )}

//               {attempt.result_details?.transcript && (
//                 <div className="mt-2 bg-slate-100 p-2.5 rounded-lg text-xs border border-slate-200">
//                   <span className="font-bold text-slate-700 block mb-1">IVR Transcript:</span>
//                   <p className="text-slate-600 italic">"{attempt.result_details.transcript}"</p>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </section>
//   );
// };






// import React, { useState } from 'react';
// import { Terminal, RefreshCw, Search, ChevronDown, ChevronUp, Phone, Clock, FileText } from 'lucide-react';

// export default function CallLogs({ attempts = [], fetchData }) {
//   const [expandedLogs, setExpandedLogs] = useState({});
//   const [expandedTranscripts, setExpandedTranscripts] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [timeFilter, setTimeFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');

//   const toggleLog = (id) => {
//     setExpandedLogs((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const toggleTranscript = (id) => {
//     setExpandedTranscripts((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const filteredAttempts = attempts.filter((attempt) => {
//     // 1. Search term matching
//     const trimmed = searchTerm.trim().toLowerCase();
//     if (trimmed !== '') {
//       return (
//         attempt.id?.toString().toLowerCase().includes(trimmed) ||
//         attempt.test_value?.toLowerCase().includes(trimmed) ||
//         attempt.target_phone_number?.toLowerCase().includes(trimmed) ||
//         attempt.direction?.toLowerCase().includes(trimmed) ||
//         attempt.result_details?.transcript?.toLowerCase().includes(trimmed) ||
//         (attempt.logs && attempt.logs.some((l) => l.toLowerCase().includes(trimmed)))
//       );
//     }

//     // 2. Status matching
//     if (statusFilter !== 'all' && attempt.status !== statusFilter) {
//       return false;
//     }

//     // 3. Time matching
//     if (timeFilter !== 'all') {
//       const attemptDate = new Date(attempt.updated_at || attempt.created_at);
//       const today = new Date();

//       const isToday =
//         attemptDate.getDate() === today.getDate() &&
//         attemptDate.getMonth() === today.getMonth() &&
//         attemptDate.getFullYear() === today.getFullYear();

//       if (timeFilter === 'today' && !isToday) return false;

//       const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
//       const isYesterday =
//         attemptDate.getDate() === yesterday.getDate() &&
//         attemptDate.getMonth() === yesterday.getMonth() &&
//         attemptDate.getFullYear() === yesterday.getFullYear();

//       if (timeFilter === 'yesterday' && !isYesterday) return false;
//     }

//     return true;
//   });

//   const renderDialogueTranscript = (transcriptText, attemptId) => {
//     if (!transcriptText) return null;

//     // Splits lines by literal newlines
//     const lines = transcriptText.split('\n').map(line => line.trim()).filter(Boolean);
    
//     const isTranscriptExpanded = expandedTranscripts[attemptId];
//     const visibleLines = isTranscriptExpanded ? lines : lines.slice(0, 10);

//     return (
//       <div className="space-y-2 mt-2 bg-slate-50 p-3 rounded border border-slate-100">
//         {visibleLines.map((line, index) => {
//           // Extract speaker if in format "Speaker: message"
//           const match = line.match(/^([^:]+):\s*(.*)$/i);
          
//           if (match) {
//             const speaker = match[1].trim();
//             const text = match[2].trim();
            
//             // Color 'System' or 'User' slightly differently than the IVR
//             const isSystem = speaker.toLowerCase() === 'system' || speaker.toLowerCase() === 'user';
            
//             return (
//               <div key={index} className="text-[13px] leading-relaxed mb-1.5">
//                 <p className={isSystem ? "text-blue-700" : "text-slate-700"}>
//                   <span className={`font-bold ${isSystem ? "text-blue-900" : "text-slate-900"}`}>
//                     {speaker}:{' '}
//                   </span>
//                   {text}
//                 </p>
//               </div>
//             );
//           }

//           // Fallback line rendering
//           return (
//             <div key={index} className="text-[13px] leading-relaxed mb-1.5">
//               <p className="text-slate-600 italic">{line}</p>
//             </div>
//           );
//         })}
        
//         {lines.length > 10 && (
//           <button 
//             onClick={() => toggleTranscript(attemptId)}
//             className="text-xs text-blue-600 hover:underline font-semibold block mt-3"
//           >
//             {isTranscriptExpanded ? 'See Less ▲' : `See More (${lines.length - 10} lines) ▼`}
//           </button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col font-sans">
//       {/* Title Header */}
//       <h2 className="text-lg font-bold mb-4 flex items-center justify-between text-slate-800">
//         <span className="flex items-center gap-2">
//           <Terminal className="w-5 h-5 text-blue-600" /> Call Log's & Transcription
//           <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
//             {filteredAttempts.length} found
//           </span>
//         </span>
//         <button
//           onClick={fetchData}
//           className="p-1.5 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 transition-colors shadow-sm"
//           title="Refresh Logs"
//         >
//           <RefreshCw className="w-4 h-4" />
//         </button>
//       </h2>

//       {/* Filter and Search Bar */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search logs or attempts..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
//           />
//           <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
//         </div>

//         <select
//           value={timeFilter}
//           onChange={(e) => setTimeFilter(e.target.value)}
//           className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
//         >
//           <option value="all">All Dates</option>
//           <option value="today">Today</option>
//           <option value="yesterday">Yesterday</option>
//         </select>

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
//         >
//           <option value="all">All Statuses</option>
//           <option value="active">Active</option>
//           <option value="completed">Completed</option>
//           <option value="failed">Failed</option>
//           <option value="retry">Retry</option>
//         </select>

//         <button
//           onClick={() => {
//             setSearchTerm('');
//             setTimeFilter('all');
//             setStatusFilter('all');
//           }}
//           className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors shadow-sm"
//         >
//           Reset Filters
//         </button>
//       </div>

//       {/* Logs View List */}
//       <div className="space-y-3 overflow-y-auto max-h-[600px] flex-1 pr-1">
//         {filteredAttempts.length === 0 ? (
//           <p className="text-slate-500 text-sm p-4">No matching attempts found.</p>
//         ) : (
//           filteredAttempts.map((attempt) => {
//             const isExpanded = !!expandedLogs[attempt.id];
//             let dtStr = attempt.created_at || attempt.updated_at;
//             if (dtStr && !dtStr.endsWith('Z') && !dtStr.includes('+')) {
//               dtStr += 'Z'; // Force UTC parsing if Supabase omitted the timezone
//             }
//             const formattedDate = dtStr ? new Date(dtStr).toLocaleString() : '';

//             const endToEndTime = (attempt.created_at && attempt.updated_at)
//               ? Math.max(0, Math.round((new Date(attempt.updated_at).getTime() - new Date(attempt.created_at).getTime()) / 1000))
//               : 0;
//             const formattedTotalTime = endToEndTime < 60
//               ? `${endToEndTime}s`
//               : `${Math.floor(endToEndTime / 60)}m ${endToEndTime % 60}s`;

//             return (
//               <div
//                 key={attempt.id}
//                 className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all"
//               >
//                 {/* Minimal Collapsed Header */}
//                 <div
//                   onClick={() => toggleLog(attempt.id)}
//                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
//                 >
//                   <div className="space-y-1.5">
//                     {/* Top Badges: SID & Direction */}
//                     <div className="flex items-center gap-2 flex-wrap text-xs">
//                       <span className="font-mono text-blue-600 font-medium">
//                        Attempt ID: {attempt.id}
//                       </span>
//                       <span className="bg-sky-50 text-sky-600 border border-sky-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
//                         <Phone className="w-3 h-3" />
//                         {attempt.direction || 'Outgoing'}
//                       </span>
//                     </div>

//                     {/* Numbers display */}
//                     <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
//                       <span className="text-blue-600 break-all flex items-center gap-2">
//                         {attempt.test_value ? attempt.test_value.split(':')[0] : 'N/A'}
//                         {attempt.test_value && attempt.test_value.includes(':') && (
//                           <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-md border border-amber-200 shadow-sm animate-pulse">
//                             Test code Guesses: {parseInt(attempt.test_value.split(':')[1], 10)} / 999
//                           </span>
//                         )}
//                       </span>
//                       <span className="text-slate-400 font-normal shrink-0">&rsaquo;</span>
//                       <span className="text-orange-500 break-all">
//                         {attempt.target_phone_number || attempt.to || 'N/A'}
//                       </span>
//                     </div>

//                     {/* Timestamp, Duration & Status */}
//                     <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
//                       {formattedDate && <span>{formattedDate}</span>}
//                       {attempt.duration && (
//                         <span className="flex items-center gap-1 text-orange-600 font-medium">
//                           <Clock className="w-3 h-3" />
//                           {attempt.duration}s
//                         </span>
//                       )}
//                       <span
//                         className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${attempt.status === 'completed'
//                           ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
//                           : attempt.status === 'failed'
//                             ? 'bg-rose-50 text-rose-600 border-rose-200'
//                             : 'bg-blue-50 text-blue-600 border-blue-200'
//                           }`}
//                       >
//                         ✓ {attempt.status ? attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1) : 'Completed'}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Expand Chevron Icon */}
//                   <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors">
//                     {isExpanded ? (
//                       <ChevronUp className="w-4 h-4" />
//                     ) : (
//                       <ChevronDown className="w-4 h-4" />
//                     )}
//                   </div>
//                 </div>

//                 {/* Expanded Section */}
//                 {isExpanded && (
//                   <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-6">
//                     {/* Call Details Grid */}
//                     <div>
//                       <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-3">
//                         <Phone className="w-3.5 h-3.5 text-blue-600" />
//                         Call Details
//                       </h4>
//                       <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-2">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                           <div>
//                             <span className="text-slate-500 font-medium">Attempt ID:</span>
//                             <span className="ml-2 font-mono text-slate-700 break-all">{attempt.id}</span>
//                           </div>
//                           <div>
//                             <span className="text-slate-500 font-medium">Twilio Call SID:</span>
//                             <span className="ml-2 font-mono text-slate-700 break-all">{attempt.call_sid || 'Pending'}</span>
//                           </div>
//                           <div>
//                             <span className="text-slate-500 font-medium">Direction:</span>
//                             <span className="ml-2 text-slate-700">{attempt.direction || 'Outgoing'}</span>
//                           </div>
//                           <div>
//                             <span className="text-slate-500 font-medium">Caller Line (From):</span>
//                             <span className="ml-2 text-slate-700">{attempt.phone_number || 'N/A'}</span>
//                           </div>
//                           <div>
//                             <span className="text-slate-500 font-medium">Test Value:</span>
//                             <span className="ml-2 text-slate-700 font-mono font-medium">
//                                 {attempt.test_value ? attempt.test_value.split(':')[0] : 'N/A'}
//                             </span>
//                           </div>
//                           {attempt.test_value && attempt.test_value.includes(':') && (
//                             <div>
//                               <span className="text-slate-500 font-medium">Current Test code:</span>
//                               <span className="ml-2 text-slate-700 font-mono font-medium">
//                                 {attempt.test_value.split(':')[1]}
//                               </span>
//                             </div>
//                           )}

//                           {attempt.target_test_code && (
//                             <div>
//                               <span className="text-slate-500 font-medium">Target Test code:</span>
//                               <span className="ml-2 text-indigo-700 font-mono font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 shadow-sm">
//                                 {attempt.target_test_code}
//                               </span>
//                             </div>
//                           )}

//                           {attempt.result_details?.winner && (
//                             <div>
//                               <span className="text-slate-500 font-medium">Correct Test code:</span>
//                               <span className="ml-2 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold font-mono shadow-sm">
//                                 {attempt.result_details.winner}
//                               </span>
//                             </div>
//                           )}
//                           <div>
//                             <span className="text-slate-500 font-medium">To:</span>
//                             <span className="ml-2 text-slate-700">{attempt.target_phone_number || attempt.to || 'N/A'}</span>
//                           </div>
//                           <div>
//                             <span className="text-slate-500 font-medium">Call Status:</span>
//                             <span className="ml-2 text-emerald-600 font-semibold">{attempt.status || 'Completed'}</span>
//                           </div>
//                           <div>
//                             <span className="text-slate-500 font-medium">Call Time:</span>
//                             <span className="ml-2 text-slate-700">{formattedDate}</span>
//                           </div>
//                           <div>
//                             <span className="text-slate-500 font-medium">Total Processing Time:</span>
//                             <span className="ml-2 text-slate-700 font-medium">{formattedTotalTime}</span>
//                           </div>
//                         </div>

//                         {/* Call Recording link if present */}
//                         {attempt.result_details?.recording_url && (
//                           <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
//                             <span className="text-slate-500 font-medium">Recording:</span>
//                             <a
//                               href={attempt.result_details.recording_url}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="text-blue-600 hover:underline font-semibold"
//                             >
//                               Listen to Recording 🎧
//                             </a>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Structured AI & User Discussion Section */}
//                     {attempt.result_details?.transcript && (
//                       <div>
//                         <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
//                           <FileText className="w-3.5 h-3.5 text-blue-600" />
//                           Transcription Text
//                         </h4>
//                         <div className="bg-white border border-slate-200 rounded-lg p-4">
//                           {renderDialogueTranscript(attempt.result_details.transcript, attempt.id)}
//                         </div>
//                       </div>
//                     )}

//                     {/* Developer Logs (optional raw logs) */}
//                     {attempt.logs && attempt.logs.length > 0 && (
//                       <div>
//                         <h4 className="text-xs font-bold text-slate-500 mb-1">
//                           Execution Logs
//                         </h4>
//                         <div className="bg-slate-900 text-slate-300 font-mono text-[11px] p-3 rounded-lg space-y-1 max-h-40 overflow-y-auto">
//                           {attempt.logs.map((log, index) => (
//                             <div key={index} className="whitespace-pre-wrap break-all">
//                               {log}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </section>
//   );
// }



import React, { useState } from 'react';
import { Terminal, RefreshCw, Search, ChevronDown, ChevronUp, Phone, Clock, FileText, X, PhoneCall } from 'lucide-react';

const SAMPLE_ATTEMPTS = [
  {
    id: 'a1024',
    direction: 'Outgoing',
    test_value: '4521:037',
    target_test_code: '4521',
    target_phone_number: '+1 (415) 555-0182',
    phone_number: '+1 (628) 555-0110',
    call_sid: 'CA8f2e1a9b3c4d5e6f7890abcd1234ef',
    status: 'completed',
    duration: 47,
    created_at: '2026-08-18T09:12:00Z',
    updated_at: '2026-08-18T09:12:47Z',
    result_details: {
      winner: '4521',
      recording_url: '#',
      transcript:
        'System: Welcome, please enter your four digit code.\nUser: Four five two one.\nSystem: Thank you, verifying now.\nSystem: Your code has been confirmed.',
    },
    logs: ['[09:12:01] dial initiated', '[09:12:09] call answered', '[09:12:47] call completed'],
  },
  {
    id: 'a1025',
    direction: 'Outgoing',
    test_value: '7788:512',
    target_phone_number: '+1 (312) 555-0199',
    phone_number: '+1 (628) 555-0110',
    call_sid: 'CA1122334455667788',
    status: 'active',
    created_at: '2026-08-18T09:20:00Z',
    updated_at: '2026-08-18T09:20:00Z',
    result_details: {},
    logs: ['[09:20:00] dial initiated', '[09:20:04] ringing'],
  },
  {
    id: 'a1026',
    direction: 'Incoming',
    test_value: '9001:999',
    target_phone_number: '+1 (212) 555-0143',
    phone_number: '+1 (628) 555-0110',
    call_sid: 'CA99887766554433221',
    status: 'failed',
    duration: 6,
    created_at: '2026-08-18T08:55:00Z',
    updated_at: '2026-08-18T08:55:06Z',
    result_details: {
      transcript: 'System: We were unable to reach a valid response.\nSystem: Ending call.',
    },
    logs: ['[08:55:00] dial initiated', '[08:55:06] no-answer'],
  },
];

export default function CallLogs({ attempts = SAMPLE_ATTEMPTS, fetchData = () => {} }) {
  const [expandedLogs, setExpandedLogs] = useState({});
  const [expandedTranscripts, setExpandedTranscripts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleLog = (id) => {
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTranscript = (id) => {
    setExpandedTranscripts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredAttempts = attempts.filter((attempt) => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed !== '') {
      return (
        attempt.id?.toString().toLowerCase().includes(trimmed) ||
        attempt.test_value?.toLowerCase().includes(trimmed) ||
        attempt.target_phone_number?.toLowerCase().includes(trimmed) ||
        attempt.direction?.toLowerCase().includes(trimmed) ||
        attempt.result_details?.transcript?.toLowerCase().includes(trimmed) ||
        (attempt.logs && attempt.logs.some((l) => l.toLowerCase().includes(trimmed)))
      );
    }

    if (statusFilter !== 'all' && attempt.status !== statusFilter) {
      return false;
    }

    if (timeFilter !== 'all') {
      const attemptDate = new Date(attempt.updated_at || attempt.created_at);
      const today = new Date();

      const isToday =
        attemptDate.getDate() === today.getDate() &&
        attemptDate.getMonth() === today.getMonth() &&
        attemptDate.getFullYear() === today.getFullYear();

      if (timeFilter === 'today' && !isToday) return false;

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const isYesterday =
        attemptDate.getDate() === yesterday.getDate() &&
        attemptDate.getMonth() === yesterday.getMonth() &&
        attemptDate.getFullYear() === yesterday.getFullYear();

      if (timeFilter === 'yesterday' && !isYesterday) return false;
    }

    return true;
  });

  const statusStyles = {
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    failed: 'bg-rose-50 text-rose-600 border-rose-200',
    active: 'bg-blue-50 text-blue-600 border-blue-200',
    retry: 'bg-amber-50 text-amber-600 border-amber-200',
  };

  const statusDot = {
    completed: 'bg-emerald-500',
    failed: 'bg-rose-500',
    active: 'bg-blue-500 animate-pulse',
    retry: 'bg-amber-500',
  };

  const renderDialogueTranscript = (transcriptText, attemptId) => {
    if (!transcriptText) return null;

    const lines = transcriptText.split('\n').map((line) => line.trim()).filter(Boolean);
    const isTranscriptExpanded = expandedTranscripts[attemptId];
    const visibleLines = isTranscriptExpanded ? lines : lines.slice(0, 10);

    return (
      <div className="space-y-1.5 sm:space-y-2 mt-2 bg-slate-50 p-2.5 sm:p-3 rounded-lg border border-slate-100">
        {visibleLines.map((line, index) => {
          const match = line.match(/^([^:]+):\s*(.*)$/i);

          if (match) {
            const speaker = match[1].trim();
            const text = match[2].trim();
            const isSystem = speaker.toLowerCase() === 'system' || speaker.toLowerCase() === 'user';

            return (
              <div key={index} className="text-[12.5px] sm:text-[13px] leading-relaxed">
                <p className={isSystem ? 'text-blue-700' : 'text-slate-700'}>
                  <span className={`font-bold ${isSystem ? 'text-blue-900' : 'text-slate-900'}`}>
                    {speaker}:{' '}
                  </span>
                  {text}
                </p>
              </div>
            );
          }

          return (
            <div key={index} className="text-[12.5px] sm:text-[13px] leading-relaxed">
              <p className="text-slate-600 italic">{line}</p>
            </div>
          );
        })}

        {lines.length > 10 && (
          <button
            onClick={() => toggleTranscript(attemptId)}
            className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold block mt-2 sm:mt-3"
          >
            {isTranscriptExpanded ? 'See less ▲' : `See more (${lines.length - 10} lines) ▼`}
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 shadow-sm flex-1 flex flex-col font-sans">
      {/* Title Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-800 min-w-0">
          <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 text-white shrink-0">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
          <span className="truncate">Call Logs &amp; Transcripts</span>
          <span className="hidden xs:inline-flex text-[11px] sm:text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold shrink-0">
            {filteredAttempts.length}
          </span>
        </h2>
        <button
          onClick={handleRefresh}
          className="p-2 sm:p-2.5 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 transition-colors shadow-sm shrink-0"
          title="Refresh Logs"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_auto] gap-2.5 sm:gap-3 mb-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search logs or attempts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm transition-shadow"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="retry">Retry</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setTimeFilter('all');
            setStatusFilter('all');
          }}
          className="bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          Reset
        </button>
      </div>

      {/* Logs View List */}
      <div className="space-y-2.5 sm:space-y-3 overflow-y-auto max-h-[70vh] sm:max-h-[600px] flex-1 pr-0.5 sm:pr-1 -mr-0.5 sm:-mr-1">
        {filteredAttempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-14 px-4">
            <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center mb-3">
              <PhoneCall className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium">No matching attempts found</p>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredAttempts.map((attempt) => {
            const isExpanded = !!expandedLogs[attempt.id];
            let dtStr = attempt.created_at || attempt.updated_at;
            if (dtStr && !dtStr.endsWith('Z') && !dtStr.includes('+')) {
              dtStr += 'Z';
            }
            const formattedDate = dtStr ? new Date(dtStr).toLocaleString() : '';

            const endToEndTime =
              attempt.created_at && attempt.updated_at
                ? Math.max(0, Math.round((new Date(attempt.updated_at).getTime() - new Date(attempt.created_at).getTime()) / 1000))
                : 0;
            const formattedTotalTime =
              endToEndTime < 60 ? `${endToEndTime}s` : `${Math.floor(endToEndTime / 60)}m ${endToEndTime % 60}s`;

            const status = attempt.status || 'completed';

            return (
              <div
                key={attempt.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-shadow"
              >
                {/* Collapsed Header */}
                <button
                  onClick={() => toggleLog(attempt.id)}
                  className="w-full text-left p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 active:bg-slate-100/80 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Top Badges: SID & Direction */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono text-blue-600 font-medium truncate max-w-[140px] sm:max-w-none">
                        #{attempt.id}
                      </span>
                      <span className="bg-sky-50 text-sky-600 border border-sky-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1 shrink-0">
                        <Phone className="w-3 h-3" />
                        {attempt.direction || 'Outgoing'}
                      </span>
                    </div>

                    {/* Numbers display */}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-sm font-semibold flex-wrap">
                      <span className="text-blue-600 break-all flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        {attempt.test_value ? attempt.test_value.split(':')[0] : 'N/A'}
                        {attempt.test_value && attempt.test_value.includes(':') && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md border border-amber-200 shadow-sm">
                            {parseInt(attempt.test_value.split(':')[1], 10)}/999
                          </span>
                        )}
                      </span>
                      <span className="text-slate-400 font-normal shrink-0">&rsaquo;</span>
                      <span className="text-orange-500 break-all">
                        {attempt.target_phone_number || attempt.to || 'N/A'}
                      </span>
                    </div>

                    {/* Timestamp, Duration & Status */}
                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-500 flex-wrap">
                      {formattedDate && <span className="truncate">{formattedDate}</span>}
                      {attempt.duration != null && (
                        <span className="flex items-center gap-1 text-orange-600 font-medium shrink-0">
                          <Clock className="w-3 h-3" />
                          {attempt.duration}s
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border shrink-0 ${
                          statusStyles[status] || statusStyles.active
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status] || statusDot.active}`} />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Expand Chevron Icon */}
                  <div className="p-1.5 sm:p-1.5 bg-sky-50 text-sky-600 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-3.5 sm:p-5 space-y-4 sm:space-y-6">
                    {/* Call Details Grid */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2.5 sm:mb-3">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        Call Details
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          <div className="min-w-0">
                            <span className="text-slate-500 font-medium">Attempt ID:</span>
                            <span className="ml-2 font-mono text-slate-700 break-all">{attempt.id}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-slate-500 font-medium">Twilio Call SID:</span>
                            <span className="ml-2 font-mono text-slate-700 break-all">{attempt.call_sid || 'Pending'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Direction:</span>
                            <span className="ml-2 text-slate-700">{attempt.direction || 'Outgoing'}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-slate-500 font-medium">Caller Line (From):</span>
                            <span className="ml-2 text-slate-700 break-all">{attempt.phone_number || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Test Value:</span>
                            <span className="ml-2 text-slate-700 font-mono font-medium">
                              {attempt.test_value ? attempt.test_value.split(':')[0] : 'N/A'}
                            </span>
                          </div>
                          {attempt.test_value && attempt.test_value.includes(':') && (
                            <div>
                              <span className="text-slate-500 font-medium">Current Test code:</span>
                              <span className="ml-2 text-slate-700 font-mono font-medium">
                                {attempt.test_value.split(':')[1]}
                              </span>
                            </div>
                          )}

                          {attempt.target_test_code && (
                            <div>
                              <span className="text-slate-500 font-medium">Target Test code:</span>
                              <span className="ml-2 text-indigo-700 font-mono font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 shadow-sm">
                                {attempt.target_test_code}
                              </span>
                            </div>
                          )}

                          {attempt.result_details?.winner && (
                            <div>
                              <span className="text-slate-500 font-medium">Correct Test code:</span>
                              <span className="ml-2 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold font-mono shadow-sm">
                                {attempt.result_details.winner}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-slate-500 font-medium">To:</span>
                            <span className="ml-2 text-slate-700 break-all">{attempt.target_phone_number || attempt.to || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Call Status:</span>
                            <span className="ml-2 text-emerald-600 font-semibold">{attempt.status || 'Completed'}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-slate-500 font-medium">Call Time:</span>
                            <span className="ml-2 text-slate-700">{formattedDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Total Processing Time:</span>
                            <span className="ml-2 text-slate-700 font-medium">{formattedTotalTime}</span>
                          </div>
                        </div>

                        {attempt.result_details?.recording_url && (
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                            <span className="text-slate-500 font-medium">Recording:</span>
                            <a
                              href={attempt.result_details.recording_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              Listen to recording 🎧
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transcript Section */}
                    {attempt.result_details?.transcript && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          Transcription Text
                        </h4>
                        <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4">
                          {renderDialogueTranscript(attempt.result_details.transcript, attempt.id)}
                        </div>
                      </div>
                    )}

                    {/* Developer Logs */}
                    {attempt.logs && attempt.logs.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 mb-1.5">Execution Logs</h4>
                        <div className="bg-slate-900 text-slate-300 font-mono text-[10.5px] sm:text-[11px] p-2.5 sm:p-3 rounded-lg space-y-1 max-h-40 overflow-y-auto">
                          {attempt.logs.map((log, index) => (
                            <div key={index} className="whitespace-pre-wrap break-all">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}