
import React, { useState } from 'react';

interface TourStep {
  id: string;
  title: string;
  desc: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: TourStep[] = [
  { id: 'welcome', title: 'Welcome to Speqtrum', desc: 'Your safe, inclusive home for LGBTQ+ connection starts here.', position: 'bottom' },
  { id: 'matches', title: 'AI Compatibility', desc: 'Our generative models analyze bio intent to find your perfect vibe connection.', position: 'bottom' },
  { id: 'panic', title: 'Safety First', desc: 'Hit Escape or the Shield icon anytime for instant session lockdown.', position: 'top' },
];

const TourGuide: React.FC = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('sp_tour_complete');
  });

  const handleNext = () => {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('sp_tour_complete', 'true');
  };

  if (!isVisible) return null;

  const currentStep = STEPS[stepIdx];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-purple-500/50 p-10 rounded-[3rem] max-w-sm w-full space-y-8 shadow-2xl relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl shadow-xl shadow-purple-500/20">
           <i className="fa-solid fa-sparkles"></i>
        </div>

        <div className="text-center space-y-3 pt-4">
           <h3 className="text-2xl font-black italic">{currentStep.title}</h3>
           <p className="text-gray-400 text-sm leading-relaxed">{currentStep.desc}</p>
        </div>

        <div className="flex items-center justify-between pt-4">
           <div className="flex space-x-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === stepIdx ? 'w-8 bg-purple-500' : 'w-2 bg-white/10'}`}></div>
              ))}
           </div>
           <button 
            onClick={handleNext}
            className="bg-white text-black font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
           >
             {stepIdx === STEPS.length - 1 ? 'Finish' : 'Next'}
           </button>
        </div>

        <button 
          onClick={handleComplete}
          className="w-full text-[10px] font-black uppercase text-gray-600 hover:text-gray-400 transition-colors"
        >
          Skip Introduction
        </button>
      </div>
    </div>
  );
};

export default TourGuide;
