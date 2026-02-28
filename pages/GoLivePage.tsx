
import React, { useState, useRef, useEffect } from 'react';

interface GoLivePageProps {
  onBack: () => void;
}

const GoLivePage: React.FC<GoLivePageProps> = ({ onBack }) => {
  const [isLive, setIsLive] = useState(false);
  const [title, setTitle] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();

    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartStream = () => {
    if (!title) return;
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        setIsLive(true);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const handleStopStream = () => {
    setIsLive(false);
    // Logic to save replay or stats would go here
  };

  return (
    <div className="h-full bg-black relative flex flex-col overflow-hidden">
      {/* Camera Preview / Live Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 bg-gradient-to-b from-black/60 via-transparent to-black/80">
        <div className="flex justify-between items-start">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60">
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          {isLive && (
            <div className="flex items-center space-x-2 bg-red-600 px-4 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-[10px] font-black uppercase tracking-widest">LIVE • 00:00</span>
            </div>
          )}
        </div>

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <span className="text-9xl font-black text-white animate-ping">{countdown}</span>
          </div>
        )}

        <div className="w-full max-w-md mx-auto space-y-6">
          {!isLive ? (
            <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-6">
              <h2 className="text-2xl font-black text-white text-center">Setup Broadcast</h2>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-2">Stream Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's happening?" 
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-yellow-500 transition-all"
                />
              </div>
              <div className="flex space-x-4">
                <button className="flex-1 py-4 bg-white/10 rounded-2xl text-white font-bold hover:bg-white/20">
                  <i className="fa-solid fa-camera-rotate mr-2"></i> Flip
                </button>
                <button className="flex-1 py-4 bg-white/10 rounded-2xl text-white font-bold hover:bg-white/20">
                  <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Filters
                </button>
              </div>
              <button 
                onClick={handleStartStream}
                disabled={!title}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl disabled:opacity-50"
              >
                Go Live
              </button>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="bg-black/40 px-4 py-2 rounded-xl text-white text-sm">
                  <span className="font-bold text-yellow-400">System:</span> You are live!
                </div>
              </div>
              <button 
                onClick={handleStopStream}
                className="w-16 h-16 rounded-full bg-white border-4 border-red-500 flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
              >
                <div className="w-6 h-6 bg-red-500 rounded-sm"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoLivePage;
