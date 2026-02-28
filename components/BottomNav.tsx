
import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  onMenuClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onMenuClick }) => {
  const items: { id: TabType | 'menu'; icon: string; label: string; module: string }[] = [
    { id: 'feed', icon: 'fa-house', label: 'Social', module: 'Social Feed' },
    { id: 'dating_open', icon: 'fa-heart', label: 'Vibe', module: 'Dating' },
    { id: 'marketplace', icon: 'fa-store', label: 'Shop', module: 'Creator' },
    { id: 'live_feed', icon: 'fa-tower-broadcast', label: 'Live', module: 'Live' },
    { id: 'menu', icon: 'fa-bars', label: 'Menu', module: 'More' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xs px-4">
      <nav className="bg-zinc-900/90 backdrop-blur-xl text-white rounded-full shadow-2xl shadow-black/20 border border-white/10 px-6 py-3 flex items-center justify-between">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => item.id === 'menu' ? onMenuClick() : setActiveTab(item.id as TabType)}
            className={`flex flex-col items-center space-y-1 transition-all relative group ${
              activeTab === item.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              activeTab === item.id ? 'bg-white/20 scale-110' : ''
            }`}>
              <i className={`fa-solid ${item.icon} text-sm`}></i>
            </div>
            {activeTab === item.id && (
              <span className="absolute -bottom-6 text-[9px] font-black uppercase tracking-widest text-zinc-900 bg-white px-2 py-0.5 rounded-md shadow-sm animate-fade-in">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
