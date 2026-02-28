
import React, { useState } from 'react';
import { VideoContent } from '../types';
import { analyzeContent } from '../services/moderation';
import Logo from './Logo';

interface VideoFeedProps {
  videos: VideoContent[];
  onLike?: (video: VideoContent) => void;
  onTip?: (video: VideoContent) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videos, onLike, onTip }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isModerating, setIsModerating] = useState(false);
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('scroll');
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(new Set());

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsModerating(true);
    const result = await analyzeContent(commentText);
    if (result.isSafe) {
      setCommentText('');
      setShowComments(false);
    } else {
      alert(`Comment blocked: ${result.reason}`);
    }
    setIsModerating(false);
  };

  const toggleLike = (video: VideoContent) => {
    const newLiked = new Set(likedVideos);
    if (newLiked.has(video.id)) {
      newLiked.delete(video.id);
    } else {
      newLiked.add(video.id);
      if (onLike) onLike(video);
    }
    setLikedVideos(newLiked);
  };

  const toggleFollow = (userId: string) => {
    const newFollowed = new Set(followedCreators);
    if (newFollowed.has(userId)) {
      newFollowed.delete(userId);
    } else {
      newFollowed.add(userId);
    }
    setFollowedCreators(newFollowed);
  };

  if (viewMode === 'grid') {
    return (
      <div className="h-full w-full bg-black p-6 overflow-y-auto relative no-scrollbar pb-32">
        <div className="fixed top-20 right-8 z-40">
           <button 
            onClick={() => setViewMode('scroll')}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all shadow-xl"
           >
              <i className="fa-solid fa-arrows-up-down"></i>
           </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-in fade-in zoom-in-95 duration-500">
           {videos.map(v => (
             <div 
              key={v.id} 
              onClick={() => setViewMode('scroll')}
              className="aspect-[9/16] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer group relative"
             >
                <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={v.displayName} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                   <p className="text-[10px] font-black uppercase text-white truncate mb-1">{v.displayName}</p>
                   <div className="flex items-center space-x-3 text-[10px] text-gray-400">
                      <span className="flex items-center"><i className="fa-solid fa-heart mr-1 text-pink-500"></i> {v.likes}</span>
                      {v.tips && <span className="flex items-center"><i className="fa-solid fa-coins mr-1 text-yellow-500"></i> {v.tips}</span>}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar relative scroll-smooth">
      <div className="fixed top-20 right-8 z-40 flex flex-col space-y-4">
         <button 
          onClick={() => setViewMode('grid')}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all shadow-xl"
          title="Grid View"
         >
            <i className="fa-solid fa-table-cells"></i>
         </button>
      </div>

      {videos.map((video) => (
        <div 
          key={video.id} 
          className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-7rem)] w-full max-w-lg shrink-0 snap-start relative bg-black flex items-center justify-center group"
        >
          {/* Video Player */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
             {video.videoUrl.startsWith('blob:') ? (
               <video 
                 src={video.videoUrl} 
                 className="w-full h-full object-cover" 
                 autoPlay loop muted playsInline 
               />
             ) : (
               <>
                 <img src={video.thumbnailUrl} className="w-full h-full object-cover blur-sm opacity-40" alt="thumb" />
                 <video 
                    src={video.videoUrl} 
                    className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" 
                    autoPlay loop muted playsInline 
                  />
                 <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                    <i className="fa-solid fa-play text-6xl text-white/20 group-hover:scale-110 transition-transform"></i>
                 </div>
               </>
             )}
             
             {/* Privacy Watermark */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] rotate-12 select-none">
                <Logo className="w-96 h-96" showText={true} textClassName="text-8xl" variant="icon" />
             </div>
          </div>

          {/* Video Overlay - Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 rounded-full border-2 border-orange-500 p-0.5 shadow-xl">
                <img src={`https://picsum.photos/seed/${video.userId}/100`} className="w-full h-full rounded-full object-cover" alt="avatar" />
              </div>
              <div className="flex-1">
                <h3 className="font-black flex items-center text-lg">
                  @{video.displayName}
                  <i className="fa-solid fa-circle-check text-blue-400 text-[10px] ml-2"></i>
                </h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center">
                   <div className="mr-2">
                      <Logo className="w-4 h-4" showText={false} />
                   </div>
                   Verified Partner
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => toggleFollow(video.userId)}
                  className={`text-[10px] font-black px-4 py-2.5 rounded-full transition-all uppercase shadow-xl active:scale-95 ${
                    followedCreators.has(video.userId) 
                      ? 'bg-zinc-800 text-gray-400 border border-white/10' 
                      : 'bg-orange-500 text-white hover:scale-105'
                  }`}
                >
                  {followedCreators.has(video.userId) ? 'Following' : 'Follow'}
                </button>
                <button className="bg-white text-black text-[10px] font-black px-6 py-2.5 rounded-full hover:scale-105 transition-all uppercase shadow-xl active:scale-95">
                  Join
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-200 mb-6 line-clamp-2 leading-relaxed italic">"{video.description}"</p>
          </div>

          {/* Video Overlay - Actions (Monetization Focused) */}
          <div className="absolute bottom-32 right-6 flex flex-col items-center space-y-8 z-20">
            <div className="flex flex-col items-center">
              <button 
                onClick={() => toggleLike(video)}
                className={`w-14 h-14 backdrop-blur-xl rounded-3xl flex items-center justify-center text-2xl transition-all active:scale-75 shadow-2xl ${
                  likedVideos.has(video.id) ? 'bg-pink-600 text-white' : 'bg-white/5 text-white hover:text-pink-500 border border-white/10'
                }`}
              >
                <i className={`fa-solid ${likedVideos.has(video.id) ? 'fa-heart' : 'fa-heart'}`}></i>
              </button>
              <span className="text-[10px] mt-2 font-black uppercase tracking-widest text-gray-400">{video.likes + (likedVideos.has(video.id) ? 1 : 0)}</span>
            </div>

            <div className="flex flex-col items-center">
              <button 
                onClick={() => onTip && onTip(video)}
                className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-3xl flex items-center justify-center text-2xl text-black hover:scale-110 transition-all active:scale-90 shadow-2xl shadow-yellow-500/20"
              >
                <i className="fa-solid fa-coins animate-bounce"></i>
              </button>
              <span className="text-[10px] mt-2 font-black uppercase tracking-widest text-yellow-500">Tip</span>
            </div>

            <div className="flex flex-col items-center">
              <button 
                onClick={() => setShowComments(true)}
                className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-3xl flex items-center justify-center text-2xl hover:text-blue-500 transition-all active:scale-90 shadow-2xl border border-white/10"
              >
                <i className="fa-solid fa-comment"></i>
              </button>
              <span className="text-[10px] mt-2 font-black uppercase tracking-widest text-gray-400">{video.comments}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Comment Drawer (Forum Lite) */}
      {showComments && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
           <div className="w-full max-w-lg mx-auto bg-zinc-900 rounded-t-[3.5rem] p-8 space-y-8 animate-in slide-in-from-bottom-full duration-500 relative border-t border-white/10 shadow-2xl">
              <button 
                onClick={() => setShowComments(false)}
                className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/10 rounded-full"
              ></button>
              
              <div className="flex items-center justify-between pt-4">
                 <h3 className="text-2xl font-black italic">Discussion</h3>
                 <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <i className="fa-solid fa-shield-check text-green-500 mr-2"></i>
                    AI Moderated
                 </span>
              </div>

              <div className="max-h-[50vh] overflow-y-auto space-y-8 no-scrollbar py-2">
                 {[
                   { user: 'QueerVibe', text: 'This energy is exactly what the community needs right now. Absolute fire! 🔥🌈', time: '2h ago', likes: 12 },
                   { user: 'Shadow_X', text: 'The cinematography is incredible. How did you get that lighting?', time: '5h ago', likes: 4 },
                   { user: 'Sasha', text: 'Verified creators always bring the heat. Another banger! 🔥', time: '1d ago', likes: 21 },
                 ].map((c, i) => (
                   <div key={i} className="flex space-x-4 group animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                      <img src={`https://picsum.photos/seed/${c.user}/50`} className="w-10 h-10 rounded-2xl border border-white/10 group-hover:border-orange-500/50 transition-all" alt="commenter" />
                      <div className="flex-1 space-y-1">
                         <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black group-hover:text-orange-400 transition-colors uppercase tracking-widest">@{c.user}</span>
                            <span className="text-[8px] text-gray-600 uppercase font-bold">{c.time}</span>
                         </div>
                         <p className="text-sm text-gray-300 leading-relaxed italic">"{c.text}"</p>
                         <div className="flex items-center space-x-4 pt-2">
                            <button className="text-[9px] font-black uppercase text-gray-600 hover:text-pink-500 transition-colors flex items-center">
                               <i className="fa-solid fa-heart mr-1.5"></i> {c.likes}
                            </button>
                            <button className="text-[9px] font-black uppercase text-gray-600 hover:text-blue-500 transition-colors">Reply</button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                 <div className="flex items-center space-x-4 bg-black/60 border border-white/10 rounded-[2rem] p-3 focus-within:border-orange-500 transition-all shadow-inner">
                    <input 
                      type="text" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add to the conversation..." 
                      className="flex-1 bg-transparent border-none text-sm px-3 focus:ring-0 outline-none placeholder:text-gray-700 text-white italic"
                    />
                    <button 
                      onClick={handlePostComment}
                      disabled={isModerating || !commentText.trim()}
                      className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-black rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 uppercase shadow-xl"
                    >
                      {isModerating ? 'CHECKING' : 'POST'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
