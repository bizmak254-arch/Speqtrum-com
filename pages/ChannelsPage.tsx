
import React from 'react';

const MOCK_CHANNELS = [
  { id: 'ch1', name: 'Speqtrum News', subs: '124k', icon: 'fa-bullhorn', color: 'bg-purple-600' },
  { id: 'ch2', name: 'Queer Art Daily', subs: '45k', icon: 'fa-palette', color: 'bg-pink-600' },
  { id: 'ch3', name: 'Travel Safe Hub', subs: '82k', icon: 'fa-plane-shield', color: 'bg-blue-600' },
];

const ChannelsPage: React.FC<{onBack: () => void}> = ({ onBack }) => {
  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      <header className="p-8 border-b border-white/10 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black">Channels</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Global Broadcasts</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Start Channel</button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Recommended</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_CHANNELS.map(ch => (
            <div key={ch.id} className="bg-zinc-900 border border-white/5 rounded-[2rem] p-6 hover:border-purple-500/50 transition-all cursor-pointer group">
              <div className={`w-14 h-14 ${ch.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${ch.icon}`}></i>
              </div>
              <h4 className="font-black text-lg mb-1">{ch.name}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ch.subs} Subscribers</p>
              <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Follow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelsPage;
