
import React from 'react';

const MOCK_SAVED = [
  { id: 1, from: 'Luca', text: 'Meet me at the pride march at 11am! 🌈', time: 'Oct 12' },
  { id: 2, from: 'System', text: 'Welcome to Speqtrum Gold! 🌟', time: 'Oct 05' },
  { id: 3, from: 'Nico', text: 'Check out this new community tribe...', time: 'Sep 28' },
];

const SavedMessagesPage: React.FC<{onBack: () => void}> = ({ onBack }) => {
  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      <header className="p-8 border-b border-white/10 shrink-0">
        <h1 className="text-3xl font-black">Saved Messages</h1>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Your Personal Archive</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="bg-purple-600/10 border border-purple-500/20 p-6 rounded-[2.5rem] flex items-center space-x-4">
           <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-xl">
              <i className="fa-solid fa-cloud"></i>
           </div>
           <div>
              <p className="font-black text-xs uppercase tracking-widest">Speqtrum Cloud</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">All saved items are end-to-end encrypted</p>
           </div>
        </div>

        <div className="space-y-4">
          {MOCK_SAVED.map(msg => (
            <div key={msg.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">From: {msg.from}</span>
                <span className="text-[9px] text-gray-600 uppercase font-bold">{msg.time}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic">"{msg.text}"</p>
              <button className="absolute bottom-4 right-4 text-[10px] font-black text-red-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase">Unsave</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedMessagesPage;
