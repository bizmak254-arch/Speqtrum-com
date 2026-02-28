
import React, { useState } from 'react';
import { VideoContent } from '../types';
import { useAuth } from '../context/AuthContext';
import TourGuide from '../components/TourGuide';

interface FeedPageProps {
  videos: VideoContent[];
  onNavigate: (tab: any) => void;
}

const FeedPage: React.FC<FeedPageProps> = ({ videos, onNavigate }) => {
  const { currentUser } = useAuth();
  const [postText, setPostText] = useState('');

  const feedItems = [
    {
      id: 1,
      type: 'post',
      user: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex', badge: 'verified' },
      content: 'Just arrived in Berlin for the weekend! Any local recommendations for safe queer spaces? 🏳️‍🌈',
      image: 'https://images.unsplash.com/photo-1560969184-10fe8719e654?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      likes: 124,
      comments: 18,
      time: '2h ago'
    },
    {
      id: 2,
      type: 'community_highlight',
      community: { name: 'Tech & Gaming', icon: 'fa-gamepad', color: 'bg-purple-500' },
      title: 'Weekly Game Night Starting Soon!',
      description: 'Join us in the voice channel for some Among Us and chill vibes.',
      participants: 45,
      time: 'Just now'
    },
    {
      id: 3,
      type: 'post',
      user: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      content: 'The new creator tools on Speqtrum are insane. Just uploaded my first premium bundle! 📸✨',
      likes: 89,
      comments: 5,
      time: '4h ago'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 space-y-6 animate-in fade-in duration-500">
      <TourGuide />
      
      {/* Header */}
      <header className="flex items-center justify-between py-2">
         <h1 className="text-2xl font-black tracking-tight text-zinc-900">Home</h1>
         <div className="flex space-x-2">
            <button onClick={() => onNavigate('search')} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200">
               <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <button onClick={() => onNavigate('chat')} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 relative">
               <i className="fa-solid fa-comment-dots"></i>
               <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
         </div>
      </header>

      {/* Post Composer */}
      <div className="bg-white border border-zinc-100 p-4 rounded-2xl shadow-sm">
         <div className="flex space-x-3">
            <div className="relative">
               <img src={currentUser?.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover" />
               {currentUser?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                     <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
                  </div>
               )}
            </div>
            <div className="flex-1">
               <textarea 
                 value={postText}
                 onChange={(e) => setPostText(e.target.value)}
                 placeholder="What's on your mind?" 
                 className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none h-12 placeholder:text-zinc-400"
               ></textarea>
               <div className="flex justify-between items-center pt-2 border-t border-zinc-50">
                  <div className="flex space-x-4 text-zinc-400">
                     <button className="hover:text-zinc-600"><i className="fa-solid fa-image"></i></button>
                     <button className="hover:text-zinc-600"><i className="fa-solid fa-video"></i></button>
                     <button className="hover:text-zinc-600"><i className="fa-solid fa-location-dot"></i></button>
                  </div>
                  <button 
                    disabled={!postText}
                    className="bg-zinc-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase disabled:opacity-50"
                  >
                    Post
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Stories / Highlights */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar py-2">
         <div className="w-20 flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer" onClick={() => onNavigate('go_live')}>
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-colors">
               <i className="fa-solid fa-plus text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-zinc-500">Add Story</span>
         </div>
         {[1,2,3,4,5].map(i => (
            <div key={i} className="w-20 flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer">
               <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-purple-600">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full rounded-full border-2 border-white object-cover" />
               </div>
               <span className="text-[10px] font-medium text-zinc-600 truncate w-full text-center">User {i}</span>
            </div>
         ))}
      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
         {feedItems.map((item: any) => (
            <div key={item.id} className="bg-white border border-zinc-100 rounded-3xl shadow-sm overflow-hidden">
               {item.type === 'post' && (
                  <>
                     <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                           <img src={item.user.avatar} className="w-10 h-10 rounded-full" />
                           <div>
                              <div className="flex items-center space-x-1">
                                 <span className="font-bold text-sm text-zinc-900">{item.user.name}</span>
                                 {item.user.badge && <i className="fa-solid fa-circle-check text-blue-500 text-xs"></i>}
                              </div>
                              <span className="text-xs text-zinc-400">{item.time}</span>
                           </div>
                        </div>
                        <button className="text-zinc-400 hover:text-zinc-900"><i className="fa-solid fa-ellipsis"></i></button>
                     </div>
                     <div className="px-4 pb-3">
                        <p className="text-sm text-zinc-800 leading-relaxed">{item.content}</p>
                     </div>
                     {item.image && (
                        <img src={item.image} className="w-full h-64 object-cover" />
                     )}
                     <div className="p-4 flex items-center justify-between border-t border-zinc-50">
                        <div className="flex space-x-6">
                           <button className="flex items-center space-x-2 text-zinc-500 hover:text-red-500 transition-colors">
                              <i className="fa-regular fa-heart text-lg"></i>
                              <span className="text-xs font-bold">{item.likes}</span>
                           </button>
                           <button className="flex items-center space-x-2 text-zinc-500 hover:text-blue-500 transition-colors">
                              <i className="fa-regular fa-comment text-lg"></i>
                              <span className="text-xs font-bold">{item.comments}</span>
                           </button>
                           <button className="flex items-center space-x-2 text-zinc-500 hover:text-green-500 transition-colors">
                              <i className="fa-solid fa-share text-lg"></i>
                           </button>
                        </div>
                        <button className="text-zinc-400 hover:text-zinc-900"><i className="fa-regular fa-bookmark"></i></button>
                     </div>
                  </>
               )}

               {item.type === 'community_highlight' && (
                  <div className="p-6 bg-zinc-50">
                     <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-6 h-6 rounded-md ${item.community.color} flex items-center justify-center text-white text-xs`}>
                           <i className={`fa-solid ${item.community.icon}`}></i>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{item.community.name}</span>
                     </div>
                     <h3 className="text-lg font-black text-zinc-900 mb-1">{item.title}</h3>
                     <p className="text-sm text-zinc-600 mb-4">{item.description}</p>
                     <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200"></div>
                           ))}
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">+{item.participants}</div>
                        </div>
                        <button onClick={() => onNavigate('community')} className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl">Join Now</button>
                     </div>
                  </div>
               )}
            </div>
         ))}
      </div>
    </div>
  );
};

export default FeedPage;
