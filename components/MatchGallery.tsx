
import React from 'react';

interface Match {
  id: string;
  name: string;
  avatar: string;
  isNew: boolean;
}

const MOCK_MATCHES: Match[] = [
  { id: 'm1', name: 'Zane', avatar: 'https://picsum.photos/seed/zane/100', isNew: true },
  { id: 'm2', name: 'Sasha', avatar: 'https://picsum.photos/seed/sasha/100', isNew: true },
  { id: 'm3', name: 'Kai', avatar: 'https://picsum.photos/seed/kai/100', isNew: true },
  { id: 'm4', name: 'Morgan', avatar: 'https://picsum.photos/seed/morgan/100', isNew: false },
];

const MatchGallery: React.FC = () => {
  return (
    <div className="py-4 border-b border-white/5 overflow-hidden">
      <h3 className="px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">New Matches</h3>
      <div className="flex space-x-4 overflow-x-auto px-6 no-scrollbar pb-2">
        {MOCK_MATCHES.map((match) => (
          <button key={match.id} className="flex flex-col items-center space-y-2 group shrink-0">
            <div className={`relative w-16 h-16 rounded-full p-0.5 ${match.isNew ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 animate-pulse' : 'bg-white/10'}`}>
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                <img src={match.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              {match.isNew && (
                <div className="absolute -bottom-1 -right-1 bg-red-500 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
                  <span className="text-[8px] font-black">!</span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors">{match.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MatchGallery;
