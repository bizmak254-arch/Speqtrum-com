
import React from 'react';

interface MatchCelebrationProps {
  user: any;
  match: any;
  onClose: () => void;
  onStartChat: () => void;
}

const MatchCelebration: React.FC<MatchCelebrationProps> = ({ user, match, onClose, onStartChat }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative text-center px-6 max-w-md w-full">
        <h2 className="text-5xl font-black italic rainbow-text mb-2 tracking-tighter uppercase">You've Connected!</h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-12">You and {match.name} vibe with each other</p>
        
        <div className="flex items-center justify-center space-x-[-20px] mb-12">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl rotate-[-6deg] animate-in slide-in-from-left-8 duration-700">
            <img src={user.avatar} className="w-full h-full object-cover" />
          </div>
          <div className="z-10 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white border-4 border-black shadow-xl animate-bounce">
            <i className="fa-solid fa-heart text-2xl"></i>
          </div>
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl rotate-[6deg] animate-in slide-in-from-right-8 duration-700">
            <img src={match.img} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onStartChat}
            className="w-full bg-white text-black font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-xl flex items-center justify-center space-x-2"
          >
            <i className="fa-solid fa-comment"></i>
            <span>SEND A MESSAGE</span>
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-4 rounded-2xl hover:bg-yellow-500 hover:text-black transition-colors"
          >
            KEEP DISCOVERING
          </button>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">Icebreakers</span>
          <div className="flex flex-wrap justify-center gap-2">
            {["Hey, loved your video! 👋", "Your bio is amazing ✨", "Drinks this weekend? 🥂"].map(msg => (
              <button key={msg} className="text-[11px] bg-white/5 border border-white/5 px-3 py-1.5 rounded-full hover:border-purple-500 transition-colors text-gray-400">
                {msg}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCelebration;
