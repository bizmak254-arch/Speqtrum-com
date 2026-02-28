
import React from 'react';

const TIPS = [
  { id: 1, title: 'Safe First Dates', text: 'Always meet in public, community-vetted spaces. Use Safe Passage to find a location.', category: 'Safety' },
  { id: 2, title: 'Bio Authenticity', text: 'Profiles with clear, authentic interests receive 40% more connections.', category: 'Companionship' },
  { id: 3, title: 'Icebreakers', text: 'Asking about a specific interest in someone’s bio is the best way to start.', category: 'Social' },
];

const TipsPage: React.FC<{onBack: () => void}> = ({ onBack }) => {
  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      <header className="p-8 border-b border-white/10 shrink-0">
        <h1 className="text-3xl font-black">Tips & Advice</h1>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Community Wisdom</p>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        {TIPS.map(tip => (
          <div key={tip.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-4 relative group hover:border-purple-500/50 transition-all">
             <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${tip.category === 'Safety' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{tip.category}</span>
                <i className="fa-solid fa-lightbulb text-purple-400 opacity-50"></i>
             </div>
             <h3 className="text-xl font-black">{tip.title}</h3>
             <p className="text-sm text-gray-400 leading-relaxed italic">"{tip.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsPage;
