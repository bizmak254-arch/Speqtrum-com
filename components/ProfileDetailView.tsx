
import React, { useState } from 'react';
import { generateProfileSummaryAudio } from '../services/ttsService';

interface ProfileDetailViewProps {
  profile: any;
  onClose: () => void;
  onAction: (type: 'like' | 'pass' | 'block') => void;
}

type TabType = 'About' | 'Photos' | 'Videos' | 'Interests' | 'Badges';

const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({ profile, onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState<TabType>('About');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  const handleListenToProfile = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      const source = await generateProfileSummaryAudio(profile.bio || `This is ${profile.name}, a vibrant member of the Speqtrum community.`);
      source.onended = () => setIsPlayingAudio(false);
    } catch (err) {
      console.error(err);
      setIsPlayingAudio(false);
    }
  };

  const handleAddFriend = () => {
    setFriendRequestSent(true);
    // Logic to send friend request would go here
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300 overflow-y-auto no-scrollbar">
      <div className="min-h-screen w-full max-w-3xl mx-auto bg-[#0a0a0a] shadow-2xl relative flex flex-col">
        
        {/* Wireframe: [ Cover Image / Gradient ] */}
        <div className="h-48 w-full bg-gradient-to-r from-purple-900 via-pink-800 to-indigo-900 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors z-20"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Wireframe: [ Profile Photo ] Name | Pronouns | Age | ✔ Verified */}
        <div className="px-8 -mt-16 relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="w-32 h-32 rounded-3xl border-4 border-[#0a0a0a] overflow-hidden shadow-2xl bg-zinc-800">
                <img src={profile.img} className="w-full h-full object-cover" />
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-black">{profile.name}</h2>
                  <i className="fa-solid fa-circle-check text-blue-400 text-lg"></i>
                </div>
                <div className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] flex flex-wrap gap-x-3 gap-y-1">
                  <span>They / Them</span>
                  <span>•</span>
                  <span>{profile.age} Years</span>
                  <span>•</span>
                  <span className="text-purple-400">Verified Member</span>
                </div>
              </div>
            </div>

            {/* Wireframe: [ ❤️ Like ] [ ➕ Add Friend ] [ 💬 Message ] [ ⋮ Block/Report ] */}
            <div className="flex items-center gap-3 mb-2 flex-wrap sm:flex-nowrap">
               <button 
                onClick={() => onAction('like')}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
               >
                  <i className="fa-solid fa-heart"></i>
                  <span>Like</span>
               </button>
               <button 
                onClick={handleAddFriend}
                disabled={friendRequestSent}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  friendRequestSent ? 'bg-zinc-800 text-gray-400 cursor-default' : 'bg-white text-black hover:bg-gray-200'
                }`}
               >
                  <i className={`fa-solid ${friendRequestSent ? 'fa-check' : 'fa-user-plus'}`}></i>
                  <span>{friendRequestSent ? 'Sent' : 'Add Friend'}</span>
               </button>
               <button className="flex-1 sm:flex-none px-6 py-3 bg-transparent border-2 border-yellow-500 text-yellow-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-2">
                  <i className="fa-solid fa-comment"></i>
                  <span>Message</span>
               </button>
               <button 
                onClick={() => onAction('block')}
                className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all shrink-0"
               >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
               </button>
            </div>
          </div>
        </div>

        {/* Wireframe: [ Tabs ] About | Photos | Videos | Interests | Badges */}
        <div className="mt-12 border-b border-white/5 px-8">
           <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {(['About', 'Photos', 'Videos', 'Interests', 'Badges'] as TabType[]).map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    activeTab === tab ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'
                  }`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
        </div>

        {/* Wireframe: [ Tab Content Area ] */}
        <div className="p-8 flex-1">
           {activeTab === 'About' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">The Vibe</h3>
                    <button 
                      onClick={handleListenToProfile}
                      className={`text-purple-400 text-xs font-black uppercase flex items-center gap-2 ${isPlayingAudio ? 'animate-pulse' : ''}`}
                    >
                      <i className="fa-solid fa-volume-high"></i>
                      <span>Listen to bio</span>
                    </button>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-lg italic">"{profile.bio}"</p>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                      <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Location</p>
                      <p className="font-bold text-gray-200">{profile.location}</p>
                   </div>
                   <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                      <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Relationship Status</p>
                      <p className="font-bold text-gray-200">Monogamish / Single</p>
                   </div>
                </div>

                <section className="bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                         <i className="fa-solid fa-bolt"></i>
                      </div>
                      <h3 className="text-xl font-black">AI Compatibility: {profile.compatibility}%</h3>
                   </div>
                   <p className="text-sm text-gray-400 leading-relaxed">Based on your shared interests in art and coding, our AI predicts a 98% synergy in creative energy.</p>
                </section>
             </div>
           )}

           {activeTab === 'Photos' && (
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-white/5">
                      <img src={`https://picsum.photos/seed/${profile.name}${i}/400`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                   </div>
                ))}
             </div>
           )}

           {activeTab === 'Videos' && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="aspect-[9/16] bg-zinc-900 rounded-3xl overflow-hidden relative border border-white/5 group">
                   <img src={`https://picsum.photos/seed/vid1/400/600`} className="w-full h-full object-cover opacity-60" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-play text-4xl text-white group-hover:scale-110 transition-transform"></i>
                   </div>
                </div>
                <div className="aspect-[9/16] bg-zinc-900 rounded-3xl overflow-hidden relative border border-white/5 group">
                   <img src={`https://picsum.photos/seed/vid2/400/600`} className="w-full h-full object-cover opacity-60" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-play text-4xl text-white group-hover:scale-110 transition-transform"></i>
                   </div>
                </div>
              </div>
           )}

           {activeTab === 'Interests' && (
             <div className="flex flex-wrap gap-3 animate-in fade-in duration-500">
                {profile.interests?.map((i: string) => (
                   <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-300">
                      # {i}
                   </span>
                ))}
             </div>
           )}

           {activeTab === 'Badges' && (
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in duration-500">
                {[
                  { name: 'Verified User', icon: 'fa-certificate', color: 'text-blue-400' },
                  { name: 'Safe Space Host', icon: 'fa-shield-heart', color: 'text-pink-400' },
                  { name: 'Pioneer Member', icon: 'fa-bolt', color: 'text-yellow-500' },
                  { name: 'Top Creator', icon: 'fa-fire', color: 'text-orange-500' },
                ].map(badge => (
                   <div key={badge.name} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center space-y-3">
                      <i className={`fa-solid ${badge.icon} text-2xl ${badge.color}`}></i>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">{badge.name}</p>
                   </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailView;
