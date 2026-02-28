import React from 'react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  onSearch: () => void;
  onChat: () => void;
  onNotif: () => void;
  onProfile: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onSearch, onChat, onNotif, onProfile }) => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'feed': return 'Social Feed';
      case 'dating_open': return 'Open Connections';
      case 'dating_lgbtq': return 'LGBTQ+ Connections';
      case 'marketplace': return 'Creator Marketplace';
      case 'live_feed': return 'Live Streaming';
      case 'profile': return 'My Profile';
      case 'settings': return 'Settings';
      case 'community': return 'Communities';
      case 'chat': return 'Messages';
      case 'creator_studio': return 'Creator Studio';
      default: return activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('_', ' ');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => setActiveTab('feed')}
        >
          <Logo className="w-10 h-10" textClassName="text-xl hidden sm:inline" />
        </div>

        {/* Breadcrumb / Back Button */}
        {activeTab !== 'feed' && (
          <div className="flex items-center text-zinc-400 dark:text-zinc-500 text-sm font-medium">
            <span className="mx-2 text-zinc-300 dark:text-zinc-700">/</span>
            <button 
              onClick={() => setActiveTab('feed')}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="mx-2 text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-zinc-900 dark:text-white font-bold">{getBreadcrumb()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block group">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-full border border-zinc-200 dark:border-white/5 focus:border-zinc-400 dark:focus:border-white/20 focus:ring-0 text-sm w-64 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
            onClick={onSearch}
          />
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors text-xs"></i>
        </div>
        
        <button onClick={onChat} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white flex items-center justify-center transition-colors border border-zinc-200 dark:border-white/5">
          <i className="fa-solid fa-comment text-sm"></i>
        </button>
        
        <button onClick={onNotif} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white flex items-center justify-center transition-colors border border-zinc-200 dark:border-white/5 relative">
          <i className="fa-solid fa-bell text-sm"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-zinc-900"></span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white flex items-center justify-center transition-all border border-zinc-200 dark:border-white/5 group relative overflow-hidden"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <div className={`flex flex-col items-center transition-transform duration-500 ${theme === 'dark' ? '-translate-y-1/2' : 'translate-y-1/2'}`}>
            <i className="fa-solid fa-sun text-yellow-400 mb-4"></i>
            <i className="fa-solid fa-moon text-blue-400 mt-4"></i>
          </div>
        </button>
        
        <button onClick={onProfile} className="ml-2 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={currentUser?.avatar} className="w-8 h-8 rounded-full bg-zinc-700 object-cover border border-white/10" alt="" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
