
import React, { useState } from 'react';

const FAQ_ITEMS = [
  { 
    q: "How does AI Matching work?", 
    a: "We use high-security generative models to analyze bio intent, shared interests, and personality vibes. The 'Vibe Check' isn't just data—it's an AI interpretation of how your energy matches with others."
  },
  {
    q: "What is Speqtrum Safe Passage?",
    a: "Safe Passage uses real-time Google Maps grounding to find vetted social spots, community centers, and safe havens worldwide. It's designed to keep you safe while traveling or exploring locally."
  },
  {
    q: "How do I verify my account?",
    a: "You can use Selfie Verification or Government ID verification in your profile settings. Verified accounts receive trust badges and higher visibility in the discovery feed."
  },
  {
    q: "Is Speqtrum really secure?",
    a: "Yes. All chats are end-to-end encrypted. We employ real-time AI moderation to block harassment before it reaches you. Plus, our 'Panic Button' instantly hides your active session."
  }
];

interface HelpPageProps {
  onBack?: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('faq');

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-16 animate-in fade-in duration-700 pb-24">
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
        <h1 className="text-5xl font-black tracking-tight">Help & Support</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm font-bold uppercase tracking-widest">Knowledge Base • Safety Resources • Community Growth</p>
      </header>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { id: 'faq', label: 'FAQ', icon: 'fa-circle-question' },
           { id: 'safety', label: 'Safety Hub', icon: 'fa-shield-halved' },
           { id: 'identity', label: 'Self Expression', icon: 'fa-user-pen' },
           { id: 'support', label: 'Contact Us', icon: 'fa-headset' }
         ].map(cat => (
           <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`p-6 rounded-3xl border transition-all text-center space-y-3 ${activeCategory === cat.id ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
           >
              <i className={`fa-solid ${cat.icon} text-2xl`}></i>
              <p className="text-[10px] font-black uppercase tracking-widest">{cat.label}</p>
           </button>
         ))}
      </div>

      {/* FAQ View */}
      {activeCategory === 'faq' && (
        <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
           <h3 className="text-2xl font-black mb-8 border-b border-white/5 pb-4">Frequently Asked Questions</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="space-y-3">
                   <h4 className="font-black text-purple-400">Q: {item.q}</h4>
                   <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* Safety View */}
      {activeCategory === 'safety' && (
        <section className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-[3rem] space-y-4">
              <h3 className="text-2xl font-black text-red-500 flex items-center">
                 <i className="fa-solid fa-triangle-exclamation mr-4"></i>
                 Crisis Support
              </h3>
              <p className="text-sm text-red-200 leading-relaxed">If you are in immediate danger or experiencing a mental health crisis, please contact local emergency services.</p>
              <button className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all">Emergency Resources</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4">
                 <h4 className="text-lg font-black uppercase">Reporting Abuse</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">We take harassment seriously. Use the 'Report' button on any profile or message. Our moderation team reviews all reports within 60 minutes.</p>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4">
                 <h4 className="text-lg font-black uppercase">Privacy Path</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">Your location is obfuscated by default. Use 'Incognito Mode' to browse profiles without leaving a trace.</p>
              </div>
           </div>
        </section>
      )}

      {/* Identity View */}
      {activeCategory === 'identity' && (
        <section className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 text-center max-w-2xl mx-auto">
           <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center text-4xl text-purple-400 mx-auto">
              <i className="fa-solid fa-fingerprint"></i>
           </div>
           <h3 className="text-4xl font-black">Express Yourself</h3>
           <p className="text-gray-400 leading-relaxed italic">"Speqtrum is a place for authentic connection. We believe in self-identification and the power of finding people who truly get you."</p>
           
           <div className="text-left space-y-8">
              <div className="space-y-2">
                 <h4 className="font-black text-sm uppercase text-purple-400">Authentic Profiles</h4>
                 <p className="text-sm text-gray-500">Your profile is your canvas. Share your true interests, lifestyle choices, and relationship goals to attract the right vibe.</p>
              </div>
              <div className="space-y-2">
                 <h4 className="font-black text-sm uppercase text-purple-400">Inclusive Community</h4>
                 <p className="text-sm text-gray-500">We support diverse relationship styles and identities, fostering a space for friendship, dating, and everything in between.</p>
              </div>
           </div>
        </section>
      )}

      {/* Contact View */}
      {activeCategory === 'support' && (
        <section className="max-w-md mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 text-center">
           <h3 className="text-3xl font-black">Get in Touch</h3>
           <p className="text-gray-500 text-sm">Have an issue or feedback? Our team is here to help 24/7.</p>
           
           <div className="space-y-4">
              <button className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center space-x-3">
                 <i className="fa-solid fa-envelope"></i>
                 <span>EMAIL SUPPORT</span>
              </button>
              <button className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3">
                 <i className="fa-solid fa-comment-dots"></i>
                 <span>LIVE CHAT</span>
              </button>
           </div>
           
           <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest pt-8">Response Time: Under 2 Hours</p>
        </section>
      )}
    </div>
  );
};

export default HelpPage;
