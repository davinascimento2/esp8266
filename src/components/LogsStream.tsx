import React, { useState } from 'react';
import { AccessLog } from '../types';
import { Download, Search } from 'lucide-react';

interface LogsStreamProps {
  logs: AccessLog[];
}

export const LogsStream: React.FC<LogsStreamProps> = ({ logs }) => {
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(l =>
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.tagUid.toLowerCase().includes(search.toLowerCase()) ||
    l.accessResult.toLowerCase().includes(search.toLowerCase())
  );

  const exportLogsCsv = () => {
    let csv = "ID,Timestamp,TagUID,UserName,AccessResult,RelayPulseMs,SignalRSSI\n";
    logs.forEach(l => {
      csv += `"${l.id}","${l.timestamp}","${l.tagUid}","${l.userName}","${l.accessResult}",${l.doorRelayDurationMs},${l.signalRssi}\n`;
    });
    const dl = document.createElement('a');
    dl.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    dl.setAttribute('download', `nodeguard-access-logs-${Date.now()}.csv`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by name, UID, or status..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>

        <button
          onClick={exportLogsCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-800 font-mono text-[11px] text-zinc-400">
            <tr>
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">USER / CARDHOLDER</th>
              <th className="py-2.5 px-3">TAG UID</th>
              <th className="py-2.5 px-3">RESULT</th>
              <th className="py-2.5 px-3">RELAY ACTION</th>
              <th className="py-2.5 px-3">SIGNAL RSSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 font-mono">
            {filteredLogs.map((log) => {
              const isGranted = log.accessResult === 'GRANTED';
              const isRevoked = log.accessResult === 'DENIED_REVOKED';

              return (
                <tr key={log.id} className="hover:bg-zinc-900/30">
                  <td className="py-2.5 px-3 text-zinc-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-medium text-zinc-200">{log.userName}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{log.tagUid}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isGranted
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : isRevoked
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : 'bg-rose-950/80 text-rose-300 border-rose-800'
                    }`}>
                      {log.accessResult}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">
                    {log.doorRelayDurationMs > 0 ? `PULSE ${log.doorRelayDurationMs}ms` : 'NONE'}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500">{log.signalRssi} dBm</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center text-zinc-500 text-xs font-mono">
            No access logs found.
          </div>
        )}
      </div>
    </div>
  );
};
