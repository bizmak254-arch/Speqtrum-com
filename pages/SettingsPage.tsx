
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface SettingsPageProps {
  onBack: () => void;
  onSave?: () => void;
  onPanic: () => void;
}

type SettingCategory = 'account' | 'privacy' | 'notifications' | 'language' | 'appearance';

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onSave, onPanic }) => {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('account');
  const [muted, setMuted] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const categories = [
    { id: 'account', label: 'My Account', icon: 'fa-user-gear' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'fa-shield-halved' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
    { id: 'language', label: 'Language', icon: 'fa-language' },
    { id: 'appearance', label: 'Appearance', icon: 'fa-palette' },
  ];

  const languages = ['English', 'Español', 'Français', 'Deutsch', 'Swahili', 'Português', '日本語'];

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#fcfcfc]">
      {/* Settings Navigation */}
      <div className="w-full md:w-80 border-r border-zinc-200 bg-white flex flex-col p-6 space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="text-xl font-black text-zinc-900">Settings</h2>
        </div>

        <div className="space-y-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as SettingCategory)}
              className={`w-full flex items-center p-4 rounded-2xl transition-all ${
                activeCategory === cat.id ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <i className={`fa-solid ${cat.icon} w-6 text-center`}></i>
              <span className="ml-3 text-xs font-black uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
        </div>
        
        {/* Panic Button in Menu */}
        <div className="mt-auto pt-6 border-t border-zinc-100">
           <button 
             onClick={onPanic}
             className="w-full py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center space-x-3 shadow-lg"
           >
             <i className="fa-solid fa-triangle-exclamation"></i>
             <span>Panic Button</span>
           </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
        <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
          
          {activeCategory === 'account' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-zinc-900">Account Management</h3>
              <div className="bg-white border border-zinc-100 rounded-3xl p-8 space-y-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <img src={currentUser?.avatar} className="w-16 h-16 rounded-2xl border-2 border-zinc-50" />
                  <div>
                    <p className="font-black text-lg text-zinc-900">{currentUser?.displayName}</p>
                    <p className="text-xs text-zinc-500">{currentUser?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <button className="w-full py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 text-zinc-600">Change Email</button>
                  <button className="w-full py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 text-zinc-600">Update Password</button>
                  <button className="w-full py-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white shadow-sm">Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'appearance' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-zinc-900">Display Customization</h3>
              <div className="bg-white border border-zinc-100 rounded-3xl p-8 flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-black text-sm uppercase text-zinc-900">Light Mode (Pristine)</p>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Default high-visibility theme</p>
                </div>
                <button 
                  onClick={() => setNightMode(!nightMode)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${!nightMode ? 'bg-orange-600' : 'bg-zinc-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${!nightMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                 {['Purple', 'Pink', 'Blue'].map(color => (
                    <button key={color} className="p-4 bg-white border border-zinc-100 rounded-2xl flex flex-col items-center space-y-2 shadow-sm hover:border-orange-300 transition-all group">
                       <div className={`w-6 h-6 rounded-full bg-${color.toLowerCase()}-500 shadow-md`}></div>
                       <span className="text-[8px] font-black uppercase text-zinc-500 group-hover:text-zinc-900">{color} Theme</span>
                    </button>
                 ))}
              </div>
            </div>
          )}

          {activeCategory === 'privacy' && (
             <div className="space-y-8">
                <h3 className="text-2xl font-black text-zinc-900">Privacy & Security</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Two-Factor Authentication', desc: 'Secure your login with an extra layer', active: true },
                    { label: 'Profile Visibility', desc: 'Limit profile views to verified members', active: false },
                    { label: 'Read Receipts', desc: 'Let others know when you read messages', active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm">
                      <div>
                        <p className="font-black text-sm uppercase text-zinc-900">{item.label}</p>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold">{item.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative transition-colors ${item.active ? 'bg-orange-600' : 'bg-zinc-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
