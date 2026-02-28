
import React, { useState } from 'react';

interface SafetyPanelProps {
  onPanic?: () => void;
}

const SafetyPanel: React.FC<SafetyPanelProps> = ({ onPanic }) => {
  const [isLockdownActive, setIsLockdownActive] = useState(false);

  const handleToggleLockdown = () => {
    const newState = !isLockdownActive;
    setIsLockdownActive(newState);
    if (newState && onPanic) {
      onPanic();
    }
  };

  return (
    <div className="space-y-8">
      {/* Subtle Safety Toggle (Killer Switch) */}
      <section className="bg-zinc-950/50 border border-white/5 p-4 rounded-3xl">
        <div className="flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Privacy Link</p>
              <p className="text-[8px] text-gray-800 uppercase font-bold">Secure Session Protection</p>
           </div>
           <button 
              onClick={handleToggleLockdown}
              className={`w-10 h-5 rounded-full relative transition-all duration-500 ${isLockdownActive ? 'bg-red-500/50' : 'bg-white/5 border border-white/10'}`}
           >
              <div className={`absolute top-0.5 w-3.5 h-3.5 bg-gray-500 rounded-full transition-all duration-500 ${isLockdownActive ? 'left-6 shadow-lg shadow-red-500/50 bg-white' : 'left-0.5'}`}></div>
           </button>
        </div>
      </section>

      {/* Identity Score */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-xs font-black text-gray-400 mb-3 flex items-center">
          <i className="fa-solid fa-shield-check text-blue-500/50 mr-2"></i>
          Trust Level
        </h3>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-green-500"></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold">
          <span className="text-gray-600 uppercase tracking-widest">Verified</span>
          <span className="text-blue-500/70">85% Security</span>
        </div>
      </section>

      {/* Badges Display */}
      <section>
        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Achievements</h3>
        <div className="grid grid-cols-4 gap-2">
           {[
             { id: 1, icon: 'fa-certificate', color: 'text-blue-500/50', name: 'Verified' },
             { id: 2, icon: 'fa-bolt', color: 'text-yellow-500/50', name: 'Pioneer' },
             { id: 3, icon: 'fa-shield-heart', color: 'text-pink-500/50', name: 'Safe Ally' },
             { id: 4, icon: 'fa-fire', color: 'text-orange-500/50', name: 'Creator' }
           ].map(badge => (
             <div key={badge.id} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center group relative cursor-help border border-white/5 hover:border-white/10 transition-all">
                <i className={`fa-solid ${badge.icon} ${badge.color}`}></i>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-bold uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                   {badge.name}
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default SafetyPanel;
