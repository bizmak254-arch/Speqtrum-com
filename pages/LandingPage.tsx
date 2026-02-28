
import React, { useState } from 'react';
import LoginView from '../components/LoginView';
import Logo from '../components/Logo';

interface LandingPageProps {
  onAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginView onSuccess={onAuth} onBack={() => setShowLogin(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center space-x-2">
          <Logo className="w-8 h-8" textClassName="text-lg" />
        </div>
        <div className="flex items-center space-x-8">
           <button 
            onClick={() => setShowLogin(true)}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
           >
             Log in
           </button>
           <button 
            onClick={() => setShowLogin(true)}
            className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
           >
             Get Started
           </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter mb-8">
            COMPANIONSHIP<br />
            WITHOUT<br />
            LIMITS.
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-t border-white/20 pt-8">
            <p className="text-xl md:text-2xl font-medium max-w-xl leading-relaxed text-zinc-400">
              The premium destination for meaningful companionship, vibrant communities, and real-time interaction.
            </p>
            
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => setShowLogin(true)}
                className="group flex items-center space-x-4 text-left"
              >
                <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <i className="fa-solid fa-arrow-right text-xl -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                </div>
                <span className="text-lg font-bold tracking-wide">START EXPLORING</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Marquee */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">01 — Identity</div>
            <h3 className="text-3xl font-bold">Authentic Self.</h3>
            <p className="text-zinc-400 leading-relaxed">
              Express your true self. Our platform supports diverse interests, lifestyles, and connection goals without judgment.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">02 — Safety</div>
            <h3 className="text-3xl font-bold">Global Secure.</h3>
            <p className="text-zinc-400 leading-relaxed">
              Featuring Safe Passage—a Maps-grounded tool to find vetted social spots and safe havens anywhere on Earth.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">03 — AI</div>
            <h3 className="text-3xl font-bold">Smart Companion.</h3>
            <p className="text-zinc-400 leading-relaxed">
              End-to-end encrypted video and audio interactions with Speqtrum Muse, your real-time AI companion.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Simple */}
      <section className="py-32 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-24 text-center">MEMBERSHIP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-12 rounded-[2rem] bg-black border border-white/10 flex flex-col justify-between h-[500px] hover:border-white/30 transition-colors">
              <div>
                <div className="text-zinc-500 font-bold mb-4">STANDARD</div>
                <div className="text-5xl font-black mb-6">Free</div>
                <ul className="space-y-4 text-zinc-400">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>Core Profiles & Chat</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>AI Connection Access</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>Community Access</li>
                </ul>
              </div>
              <button onClick={() => setShowLogin(true)} className="w-full py-4 border border-white/20 rounded-xl font-bold hover:bg-white hover:text-black transition-all">
                Join Free
              </button>
            </div>

            <div className="p-12 rounded-[2rem] bg-white text-black flex flex-col justify-between h-[500px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-zinc-500 font-bold">GOLD</div>
                  <div className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Best Value</div>
                </div>
                <div className="text-5xl font-black mb-6">$14.99<span className="text-xl text-zinc-500 font-medium">/mo</span></div>
                <ul className="space-y-4 text-zinc-600 font-medium">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-full mr-3"></span>Global Passport Mode</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-full mr-3"></span>Incognito Browsing</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-full mr-3"></span>Unlimited AI Calls</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-black rounded-full mr-3"></span>Priority Verification</li>
                </ul>
              </div>
              <button onClick={() => setShowLogin(true)} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:opacity-80 transition-opacity">
                Upgrade to Gold
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" showText={false} />
            <span>© 2025 SPEQTRUM INC.</span>
          </div>
          <div className="flex space-x-8">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
