
import React, { useState, useEffect } from 'react';
import { generateVideo } from '../services/videoService';
import { useAuth } from '../context/AuthContext';
import { VideoContent, CreatorStats } from '../types';

interface CreatorStudioProps {
  onPost: (video: VideoContent) => void;
  onBack?: () => void;
}

const CreatorStudio: React.FC<CreatorStudioProps> = ({ onPost, onBack }) => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<'generate' | 'earnings'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Dreaming up your vision...');
  const [config, setConfig] = useState<{ resolution: '720p' | '1080p', aspectRatio: '16:9' | '9:16' }>({
    resolution: '720p',
    aspectRatio: '9:16'
  });

  // Mock Earnings State
  const stats: CreatorStats = {
    totalEarnings: 842.50,
    totalViews: 12400,
    totalTips: 452,
    activeSubscribers: 128
  };

  const loadingMessages = [
    "Sculpting queer joy in high definition...",
    "Rendering vibrant spectrums...",
    "Finalizing the cinematic magic...",
    "Ensuring every pixel radiates pride..."
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const url = await generateVideo(prompt, config);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key configuration error. Please re-select your paid API key.");
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else {
        setError(err.message || "Something went wrong during generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = () => {
    if (!videoUrl || !currentUser) return;
    
    const newVideo: VideoContent = {
      id: `v-${Date.now()}`,
      userId: currentUser.id,
      displayName: currentUser.displayName,
      videoUrl: videoUrl,
      thumbnailUrl: 'https://picsum.photos/seed/generated/400/600',
      description: prompt,
      likes: 0,
      comments: 0,
      tips: 0,
      tags: ['AIGenerated', 'Veo3.1'],
      isAdult: true,
    };

    onPost(newVideo);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <div className="flex items-center justify-between">
        {onBack && (
          <button 
            onClick={onBack}
            className="group flex items-center space-x-2 text-gray-500 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Back Home</span>
          </button>
        )}
        
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
           <button 
            onClick={() => setActiveView('generate')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeView === 'generate' ? 'bg-white text-black shadow-xl' : 'text-yellow-500 hover:text-white hover:bg-yellow-500/20'}`}
           >
             Studio
           </button>
           <button 
            onClick={() => setActiveView('earnings')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeView === 'earnings' ? 'bg-white text-black shadow-xl' : 'text-yellow-500 hover:text-white hover:bg-yellow-500/20'}`}
           >
             Revenue
           </button>
        </div>
      </div>

      {activeView === 'generate' ? (
        <>
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-widest">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Veo 3.1 Synthesis Engine</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter italic">Creator Studio</h1>
              <p className="text-gray-500 text-sm max-w-md font-medium uppercase">High-end video generation for the community.</p>
            </div>
            
            <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl">
              <button 
                onClick={() => setConfig({...config, aspectRatio: '9:16'})}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${config.aspectRatio === '9:16' ? 'bg-white text-black' : 'text-yellow-500 hover:text-white'}`}
              >
                9:16
              </button>
              <button 
                onClick={() => setConfig({...config, aspectRatio: '16:9'})}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${config.aspectRatio === '16:9' ? 'bg-white text-black' : 'text-yellow-500 hover:text-white'}`}
              >
                16:9
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section className="space-y-8">
              <div className="bg-zinc-900 border border-white/10 p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent"></div>
                <div className="relative space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Narrative Prompt</label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A cinematic shot of a glowing neon heart floating in a dark cyberpunk lounge, 8k, bokeh background..."
                      className="w-full bg-black/60 border border-white/10 rounded-3xl p-6 h-48 focus:border-purple-500 outline-none resize-none transition-all text-gray-200 placeholder:text-gray-800 shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <p className="text-[9px] font-black text-gray-600 uppercase mb-2">Quality Tier</p>
                       <select 
                         value={config.resolution}
                         onChange={(e: any) => setConfig({...config, resolution: e.target.value})}
                         className="w-full bg-transparent text-xs font-black uppercase outline-none cursor-pointer text-white"
                       >
                         <option value="720p">720p HD</option>
                         <option value="1080p">1080p Ultra</option>
                       </select>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-600 uppercase">Status</p>
                          <p className="text-[10px] text-green-500 font-black uppercase">Ready</p>
                       </div>
                       <i className="fa-solid fa-bolt text-yellow-500 opacity-50"></i>
                    </div>
                  </div>

                  {error && (
                    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start space-x-3 text-red-400">
                      <i className="fa-solid fa-triangle-exclamation mt-1"></i>
                      <p className="text-xs font-black leading-relaxed">{error}</p>
                    </div>
                  )}

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-white text-black font-black py-5 rounded-3xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 uppercase text-xs tracking-widest"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Neural Rendering...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-clapperboard"></i>
                        <span>Begin Generation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] flex items-center space-x-8">
                 <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 text-2xl">
                    <i className="fa-solid fa-crown"></i>
                 </div>
                 <p className="text-xs text-gray-500 leading-relaxed font-medium uppercase tracking-tight">
                   Veo 3.1 Pro allows for up to 60s clips. Higher tier members receive priority in the rendering queue.
                 </p>
              </div>
            </section>

            <section className="relative">
              <div className={`aspect-[9/16] max-h-[75vh] w-full bg-zinc-900 rounded-[3.5rem] border-8 border-white/5 shadow-2xl overflow-hidden flex items-center justify-center relative ${config.aspectRatio === '16:9' ? 'aspect-video' : ''}`}>
                {videoUrl ? (
                  <video 
                    src={videoUrl} 
                    controls autoPlay loop 
                    className="w-full h-full object-cover animate-in fade-in duration-1000"
                  />
                ) : isGenerating ? (
                  <div className="text-center space-y-8 px-12">
                    <div className="relative w-28 h-28 mx-auto">
                       <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <i className="fa-solid fa-wand-sparkles text-3xl text-purple-400 animate-pulse"></i>
                       </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black italic">{loadingMessage}</h3>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Proprietary AI Engine</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6 text-gray-800">
                    <i className="fa-solid fa-video text-8xl"></i>
                    <p className="font-black text-sm uppercase tracking-[0.3em]">Studio Idle</p>
                  </div>
                )}
                
                <div className="absolute top-8 left-8 flex space-x-2">
                   <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/50">
                      Studio Preview
                   </div>
                </div>
              </div>

              {videoUrl && (
                <div className="mt-10 flex justify-center space-x-4">
                  <button 
                    onClick={handlePost}
                    className="px-10 py-4 bg-purple-600 text-white font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 uppercase text-xs tracking-widest"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Share to Spectrum</span>
                  </button>
                  <a 
                    href={videoUrl} 
                    download="speqtrum-ai.mp4"
                    className="px-10 py-4 bg-transparent border-2 border-yellow-500 text-yellow-500 font-black rounded-2xl hover:bg-yellow-500 hover:text-black transition-all flex items-center space-x-3 uppercase text-xs tracking-widest"
                  >
                    <i className="fa-solid fa-download"></i>
                    <span>Export</span>
                  </a>
                </div>
              )}
            </section>
          </div>
        </>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <header className="text-center space-y-4">
              <h1 className="text-5xl font-black tracking-tight italic">Creator Revenue</h1>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Monetize your content • Grow your brand</p>
           </header>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `$${stats.totalEarnings}`, icon: 'fa-wallet', color: 'text-green-400' },
                { label: 'Tips Received', value: stats.totalTips, icon: 'fa-coins', color: 'text-yellow-400' },
                { label: 'Total Impressions', value: '12.4k', icon: 'fa-eye', color: 'text-blue-400' },
                { label: 'Fanbase', value: stats.activeSubscribers, icon: 'fa-heart', color: 'text-pink-400' },
              ].map((s, i) => (
                <div key={i} className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-xl ${s.color}`}>
                      <i className={`fa-solid ${s.icon}`}></i>
                   </div>
                   <p className="text-3xl font-black italic">{s.value}</p>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-8">
                 <h3 className="text-xl font-black italic">Payout Management</h3>
                 <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <i className="fa-solid fa-building-columns text-gray-600 text-xl"></i>
                       <div>
                          <p className="font-black text-sm uppercase">Connected Bank</p>
                          <p className="text-xs text-gray-500 font-bold uppercase">**** 8821</p>
                       </div>
                    </div>
                    <button className="text-purple-400 text-[10px] font-black uppercase">Edit</button>
                 </div>
                 <button className="w-full bg-white text-black font-black py-5 rounded-3xl shadow-xl hover:scale-[1.02] transition-all uppercase text-xs tracking-widest">
                    Request Immediate Cash-Out
                 </button>
              </div>

              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-8">
                 <h3 className="text-xl font-black italic">Recent Tip Activity</h3>
                 <div className="space-y-4">
                    {[
                      { user: 'Zane_X', amount: 50, time: '10m ago' },
                      { user: 'ArtLover', amount: 25, time: '1h ago' },
                      { user: 'Shadow', amount: 100, time: '3h ago' },
                    ].map((tip, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                         <div className="flex items-center space-x-3">
                            <img src={`https://picsum.photos/seed/${tip.user}/40`} className="w-8 h-8 rounded-full border border-white/10" />
                            <p className="text-sm font-black uppercase tracking-widest text-gray-300">@{tip.user}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-yellow-500 font-black text-sm">+{tip.amount} Gold</p>
                            <p className="text-[8px] text-gray-600 uppercase font-bold">{tip.time}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CreatorStudio;
