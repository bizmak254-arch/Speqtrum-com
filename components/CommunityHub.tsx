
import React, { useState } from 'react';
import { CommunityGroup, CommunityEvent } from '../types';

const INITIAL_GROUPS: CommunityGroup[] = [
  { id: 'g1', name: 'Digital Artists Collective', description: 'Showcase your art and get feedback from the global community.', members: 1240, isPrivate: false, coverImage: 'https://picsum.photos/seed/art/600/200' },
  { id: 'g2', name: 'Global Tech Innovators', description: 'Connecting professionals in the tech industry worldwide.', members: 450, isPrivate: true, coverImage: 'https://picsum.photos/seed/tech/600/200' },
  { id: 'g3', name: 'Late Night Gamers', description: 'Fortnite, Valorant, and late night laughs.', members: 2100, isPrivate: false, coverImage: 'https://picsum.photos/seed/gaming/600/200' },
];

const MOCK_EVENTS: CommunityEvent[] = [
  { id: 'e1', title: 'Code & Coffee Night', description: 'Monthly hackathon for developers.', date: 'Oct 12, 7:00 PM', location: 'Online / Zoom', isOnline: true, attendees: 45, image: 'https://picsum.photos/seed/event1/400/200' },
  { id: 'e2', title: 'Art & Drinks Mixer', description: 'Meet local artists in a relaxed environment.', date: 'Oct 15, 6:00 PM', location: 'The Vibe Lounge, London', isOnline: false, attendees: 128, image: 'https://picsum.photos/seed/event2/400/200' },
];

interface CommunityHubProps {
  onJoin?: (group: CommunityGroup) => void;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ onJoin }) => {
  const [activeTab, setActiveTab] = useState<'communities' | 'events' | 'discussions'>('communities');
  const [groups, setGroups] = useState<CommunityGroup[]>(INITIAL_GROUPS);
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', isPrivate: false });

  const handleToggleJoin = (group: CommunityGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    const newJoined = new Set(joinedGroups);
    if (newJoined.has(group.id)) {
      newJoined.delete(group.id);
    } else {
      newJoined.add(group.id);
      if (onJoin) onJoin(group);
    }
    setJoinedGroups(newJoined);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name.trim()) return;

    const group: CommunityGroup = {
      id: `g-${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      members: 1,
      isPrivate: newGroup.isPrivate,
      coverImage: `https://picsum.photos/seed/${newGroup.name}/600/200`
    };

    setGroups([group, ...groups]);
    setIsCreateModalOpen(false);
    setNewGroup({ name: '', description: '', isPrivate: false });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-16 pb-40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter italic">Communities</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Engage • Discuss • Belong</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white/5 p-1.5 rounded-3xl border border-white/5">
            <button 
              onClick={() => setActiveTab('communities')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${activeTab === 'communities' ? 'bg-white text-black shadow-2xl' : 'text-orange-500 hover:text-black hover:bg-orange-500'}`}
            >
              Discover
            </button>
            <button 
              onClick={() => setActiveTab('discussions')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${activeTab === 'discussions' ? 'bg-white text-black shadow-2xl' : 'text-orange-500 hover:text-black hover:bg-orange-500'}`}
            >
              Forums
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${activeTab === 'events' ? 'bg-white text-black shadow-2xl' : 'text-orange-500 hover:text-black hover:bg-orange-500'}`}
            >
              Events
            </button>
        </div>
      </div>

      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {groups.map((group) => (
            <div key={group.id} className="group bg-zinc-900 border border-white/5 rounded-[3.5rem] overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer relative shadow-2xl">
              <div className="h-44 relative">
                 <img src={group.coverImage} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" alt={group.name} />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>
                 {group.isPrivate && (
                    <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-xl p-3 rounded-2xl text-orange-500 border border-white/10 shadow-xl">
                      <i className="fa-solid fa-lock text-sm"></i>
                    </div>
                 )}
              </div>
              <div className="p-10 space-y-6">
                <div>
                  <h3 className="text-2xl font-black mb-2">{group.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-2">"{group.description}"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/seed/${group.id}${i}/60`} className="w-10 h-10 rounded-2xl border-4 border-zinc-900 object-cover" alt="member" />)}
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border-4 border-zinc-900 flex items-center justify-center text-[9px] font-black text-gray-500">+{group.members > 3 ? group.members - 3 : 0}</div>
                  </div>
                  <button 
                    onClick={(e) => handleToggleJoin(group, e)}
                    className={`text-[10px] font-black py-3.5 px-10 rounded-2xl transition-all uppercase tracking-[0.2em] ${
                      joinedGroups.has(group.id) 
                        ? 'bg-orange-600 text-white shadow-2xl shadow-orange-500/30 border border-orange-500/50' 
                        : 'bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black active:scale-95'
                    }`}
                  >
                    {joinedGroups.has(group.id) ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'discussions' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-400">
                    <i className="fa-solid fa-plus"></i>
                 </div>
                 <p className="text-sm font-black uppercase text-gray-400 tracking-widest">Start a community discussion...</p>
              </div>
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="bg-white text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Create Post
              </button>
           </div>

           {[
             { id: 1, user: 'ArtLover', community: 'Digital Artists', title: 'Cyberpunk Aesthetic in Modern Art', text: 'Does anyone else feel like the neon aesthetic of the 80s really captures the vibe of our generation? Looking to start a collaborative art piece.', likes: 142, comments: 24, time: '2h ago' },
             { id: 2, user: 'TechGuru', community: 'Global Tech Innovators', title: 'Remote Work Best Practices', text: 'Sharing a guide on how to navigate corporate policies regarding remote work. Link in the comments!', likes: 88, comments: 12, time: '5h ago' }
           ].map(post => (
             <div key={post.id} className="bg-zinc-900 border border-white/5 p-10 rounded-[3.5rem] space-y-8 group hover:border-orange-500/40 transition-all shadow-2xl relative">
                <div className="flex items-start justify-between">
                   <div className="flex items-center space-x-4">
                      <img src={`https://picsum.photos/seed/${post.user}/100`} className="w-12 h-12 rounded-2xl border border-white/10 shadow-lg" />
                      <div>
                         <p className="font-black text-sm group-hover:text-orange-400 transition-colors uppercase tracking-widest">@{post.user}</p>
                         <p className="text-[10px] text-gray-600 uppercase font-black tracking-tighter">In <span className="text-orange-500">{post.community}</span> • {post.time}</p>
                      </div>
                   </div>
                   <button className="text-gray-700 hover:text-white transition-colors p-2"><i className="fa-solid fa-ellipsis"></i></button>
                </div>
                <div className="space-y-4">
                   <h2 className="text-2xl font-black italic">{post.title}</h2>
                   <p className="text-gray-400 leading-relaxed italic">"{post.text}"</p>
                </div>
                <div className="flex items-center space-x-8 border-t border-white/5 pt-8">
                   <button className="flex items-center space-x-2.5 text-gray-500 hover:text-pink-500 transition-all group/btn">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-pink-500/10 transition-all"><i className="fa-solid fa-heart"></i></div>
                      <span className="text-[10px] font-black uppercase">{post.likes}</span>
                   </button>
                   <button className="flex items-center space-x-2.5 text-gray-500 hover:text-blue-500 transition-all group/btn">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-blue-500/10 transition-all"><i className="fa-solid fa-comment"></i></div>
                      <span className="text-[10px] font-black uppercase">{post.comments}</span>
                   </button>
                   <button className="flex items-center space-x-2.5 text-gray-500 hover:text-yellow-500 transition-all ml-auto group/btn">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-yellow-500/10 transition-all"><i className="fa-solid fa-coins"></i></div>
                      <span className="text-[10px] font-black uppercase">Tip Author</span>
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Event tab is same as previous, just kept shorter here */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {MOCK_EVENTS.map(event => (
             <div key={event.id} className="bg-zinc-900 border border-white/5 rounded-[3.5rem] overflow-hidden group hover:border-blue-500/50 transition-all shadow-2xl">
                <div className="h-52 relative">
                   <img src={event.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={event.title} />
                   <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                      {event.isOnline ? 'Virtual' : 'In-Person'}
                   </div>
                </div>
                <div className="p-10 space-y-6">
                   <div>
                      <h3 className="text-2xl font-black">{event.title}</h3>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-2">{event.date} • {event.location}</p>
                   </div>
                   <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-2">"{event.description}"</p>
                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center space-x-3 text-gray-500">
                         <i className="fa-solid fa-users text-xs"></i>
                         <span className="text-[10px] font-black uppercase tracking-tighter">{event.attendees} Going</span>
                      </div>
                      <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20 active:scale-95">RSVP Now</button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-zinc-900 border border-white/10 rounded-[3.5rem] p-12 max-w-2xl w-full space-y-10 animate-in slide-in-from-bottom-8 duration-500 shadow-2xl">
              <div className="text-center space-y-3">
                 <h2 className="text-4xl font-black italic">Share with Community</h2>
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Start a new conversation</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setIsPostModalOpen(false); }} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Thread Title</label>
                    <input autoFocus required type="text" placeholder="e.g. Tips for safe travel in London..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-sm focus:border-orange-500 outline-none transition-all shadow-inner text-white font-bold italic" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Post Content</label>
                    <textarea required placeholder="Start writing your thoughts..." className="w-full bg-black/60 border border-white/10 rounded-[2rem] py-6 px-6 text-sm focus:border-orange-500 outline-none h-48 resize-none transition-all shadow-inner text-gray-300 leading-relaxed" />
                 </div>
                 <div className="flex space-x-4 pt-4">
                    <button type="button" onClick={() => setIsPostModalOpen(false)} className="flex-1 py-5 bg-transparent border-2 border-orange-500 text-orange-500 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-black transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-5 bg-orange-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-2xl shadow-orange-500/20">Publish Thread</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
