
import React, { useState } from 'react';

interface InviteFriendsProps {
  onBack?: () => void;
}

const InviteFriends: React.FC<InviteFriendsProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://speqtrum.com/join/alex_777";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialActions = [
    { id: 'whatsapp', name: 'WhatsApp', icon: 'fa-whatsapp', color: 'bg-[#25D366]', text: 'text-white' },
    { id: 'instagram', name: 'Instagram', icon: 'fa-instagram', color: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]', text: 'text-white' },
    { id: 'facebook', name: 'Facebook', icon: 'fa-facebook-f', color: 'bg-[#1877F2]', text: 'text-white' },
    { id: 'telegram', name: 'Telegram', icon: 'fa-telegram-plane', color: 'bg-[#0088cc]', text: 'text-white' },
    { id: 'messenger', name: 'Messenger', icon: 'fa-facebook-messenger', color: 'bg-[#006AFF]', text: 'text-white' }
  ];

  const handleShare = (provider: string) => {
    // In a real app, these would open sharing intents
    const text = encodeURIComponent(`Hey! Join me on Speqtrum, the best social connection community! ${inviteLink}`);
    let url = "";
    
    switch (provider) {
      case 'whatsapp': url = `https://wa.me/?text=${text}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${inviteLink}`; break;
      case 'telegram': url = `https://t.me/share/url?url=${inviteLink}&text=${text}`; break;
      default: alert(`Opening ${provider} share intent...`); return;
    }
    
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-start">
        {onBack && (
          <button 
            onClick={onBack}
            className="group flex items-center space-x-2 text-gray-500 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Back Home</span>
          </button>
        )}
      </div>

      <header className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <i className="fa-solid fa-users-plus"></i>
          <span>Grow your Network</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter">Invite Your Friends</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">
          Speqtrum is better with your crew. Invite your network and earn <span className="text-purple-400 font-bold">Gold Points</span> for every verified join.
        </p>
      </header>

      {/* Referral Link Box */}
      <section className="bg-zinc-900 border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50"></div>
        <div className="relative space-y-6">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">Your Personal Referral Link</h3>
           <div className="flex items-center space-x-4 bg-black/40 border border-white/10 p-2 rounded-2xl shadow-inner group-focus-within:border-purple-500/50 transition-all">
              <div className="flex-1 px-4 text-sm font-bold text-gray-300 truncate">
                {inviteLink}
              </div>
              <button 
                onClick={handleCopy}
                className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-green-600 text-white' : 'bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'}`}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
           </div>
        </div>
      </section>

      {/* Social Grid */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">Share Directly Via</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialActions.map(social => (
            <button
              key={social.id}
              onClick={() => handleShare(social.id)}
              className={`flex items-center justify-between p-6 rounded-3xl border border-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-95 transition-all group ${social.color}`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                  <i className={`fa-brands ${social.icon} text-white`}></i>
                </div>
                <span className={`font-black uppercase text-xs tracking-widest ${social.text}`}>{social.name}</span>
              </div>
              <i className={`fa-solid fa-chevron-right text-xs opacity-50 group-hover:translate-x-1 transition-transform ${social.text}`}></i>
            </button>
          ))}
          
          <button
            onClick={() => handleShare('native')}
            className="flex items-center justify-between p-6 rounded-3xl border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500 hover:border-yellow-500 hover:scale-[1.02] active:scale-95 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-xl group-hover:bg-black transition-colors">
                <i className="fa-solid fa-share-nodes text-black group-hover:text-yellow-500 transition-colors"></i>
              </div>
              <span className="font-black uppercase text-xs tracking-widest text-yellow-500 group-hover:text-black transition-colors">Other Apps</span>
            </div>
            <i className="fa-solid fa-chevron-right text-xs opacity-50 group-hover:translate-x-1 transition-transform text-yellow-500 group-hover:text-black"></i>
          </button>
        </div>
      </section>

      {/* Perks Info */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        {[
          { icon: 'fa-crown', title: 'Earn Gold', desc: 'Get 50 points for every friend who verifies their profile.' },
          { icon: 'fa-shield-heart', title: 'Build Trust', desc: 'Vetted communities are safer communities. Help us grow responsibly.' },
          { icon: 'fa-gift', title: 'Unlocks', desc: 'Invite 5 friends to unlock the "Community Pillar" limited badge.' }
        ].map((perk, i) => (
          <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center space-y-3">
             <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mx-auto text-xl">
                <i className={`fa-solid ${perk.icon}`}></i>
             </div>
             <h4 className="font-black text-xs uppercase tracking-widest">{perk.title}</h4>
             <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase">{perk.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default InviteFriends;
