
import React, { useState, useRef } from 'react';
import { VideoContent } from '../types';
import LiveCallOverlay from '../components/LiveCallOverlay';

interface VideoPlayerPageProps {
  video: VideoContent;
  onBack: () => void;
}

const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({ video, onBack }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comment, setComment] = useState('');
  const [activeCall, setActiveCall] = useState<{ match: any, mode: 'voice' | 'video' } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen();
      }
    }
  };

  const initiateVoiceCall = () => {
    const creatorMatch = {
      id: video.userId,
      name: video.displayName,
      avatar: `https://picsum.photos/seed/${video.userId}/100`,
      status: 'online'
    };
    setActiveCall({ match: creatorMatch, mode: 'voice' });
  };

  return (
    <div className="h-full bg-black overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        <button onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4">
          <i className="fa-solid fa-arrow-left"></i>
          <span className="text-xs font-black uppercase tracking-widest">Back to Feed</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group">
              <video 
                ref={videoRef}
                src={video.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain" 
              />
              <button 
                onClick={handleFullScreen}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/10"
                title="Full Screen"
              >
                <i className="fa-solid fa-expand"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-white">{video.displayName}'s Exclusive Content</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={`https://picsum.photos/seed/${video.userId}/100`} className="w-12 h-12 rounded-full border-2 border-yellow-500" />
                  <div>
                    <h3 className="font-bold text-white text-lg">{video.displayName}</h3>
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">12.5k Subscribers</p>
                  </div>
                  <button 
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSubscribed ? 'bg-zinc-800 text-gray-400' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                  <button 
                    onClick={initiateVoiceCall}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-green-500/20"
                    title="Initiate Voice Call"
                  >
                    <i className="fa-solid fa-phone"></i>
                    <span>Voice Call</span>
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleFullScreen}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl text-white hover:bg-white/10 border border-white/10"
                    title="Full Screen"
                  >
                    <i className="fa-solid fa-expand"></i>
                    <span className="text-xs font-bold">Full Screen</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl text-white hover:bg-white/10 border border-white/10">
                    <i className="fa-solid fa-thumbs-up"></i>
                    <span className="text-xs font-bold">{video.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl text-white hover:bg-white/10 border border-white/10">
                    <i className="fa-solid fa-share"></i>
                    <span className="text-xs font-bold">Share</span>
                  </button>
                  <button 
                    onClick={initiateVoiceCall}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 rounded-xl text-green-400 hover:bg-green-600/30 border border-green-500/30 transition-all"
                    title="Voice Call"
                  >
                    <i className="fa-solid fa-phone"></i>
                    <span className="text-xs font-bold">Call</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl text-white hover:bg-white/10 border border-white/10">
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>
                </div>
              </div>
              <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5">
                <p className="text-sm text-gray-300 leading-relaxed">{video.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {video.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Comments */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 h-full flex flex-col">
              <h3 className="text-lg font-black text-white mb-6">Discussion ({video.comments})</h3>
              
              <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar max-h-[600px] mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-300">User_{i}</span>
                        <span className="text-[10px] text-gray-600">2h ago</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">This video is amazing! Can't wait for more content like this.</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500 outline-none"
                  />
                  <button className="w-12 rounded-xl bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400">
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeCall && (
        <LiveCallOverlay 
          match={activeCall.match} 
          mode={activeCall.mode} 
          onClose={() => setActiveCall(null)} 
        />
      )}
    </div>
  );
};

export default VideoPlayerPage;
