import React, { useState } from 'react';
import { Phone, Edit2, Trash2, Check, X } from 'lucide-react';

export default function PhoneLinePool({ lines, handleDeleteLine, handleUpdateLine }) {
  const [editingLineId, setEditingLineId] = useState(null);
  const [editNumber, setEditNumber] = useState('');

  const startEditing = (line) => {
    setEditingLineId(line.id);
    setEditNumber(line.phone_number);
  };

  const cancelEditing = () => {
    setEditingLineId(null);
    setEditNumber('');
  };

  const saveEdit = (lineId) => {
    handleUpdateLine(lineId, editNumber);
    setEditingLineId(null);
    setEditNumber('');
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
        <Phone className="w-5 h-5" /> Phone Line Pool
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lines.length === 0 ? (
          <p className="text-slate-500 text-sm col-span-2">No phone lines configured yet.</p>
        ) : (
          lines.map(line => {
            const isEditing = editingLineId === line.id;
            return (
              <div key={line.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center gap-2 min-h-[76px]">
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editNumber}
                      onChange={(e) => setEditNumber(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 flex-1 font-semibold"
                    />
                    <button
                      onClick={() => saveEdit(line.id)}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg text-white transition-colors"
                      title="Save Number"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 rounded-lg text-slate-400 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-bold text-slate-300">{line.phone_number}</p>
                      <p className="text-xs text-slate-500">Processed: {line.attempts_processed} attempts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        line.status === 'busy' 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {line.status.toUpperCase()}
                      </span>
                      
                      {/* Actions - Only visible and active when phone line is idle */}
                      {line.status === 'idle' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(line)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 rounded-lg text-slate-300 transition-colors"
                            title="Edit Phone Number"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLine(line.id)}
                            className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 active:bg-rose-950 rounded-lg text-rose-400 transition-colors border border-rose-900/30"
                            title="Delete Phone Line"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
