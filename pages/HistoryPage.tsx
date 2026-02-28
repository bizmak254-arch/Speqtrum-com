
import React from 'react';

const MOCK_HISTORY = [
  { id: 1, action: 'Login Detected', device: 'Chrome / MacOS', time: '10:45 AM', ip: '192.168.1.1' },
  { id: 2, action: 'Profile Update', device: 'iOS App', time: 'Yesterday', ip: '192.168.1.4' },
  { id: 3, action: 'New Tribe Created', device: 'Chrome / Windows', time: 'Oct 10, 2:15 PM', ip: '192.168.0.12' },
];

const HistoryPage: React.FC<{onBack: () => void}> = ({ onBack }) => {
  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      <header className="p-8 border-b border-white/10 shrink-0">
        <h1 className="text-3xl font-black">History</h1>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Activity Audit Log</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {MOCK_HISTORY.map(log => (
          <div key={log.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-black text-sm uppercase text-purple-400">{log.action}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{log.device} • {log.ip}</p>
            </div>
            <span className="text-[9px] text-gray-600 font-bold uppercase">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
