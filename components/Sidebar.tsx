import React from 'react';
import { TabType } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const quickAccess = [
    { id: 'feed', label: 'My Feed', icon: 'fa-house' },
    { id: 'community', label: 'Communities', icon: 'fa-users' },
    { id: 'channels', label: 'Channels', icon: 'fa-bullhorn' },
    { id: 'chat', label: 'Messages', icon: 'fa-comment-dots' },
    { id: 'calls', label: 'Calls', icon: 'fa-phone' },
    { id: 'contacts', label: 'Contacts', icon: 'fa-address-book' },
    { id: 'saved', label: 'Saved', icon: 'fa-bookmark' },
    { id: 'tips', label: 'Wallet', icon: 'fa-wallet' },
    { id: 'history', label: 'History', icon: 'fa-clock-rotate-left' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' },
  ];

  return (
    <aside className="bg-white dark:bg-[#181818] p-5 min-h-screen border-r border-zinc-200 dark:border-white/5 w-[220px] shrink-0 hidden md:block sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto no-scrollbar transition-colors duration-300">
      <div className="mb-8 px-2">
        <Logo className="w-8 h-8" textClassName="text-lg" />
      </div>
      
      <h4 className="text-zinc-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 px-2">Quick Access</h4>
      <ul className="space-y-1">
        {quickAccess.map((item) => (
          <li 
            key={item.id}
            onClick={() => setActiveTab(item.id as TabType)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
              activeTab === item.id 
                ? 'bg-zinc-100 dark:bg-[#2a2a2a] text-[#ff4da6]' 
                : 'text-zinc-500 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center text-sm`}></i>
            <span className="text-sm font-medium">{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/5">
        <h4 className="text-zinc-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 px-2">Your Groups</h4>
        <ul className="space-y-1">
          {['Tech & Gaming', 'Travel Squad', 'Night Owls'].map((group, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-zinc-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#2a2a2a] transition-colors">
              <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-gray-600"></span>
              <span className="text-sm">{group}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
