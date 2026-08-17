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






import React, { useState } from 'react';
import { Terminal, RefreshCw, Search, ChevronDown, ChevronUp, Phone, Clock, FileText } from 'lucide-react';

export default function CallLogs({ attempts = [], fetchData }) {
  const [expandedLogs, setExpandedLogs] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const toggleLog = (id) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredAttempts = attempts.filter((attempt) => {
    // 1. Search term matching
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

    // 2. Status matching
    if (statusFilter !== 'all' && attempt.status !== statusFilter) {
      return false;
    }

    // 3. Time matching
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

  const renderDialogueTranscript = (transcriptText) => {
    if (!transcriptText) return null;

    // Splits lines by literal newlines
    const lines = transcriptText.split('\n').map(line => line.trim()).filter(Boolean);

    return (
      <div className="space-y-2 mt-2 bg-slate-50 p-3 rounded border border-slate-100">
        {lines.map((line, index) => {
          // Extract speaker if in format "Speaker: message"
          const match = line.match(/^([^:]+):\s*(.*)$/i);
          
          if (match) {
            const speaker = match[1].trim();
            const text = match[2].trim();
            
            // Color 'System' or 'User' slightly differently than the IVR
            const isSystem = speaker.toLowerCase() === 'system' || speaker.toLowerCase() === 'user';
            
            return (
              <div key={index} className="text-[13px] leading-relaxed mb-1.5">
                <p className={isSystem ? "text-blue-700" : "text-slate-700"}>
                  <span className={`font-bold ${isSystem ? "text-blue-900" : "text-slate-900"}`}>
                    {speaker}:{' '}
                  </span>
                  {text}
                </p>
              </div>
            );
          }

          // Fallback line rendering
          return (
            <div key={index} className="text-[13px] leading-relaxed mb-1.5">
              <p className="text-slate-600 italic">{line}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col font-sans">
      {/* Title Header */}
      <h2 className="text-lg font-bold mb-4 flex items-center justify-between text-slate-800">
        <span className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-600" /> Call Log's & Transcription
          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
            {filteredAttempts.length} found
          </span>
        </span>
        <button
          onClick={fetchData}
          className="p-1.5 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 transition-colors shadow-sm"
          title="Refresh Logs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </h2>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs or attempts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
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
          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors shadow-sm"
        >
          Reset Filters
        </button>
      </div>

      {/* Logs View List */}
      <div className="space-y-3 overflow-y-auto max-h-[600px] flex-1 pr-1">
        {filteredAttempts.length === 0 ? (
          <p className="text-slate-500 text-sm p-4">No matching attempts found.</p>
        ) : (
          filteredAttempts.map((attempt) => {
            const isExpanded = !!expandedLogs[attempt.id];
            let dtStr = attempt.created_at || attempt.updated_at;
            if (dtStr && !dtStr.endsWith('Z') && !dtStr.includes('+')) {
              dtStr += 'Z'; // Force UTC parsing if Supabase omitted the timezone
            }
            const formattedDate = dtStr ? new Date(dtStr).toLocaleString() : '';

            const endToEndTime = (attempt.created_at && attempt.updated_at)
              ? Math.max(0, Math.round((new Date(attempt.updated_at).getTime() - new Date(attempt.created_at).getTime()) / 1000))
              : 0;
            const formattedTotalTime = endToEndTime < 60
              ? `${endToEndTime}s`
              : `${Math.floor(endToEndTime / 60)}m ${endToEndTime % 60}s`;

            return (
              <div
                key={attempt.id}
                className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all"
              >
                {/* Minimal Collapsed Header */}
                <div
                  onClick={() => toggleLog(attempt.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <div className="space-y-1.5">
                    {/* Top Badges: SID & Direction */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono text-blue-600 font-medium">
                       Attempt ID: {attempt.id}
                      </span>
                      <span className="bg-sky-50 text-sky-600 border border-sky-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {attempt.direction || 'Outgoing'}
                      </span>
                    </div>

                    {/* Numbers display */}
                    <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
                      <span className="text-blue-600 break-all flex items-center gap-2">
                        {attempt.test_value ? attempt.test_value.split(':')[0] : 'N/A'}
                        {attempt.test_value && attempt.test_value.includes(':') && (
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-md border border-amber-200 shadow-sm animate-pulse">
                            CVV Guesses: {parseInt(attempt.test_value.split(':')[1], 10)} / 999
                          </span>
                        )}
                      </span>
                      <span className="text-slate-400 font-normal shrink-0">&rsaquo;</span>
                      <span className="text-orange-500 break-all">
                        {attempt.target_phone_number || attempt.to || 'N/A'}
                      </span>
                    </div>

                    {/* Timestamp, Duration & Status */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      {formattedDate && <span>{formattedDate}</span>}
                      {attempt.duration && (
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                          <Clock className="w-3 h-3" />
                          {attempt.duration}s
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${attempt.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : attempt.status === 'failed'
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : 'bg-blue-50 text-blue-600 border-blue-200'
                          }`}
                      >
                        ✓ {attempt.status ? attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1) : 'Completed'}
                      </span>
                    </div>
                  </div>

                  {/* Expand Chevron Icon */}
                  <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-6">
                    {/* Call Details Grid */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-3">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        Call Details
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500 font-medium">Attempt ID:</span>
                            <span className="ml-2 font-mono text-slate-700 break-all">{attempt.id}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Twilio Call SID:</span>
                            <span className="ml-2 font-mono text-slate-700 break-all">{attempt.call_sid || 'Pending'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Direction:</span>
                            <span className="ml-2 text-slate-700">{attempt.direction || 'Outgoing'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Caller Line (From):</span>
                            <span className="ml-2 text-slate-700">{attempt.phone_number || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Test Value:</span>
                            <span className="ml-2 text-slate-700 font-mono font-medium">
                                {attempt.test_value ? attempt.test_value.split(':')[0] : 'N/A'}
                            </span>
                          </div>
                          {attempt.test_value && attempt.test_value.includes(':') && (
                            <div>
                              <span className="text-slate-500 font-medium">Current CVV:</span>
                              <span className="ml-2 text-slate-700 font-mono font-medium">
                                {attempt.test_value.split(':')[1]}
                              </span>
                            </div>
                          )}
                          {attempt.target_cvv && (
                            <div>
                              <span className="text-slate-500 font-medium">Target CVV (Auto-Gen):</span>
                              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-300 font-bold font-mono shadow-sm">
                                {attempt.target_cvv}
                              </span>
                            </div>
                          )}
                          {attempt.result_details?.winner && (
                            <div>
                              <span className="text-slate-500 font-medium">Discovered OTP/CVV:</span>
                              <span className="ml-2 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold font-mono shadow-sm">
                                {attempt.result_details.winner}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-500 font-medium">To:</span>
                            <span className="ml-2 text-slate-700">{attempt.target_phone_number || attempt.to || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Call Status:</span>
                            <span className="ml-2 text-emerald-600 font-semibold">{attempt.status || 'Completed'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Call Time:</span>
                            <span className="ml-2 text-slate-700">{formattedDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Total Processing Time:</span>
                            <span className="ml-2 text-slate-700 font-medium">{formattedTotalTime}</span>
                          </div>
                        </div>

                        {/* Call Recording link if present */}
                        {attempt.result_details?.recording_url && (
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Recording:</span>
                            <a
                              href={attempt.result_details.recording_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              Listen to Recording 🎧
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Structured AI & User Discussion Section */}
                    {attempt.result_details?.transcript && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          Transcription Text
                        </h4>
                        <div className="bg-white border border-slate-200 rounded-lg p-4">
                          {renderDialogueTranscript(attempt.result_details.transcript)}
                        </div>
                      </div>
                    )}

                    {/* Developer Logs (optional raw logs) */}
                    {attempt.logs && attempt.logs.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 mb-1">
                          Execution Logs
                        </h4>
                        <div className="bg-slate-900 text-slate-300 font-mono text-[11px] p-3 rounded-lg space-y-1 max-h-40 overflow-y-auto">
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