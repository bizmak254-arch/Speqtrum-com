
import React, { useState } from 'react';
import Discovery from '../components/Discovery';

interface DiscoveryPageProps {
  onLike?: (profile: any) => void;
}

const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ onLike }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');

  const MOCK_GRID_PROFILES = [
    { id: 'g1', name: 'Zane', age: 26, vibe: 98, avatar: 'https://picsum.photos/seed/zane/300', isVerified: true },
    { id: 'g2', name: 'Sasha', age: 24, vibe: 84, avatar: 'https://picsum.photos/seed/sasha/300', isVerified: false },
    { id: 'g3', name: 'Nico', age: 27, vibe: 72, avatar: 'https://picsum.photos/seed/nico/300', isVerified: true },
    { id: 'g4', name: 'Luca', age: 23, vibe: 65, avatar: 'https://picsum.photos/seed/luca/300', isVerified: false },
    { id: 'g5', name: 'Jordan', age: 25, vibe: 91, avatar: 'https://picsum.photos/seed/jordan/300', isVerified: true },
    { id: 'g6', name: 'Taylor', age: 31, vibe: 88, avatar: 'https://picsum.photos/seed/taylor/300', isVerified: false },
  ];

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Desktop Filters Bar */}
      <div className="p-4 sm:px-8 border-b border-white/5 bg-black/50 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
         <div className="flex flex-wrap items-center gap-3">
            {['Age', 'Distance', 'Identity', 'Interests', 'Online'].map(filter => (
               <button key={filter} className="px-4 py-2 bg-transparent border border-orange-500/30 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-colors">
                  {filter} <i className="fa-solid fa-chevron-down ml-2 text-[8px]"></i>
               </button>
            ))}
            <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-300">Reset</button>
         </div>
         <div className="flex bg-white/5 p-1 rounded-xl">
            <button onClick={() => setViewMode('grid')} className={`p-2 w-10 h-10 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}><i className="fa-solid fa-table-cells"></i></button>
            <button onClick={() => setViewMode('swipe')} className={`p-2 w-10 h-10 rounded-lg transition-all ${viewMode === 'swipe' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}><i className="fa-solid fa-arrows-left-right"></i></button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-8 pb-24">
        {viewMode === 'swipe' ? (
           <Discovery />
        ) : (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {MOCK_GRID_PROFILES.map(p => (
                 <div key={p.id} className="group bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden relative aspect-[3/4] hover:border-purple-500/50 transition-all cursor-pointer">
                    <img src={p.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                       <span className="text-[10px] font-black text-green-400">{p.vibe}% Vibe</span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                       <div>
                          <h3 className="text-xl font-black">{p.name}, {p.age}</h3>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">2 miles away</p>
                       </div>
                       
                       <div className="flex items-center justify-between pt-2">
                          <button className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-xmark"></i></button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); if(onLike) onLike(p); }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                          >
                            <i className="fa-solid fa-heart"></i>
                          </button>
                          <button className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"><i className="fa-solid fa-eye"></i></button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryPage;
