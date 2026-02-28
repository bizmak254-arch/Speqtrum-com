
import React from 'react';
import { UserRole, TabType, ModuleType } from '../types';
import { useAuth } from '../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  activeModules?: ModuleType[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, activeTab, setActiveTab, activeModules }) => {
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.MODERATOR;
  
  // Default to all modules if undefined
  const enabledModules = activeModules || ['social', 'dating', 'creator', 'live'];

  if (!isOpen) return null;

  const moduleItems = [
    { id: 'feed', label: 'Social Feed', icon: 'fa-house', color: 'text-blue-500', module: 'social' },
    { id: 'dating_open', label: 'Connections', icon: 'fa-heart', color: 'text-rose-500', module: 'dating' },
    { id: 'marketplace', label: 'Marketplace', icon: 'fa-store', color: 'text-orange-500', module: 'creator' },
    { id: 'live_feed', label: 'Live Streams', icon: 'fa-tower-broadcast', color: 'text-purple-500', module: 'live' },
  ].filter(item => enabledModules.includes(item.module as ModuleType));

  const menuGroups = [
    {
      title: 'Main Modules',
      items: moduleItems
    },
    {
      title: 'Explore',
      items: [
        { id: 'search', label: 'Find People', icon: 'fa-magnifying-glass', color: 'text-zinc-500' },
        { id: 'community', label: 'Communities', icon: 'fa-users', color: 'text-indigo-500' },
        { id: 'channels', label: 'Channels', icon: 'fa-bullhorn', color: 'text-orange-500' },
      ]
    },
    {
      title: 'Connect',
      items: [
        { id: 'chat', label: 'Messages', icon: 'fa-comment-dots', color: 'text-blue-500' },
        { id: 'calls', label: 'Calls', icon: 'fa-phone', color: 'text-green-500' },
        { id: 'contacts', label: 'Contacts', icon: 'fa-address-book', color: 'text-cyan-500' },
        { id: 'saved', label: 'Saved Items', icon: 'fa-bookmark', color: 'text-purple-600' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { id: 'profile', label: 'My Profile', icon: 'fa-user-astronaut', color: 'text-pink-500' },
        { id: 'settings', label: 'Settings', icon: 'fa-gear', color: 'text-zinc-500' },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'safety_hub', label: 'Safety Hub', icon: 'fa-shield-halved', color: 'text-rose-500' },
        { id: 'help', label: 'Help Center', icon: 'fa-circle-question', color: 'text-blue-400' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-[#fcfcfc] animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center space-x-3">
           <img src={currentUser?.avatar} className="w-10 h-10 rounded-xl border border-zinc-200" alt="Profile" />
           <div>
              <h3 className="font-black text-sm text-zinc-900">{currentUser?.displayName}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Menu</p>
           </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500 hover:bg-zinc-100"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-24">
         {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-3">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">{group.title}</h4>
               <div className="grid grid-cols-2 gap-3">
                  {group.items.map(item => (
                     <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as TabType); onClose(); }}
                        className={`flex items-center p-4 rounded-2xl border transition-all text-left space-x-3 ${
                           activeTab === item.id 
                              ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' 
                              : 'bg-white border-zinc-100 hover:border-zinc-200 shadow-sm'
                        }`}
                     >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm text-sm ${
                           activeTab === item.id ? 'bg-white/20 border-white/10 text-white' : `bg-white border-zinc-50 ${item.color}`
                        }`}>
                           <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <span className={`text-xs font-black ${activeTab === item.id ? 'text-white' : 'text-zinc-600'}`}>{item.label}</span>
                     </button>
                  ))}
               </div>
            </div>
         ))}

         {isAdmin && (
            <button
               onClick={() => { setActiveTab('admin'); onClose(); }}
               className="w-full flex items-center p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600"
            >
               <div className="w-8 h-8 rounded-lg bg-white border border-red-100 flex items-center justify-center mr-3">
                  <i className="fa-solid fa-gauge-high"></i>
               </div>
               <span className="text-xs font-black uppercase tracking-widest">Admin Dashboard</span>
            </button>
         )}

         <div className="pt-4 space-y-4">
            <button 
               onClick={logout}
               className="w-full py-4 bg-zinc-100 text-zinc-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200"
            >
               Sign Out
            </button>
         </div>
      </div>
    </div>
  );
};

export default MobileMenu;
