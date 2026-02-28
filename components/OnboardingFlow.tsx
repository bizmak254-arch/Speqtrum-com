import React, { useState } from 'react';
import { ModuleType } from '../types';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [modules, setModules] = useState<ModuleType[]>(['social']);
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    messagesFromMatchesOnly: false,
    anonymousBrowsing: false
  });

  const toggleModule = (mod: ModuleType) => {
    if (modules.includes(mod)) {
      setModules(modules.filter(m => m !== mod));
    } else {
      setModules([...modules, mod]);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-[#121212] flex items-center justify-center p-4">
      <div className="max-w-[600px] w-full bg-[#1f1f1f] p-8 rounded-2xl shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
        
        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-white">Welcome</h1>
            <p className="text-gray-300 text-lg">This platform offers social connection, companionship, content creation, and live interaction.</p>
            <p className="text-gray-400">You control what you see and how you appear.</p>
            <button 
              onClick={() => setStep(2)}
              className="bg-[#ff4081] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e91e63] transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2: CHOOSE EXPERIENCE */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Experience</h2>
            <div className="space-y-3 mb-8">
              <div className="bg-[#2a2a2a] p-4 rounded-xl flex items-center gap-3 cursor-pointer" onClick={() => toggleModule('social')}>
                <input type="checkbox" checked={modules.includes('social')} readOnly className="w-5 h-5 rounded border-gray-500 bg-[#1e1e1e] text-[#ff4081] focus:ring-[#ff4081]" />
                <span className="text-white">Social & Communities</span>
              </div>
              <div className="bg-[#2a2a2a] p-4 rounded-xl flex items-center gap-3 cursor-pointer" onClick={() => toggleModule('dating')}>
                <input type="checkbox" checked={modules.includes('dating')} readOnly className="w-5 h-5 rounded border-gray-500 bg-[#1e1e1e] text-[#ff4081] focus:ring-[#ff4081]" />
                <span className="text-white">Open Connections (No Strings Attached)</span>
              </div>
              <div className="bg-[#2a2a2a] p-4 rounded-xl flex items-center gap-3 cursor-pointer" onClick={() => toggleModule('dating')}>
                <input type="checkbox" checked={modules.includes('dating')} readOnly className="w-5 h-5 rounded border-gray-500 bg-[#1e1e1e] text-[#ff4081] focus:ring-[#ff4081]" />
                <span className="text-white">LGBTQ+ Connections</span>
              </div>
              <div className="bg-[#2a2a2a] p-4 rounded-xl flex items-center gap-3 cursor-pointer" onClick={() => toggleModule('creator')}>
                <input type="checkbox" checked={modules.includes('creator')} readOnly className="w-5 h-5 rounded border-gray-500 bg-[#1e1e1e] text-[#ff4081] focus:ring-[#ff4081]" />
                <span className="text-white">Creator & Video Marketplace</span>
              </div>
              <div className="bg-[#2a2a2a] p-4 rounded-xl flex items-center gap-3 cursor-pointer" onClick={() => toggleModule('live')}>
                <input type="checkbox" checked={modules.includes('live')} readOnly className="w-5 h-5 rounded border-gray-500 bg-[#1e1e1e] text-[#ff4081] focus:ring-[#ff4081]" />
                <span className="text-white">Live Streaming</span>
              </div>
            </div>
            <button 
              onClick={() => setStep(3)}
              className="w-full bg-[#ff4081] text-white py-3 rounded-lg font-bold hover:bg-[#e91e63] transition-colors"
            >
              Save & Continue
            </button>
          </div>
        )}

        {/* STEP 3: PRIVACY */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Privacy Preferences</h2>
            <div className="space-y-4 mb-8">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={privacy.publicProfile} 
                  onChange={(e) => setPrivacy({...privacy, publicProfile: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-500 bg-[#1e1e1e] text-[#ff4081] focus:ring-[#ff4081]" 
                />
                <span className="text-white">Show profile publicly</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={privacy.messagesFromMatchesOnly} 
                  onChange={(e) => setPrivacy({...privacy, messagesFromMatchesOnly: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-500 bg-[#1e1e1e] text-[#ff4081] focus:ring-[#ff4081]" 
                />
                <span className="text-white">Allow messages from connections only</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={privacy.anonymousBrowsing} 
                  onChange={(e) => setPrivacy({...privacy, anonymousBrowsing: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-500 bg-[#1e1e1e] text-[#ff4081] focus:ring-[#ff4081]" 
                />
                <span className="text-white">Enable anonymous browsing</span>
              </label>
            </div>
            <button 
              onClick={() => onComplete({ activeModules: modules, privacy })}
              className="w-full bg-[#ff4081] text-white py-3 rounded-lg font-bold hover:bg-[#e91e63] transition-colors"
            >
              Finish Setup
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingFlow;
