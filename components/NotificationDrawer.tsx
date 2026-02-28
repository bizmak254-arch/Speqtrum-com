
import React from 'react';

interface Notification {
  id: string;
  type: 'connection' | 'like' | 'safety' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFS: Notification[] = [
  { id: '1', type: 'connection', title: 'New Connection!', message: 'You and Skyler just connected. Say hi!', time: '2m ago', isRead: false },
  { id: '2', type: 'safety', title: 'Safety Alert', message: 'You are near a community-vetted safe space.', time: '15m ago', isRead: false },
  { id: '3', type: 'like', title: 'Someone liked you', message: 'Upgrade to Gold to see who it was!', time: '1h ago', isRead: true },
  { id: '4', type: 'system', title: 'Profile Tip', message: 'Your bio is 20% more likely to get connections with an Assistant rewrite.', time: '3h ago', isRead: true },
];

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-zinc-900 h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
          <h2 className="text-xl font-black">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          <div className="flex justify-between items-center px-2 mb-2">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recent Activity</span>
            <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-300">Mark all read</button>
          </div>

          {MOCK_NOTIFS.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 rounded-2xl border transition-all cursor-pointer group ${n.isRead ? 'bg-white/5 border-white/5' : 'bg-white/10 border-purple-500/30 shadow-lg shadow-purple-500/5'}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'connection' ? 'bg-pink-500/20 text-pink-500' :
                  n.type === 'safety' ? 'bg-blue-500/20 text-blue-500' :
                  n.type === 'like' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-white/10 text-gray-400'
                }`}>
                  <i className={`fa-solid ${
                    n.type === 'connection' ? 'fa-heart' :
                    n.type === 'safety' ? 'fa-shield-halved' :
                    n.type === 'like' ? 'fa-star' :
                    'fa-bell'
                  }`}></i>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm group-hover:text-purple-400 transition-colors">{n.title}</h4>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="p-6 border-t border-white/10 bg-black/20">
          <button className="w-full bg-transparent border-2 border-yellow-500 text-yellow-500 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-colors">
            View All History
          </button>
        </footer>
      </div>
    </div>
  );
};

export default NotificationDrawer;
