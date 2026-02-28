
import React from 'react';

const MOCK_CALLS = [
  { id: 1, name: 'Luca', type: 'video', status: 'missed', time: '10:45 AM', avatar: 'https://picsum.photos/seed/luca/100' },
  { id: 2, name: 'Skyler', type: 'voice', status: 'received', time: 'Yesterday', avatar: 'https://picsum.photos/seed/skyler/100' },
  { id: 3, name: 'Nico', type: 'video', status: 'outgoing', time: 'Mon, 8:12 PM', avatar: 'https://picsum.photos/seed/nico/100' },
];

const CallsPage: React.FC<{onBack: () => void}> = ({ onBack }) => {
  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      <header className="p-8 border-b border-white/10 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black">Calls</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Recent Interactions</p>
        </div>
        <button className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-xl">
           <i className="fa-solid fa-phone-plus"></i>
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {MOCK_CALLS.map(call => (
          <div key={call.id} className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
              <img src={call.avatar} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold text-sm">{call.name}</p>
                <div className="flex items-center space-x-2 text-[10px]">
                   <i className={`fa-solid ${call.status === 'missed' ? 'fa-phone-slash text-red-500' : 'fa-phone text-green-500'}`}></i>
                   <span className="text-gray-500 font-bold uppercase tracking-tighter">{call.status} • {call.time}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
               <button className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                 <i className={`fa-solid ${call.type === 'video' ? 'fa-video' : 'fa-phone'}`}></i>
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallsPage;
