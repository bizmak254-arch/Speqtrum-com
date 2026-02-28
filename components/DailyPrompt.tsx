
import React, { useState } from 'react';

const DailyPrompt: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLevelUp = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-sm aspect-[3/4] bg-zinc-900 rounded-[2.5rem] border border-yellow-500/30 p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-black text-3xl shadow-xl shadow-yellow-500/20 mb-4">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <h2 className="text-2xl font-black text-yellow-500">LEVEL UP!</h2>
        <p className="text-gray-400 text-sm italic">"Your answer has been added to your profile. You've earned +50 Engagement Points!"</p>
        <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <i className="fa-solid fa-trophy text-yellow-500 text-xs"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">New Badge: Daily Spark</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm aspect-[3/4] bg-gradient-to-br from-indigo-900 via-zinc-900 to-black rounded-[2.5rem] border border-white/10 p-8 relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
      
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
           <span className="bg-white/10 text-[10px] px-3 py-1 rounded-full border border-white/10 font-black uppercase tracking-widest text-indigo-400">Daily Challenge</span>
           <span className="text-[10px] text-gray-500 font-bold">Expires in 12h</span>
        </div>

        <h2 className="text-3xl font-black mb-6 leading-tight">What's your secret <span className="rainbow-text">Superpower</span> in a relationship?</h2>
        
        <p className="text-gray-400 text-sm mb-8">Answer today's prompt to unlock exclusive connection badges and increase your profile visibility.</p>

        <textarea 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="I'm a world-class listener..."
          className="flex-1 w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none resize-none transition-colors mb-6"
        />

        <button 
          onClick={handleLevelUp}
          disabled={!answer.trim()}
          className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
        >
          SUBMIT & EARN
        </button>
      </div>
    </div>
  );
};

export default DailyPrompt;
