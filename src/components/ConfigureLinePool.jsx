import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function ConfigureLinePool({
  handleAddLine,
  newLineNumber,
  setNewLineNumber,
  addingLine
}) {
  return (
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
  );
}
