
import React, { useState } from 'react';
import ProfileEditor from '../components/ProfileEditor';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onBack?: () => void;
}

const BADGE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  'verified': { icon: 'fa-certificate', color: 'text-blue-500', label: 'Verified' },
  'pioneer': { icon: 'fa-bolt', color: 'text-yellow-500', label: 'Pioneer' },
  'safe-ally': { icon: 'fa-shield-heart', color: 'text-pink-500', label: 'Safe Ally' },
  'creator': { icon: 'fa-fire', color: 'text-orange-500', label: 'Creator' },
  // Fallbacks for legacy/other badges
  'verified-id': { icon: 'fa-id-card', color: 'text-green-500', label: 'ID Verified' }
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSave, onBack }) => {
  const { deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(!user.bio);

  const handleDelete = async () => {
    await deleteAccount();
  };

  if (isEditing) {
    return <ProfileEditor user={user} onSave={(updated) => { setIsEditing(false); onSave(updated); }} onBack={() => setIsEditing(false)} />;
  }

  // Mock Friend Requests Data
  const friendRequests = [
    { id: 'u1', name: 'Alex M.', avatar: 'https://picsum.photos/seed/u1/100', mutuals: 3 },
    { id: 'u2', name: 'Jordan K.', avatar: 'https://picsum.photos/seed/u2/100', mutuals: 1 },
  ];

  return (
    <div className="h-full bg-[#fcfcfc] overflow-y-auto no-scrollbar pb-32">
      {/* 1. BASIC PROFILE INFO (Top Hero) */}
      <div className="relative h-96 w-full">
         <img src={user.banner || user.media?.[0] || user.avatar} className="w-full h-full object-cover opacity-80" alt="Cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfc] via-[#fcfcfc]/10 to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div className="flex items-center space-x-8">
               <div className="relative">
                  <img src={user.avatar} className="w-32 h-32 sm:w-48 sm:h-48 rounded-[3rem] border-4 border-white shadow-2xl object-cover" alt="Avatar" />
                  <div className={`absolute bottom-4 right-4 w-6 h-6 border-4 border-white rounded-full ${user.visibilitySettings.showOnlineStatus ? 'bg-emerald-500' : 'bg-zinc-400'}`}></div>
               </div>
               <div className="space-y-2">
                  <div className="flex flex-col text-zinc-900">
                     <div className="flex items-center space-x-3">
                        <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter text-purple-900">{user.displayName}</h1>
                        {user.isVerified && <i className="fa-solid fa-circle-check text-blue-600 text-3xl"></i>}
                     </div>
                     {user.headline && <p className="text-lg font-bold text-zinc-500 italic">{user.headline}</p>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-600 text-xs font-black uppercase tracking-widest">
                     <span className="text-zinc-900">{user.age} Years</span>
                     <span className="text-zinc-300">•</span>
                     <span className="flex items-center text-zinc-900"><i className="fa-solid fa-location-dot mr-2 text-rose-600"></i> {user.city}, {user.country}</span>
                     <span className="text-zinc-300">•</span>
                     <span className="text-emerald-600 font-black tracking-widest">{user.visibilitySettings.showOnlineStatus ? 'Online Now' : 'Stealth Mode'}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white border-2 border-purple-600 text-purple-700 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-purple-50 transition-all flex items-center space-x-3 shadow-lg"
              >
                 <i className="fa-solid fa-pen-nib"></i>
                 <span>Edit Profile</span>
              </button>
              <button 
                onClick={() => { if(onBack) onBack(); }}
                className="bg-orange-500 text-white px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center space-x-3 shadow-lg shadow-orange-500/20"
              >
                 <i className="fa-solid fa-user-plus"></i>
                 <span>Invite Friends</span>
              </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 sm:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
         {/* Left Column: Details */}
         <div className="lg:col-span-2 space-y-12">
            {/* 2. ABOUT ME */}
            <section className="bg-white border-2 border-zinc-100 p-10 rounded-[3rem] space-y-6 shadow-sm">
               <h3 className="text-[10px] font-black text-purple-700 uppercase tracking-[0.4em]">The Narrative</h3>
               <p className="text-2xl font-black text-zinc-900 leading-relaxed italic">"{user.bio}"</p>
            </section>

            {/* NEW: PROMPTS */}
            {user.prompts && user.prompts.length > 0 && (
               <section className="grid grid-cols-1 gap-6">
                  {user.prompts.filter(p => p.answer).map((prompt, i) => (
                     <div key={i} className="bg-pink-50 border-2 border-pink-100 p-8 rounded-[2.5rem] space-y-2 relative overflow-hidden">
                        <i className="fa-solid fa-quote-left absolute top-4 right-6 text-4xl text-pink-200 opacity-50"></i>
                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{prompt.question}</p>
                        <p className="text-lg font-bold text-zinc-800 italic">{prompt.answer}</p>
                     </div>
                  ))}
               </section>
            )}

            {/* NEW: VIBE TAGS */}
            {user.interests && user.interests.length > 0 && (
               <section className="bg-white border-2 border-zinc-100 p-10 rounded-[3rem] space-y-6 shadow-sm">
                  <h3 className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em]">Vibe Tags</h3>
                  <div className="flex flex-wrap gap-3">
                     {user.interests.map(tag => (
                        <span key={tag} className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                           {tag}
                        </span>
                     ))}
                  </div>
               </section>
            )}

            {/* 3. PURPOSE & 4. IDENTITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white border-2 border-amber-100 p-10 rounded-[3.5rem] space-y-4 shadow-sm">
                  <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Primary Intent</h3>
                  <p className="text-xl font-black italic text-amber-900">{user.purpose || 'Exploring the Spectrum'}</p>
               </div>
               <div className="bg-white border-2 border-blue-100 p-10 rounded-[3.5rem] space-y-4 shadow-sm">
                  <h3 className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Interested In</h3>
                  <div className="flex flex-wrap gap-2">
                     {user.interestedIn?.map(i => <span key={i} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">{i}</span>)}
                  </div>
               </div>
            </div>

            {/* 6. PHOTOS & MEDIA */}
            <section className="space-y-6">
               <h3 className="text-[10px] font-black text-purple-800 uppercase tracking-[0.4em] ml-4">Media Wall</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-zinc-100 rounded-[2.5rem] overflow-hidden border-2 border-zinc-200 hover:scale-105 transition-transform cursor-pointer shadow-sm">
                       <img src={`https://picsum.photos/seed/profile${user.id}${i}/400`} className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Right Column: Stats & Actions */}
         <div className="space-y-12">
            
            {/* Friend Requests Section (Facebook Style) */}
            <section className="bg-white border-2 border-zinc-100 p-10 rounded-[3.5rem] space-y-6 shadow-xl">
               <div className="flex items-center justify-between border-b-2 border-zinc-50 pb-4">
                  <h3 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Friend Requests</h3>
                  <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{friendRequests.length}</span>
               </div>
               <div className="space-y-4">
                  {friendRequests.map(req => (
                    <div key={req.id} className="flex items-center space-x-3">
                       <img src={req.avatar} className="w-12 h-12 rounded-2xl object-cover" />
                       <div className="flex-1">
                          <p className="font-bold text-sm text-zinc-900">{req.name}</p>
                          <p className="text-[9px] text-zinc-500">{req.mutuals} mutual friends</p>
                       </div>
                       <div className="flex space-x-2">
                          <button className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"><i className="fa-solid fa-check text-xs"></i></button>
                          <button className="w-8 h-8 bg-zinc-100 text-zinc-500 rounded-xl flex items-center justify-center hover:bg-zinc-200 transition-colors"><i className="fa-solid fa-xmark text-xs"></i></button>
                       </div>
                    </div>
                  ))}
                  {friendRequests.length === 0 && <p className="text-xs text-zinc-400 italic">No pending requests.</p>}
               </div>
               <button className="w-full py-3 text-[10px] font-black uppercase text-blue-600 tracking-widest hover:bg-blue-50 rounded-2xl transition-all">See All</button>
            </section>

            {/* 10. ACTION BUTTONS */}
            <section className="bg-white border-2 border-zinc-100 p-10 rounded-[3.5rem] space-y-4 shadow-sm">
               <button className="w-full py-5 bg-gradient-to-r from-purple-700 to-pink-600 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/20 text-white flex items-center justify-center space-x-3">
                  <i className="fa-solid fa-heart"></i>
                  <span>Like & Connect</span>
               </button>
               <button className="w-full py-5 bg-zinc-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3 shadow-lg">
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Send Message</span>
               </button>
               <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="py-4 bg-zinc-50 border-2 border-zinc-200 rounded-2xl text-[9px] font-black uppercase tracking-widest text-purple-700 hover:bg-purple-700 hover:text-white transition-all">Follow</button>
                  <button className="py-4 bg-zinc-50 border-2 border-zinc-200 rounded-2xl text-[9px] font-black uppercase tracking-widest text-purple-700 hover:bg-purple-700 hover:text-white transition-all">Favorite</button>
               </div>
            </section>

            {/* 7. COMMUNITY & ACTIVITY */}
            <section className="bg-white border-2 border-purple-100 p-10 rounded-[3.5rem] space-y-8 shadow-sm">
               <h3 className="text-[10px] font-black text-purple-700 uppercase tracking-widest border-b-2 border-purple-50 pb-4">Social Footprint</h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-3xl font-black italic text-purple-900">12</p>
                     <p className="text-[9px] text-purple-400 font-black uppercase tracking-tighter">Communities Joined</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-3xl font-black italic text-purple-900">45</p>
                     <p className="text-[9px] text-purple-400 font-black uppercase tracking-tighter">Videos Shared</p>
                  </div>
               </div>
               <div className="space-y-4 pt-4 border-t-2 border-purple-50">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Recent Badges</p>
                  <div className="flex flex-wrap gap-2">
                     {user.badges && user.badges.length > 0 ? user.badges.map(b => {
                        const config = BADGE_CONFIG[b] || { icon: 'fa-certificate', color: 'text-zinc-400', label: b };
                        return (
                           <div key={b} className="group relative w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-zinc-100 shadow-md cursor-help" title={config.label}>
                              <i className={`fa-solid ${config.icon} ${config.color}`}></i>
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {config.label}
                              </span>
                           </div>
                        );
                     }) : (
                        <p className="text-[10px] text-gray-400 italic">No badges earned yet.</p>
                     )}
                  </div>
               </div>
            </section>

            {/* 9. SAFETY FEATURES */}
            <section className="bg-rose-50 border-2 border-rose-200 p-10 rounded-[3.5rem] space-y-6 shadow-sm">
               <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Security Zone</h3>
               <div className="space-y-3">
                  <button className="w-full py-4 bg-white border-2 border-rose-300 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">Block User</button>
                  <button className="w-full py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-700 transition-all shadow-lg">Report Profile</button>
                  
                  <div className="pt-6 border-t border-rose-200 mt-6">
                    <button 
                      onClick={async () => {
                        if (window.confirm("Are you absolutely sure? This will permanently delete your account and all data.")) {
                          try {
                            // We need to access deleteAccount from context
                            // I'll add it to the props or use the hook inside the component
                            // For now, I'll assume it's available via a hook I'll add
                            handleDelete();
                          } catch (e) {
                            alert("Error deleting account. You may need to re-authenticate.");
                          }
                        }
                      }}
                      className="w-full py-4 bg-transparent border-2 border-red-200 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      Delete Account
                    </button>
                  </div>

                  <a href="#" className="block text-center text-[10px] font-black text-rose-800 uppercase hover:text-purple-700 transition-colors pt-4 tracking-tighter underline">Speqtrum Safety Tips</a>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
