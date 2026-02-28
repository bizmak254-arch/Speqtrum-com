import React, { useState } from 'react';
import GiftModal from '../components/GiftModal';
import { useAuth } from '../context/AuthContext';

const StreamPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [comments, setComments] = useState([
    { user: 'User1', text: 'Hi 👋' },
    { user: 'User2', text: 'Amazing stream 🔥' }
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setComments([...comments, { user: currentUser?.displayName || 'You', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="h-full bg-[#121212] text-white flex flex-col">
      <header className="px-6 py-4 border-b border-white/10 bg-[#1e1e1e] font-bold text-lg sticky top-0 z-10">
        LIVE STREAMING
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6 overflow-hidden">
        
        {/* VIDEO AREA */}
        <section className="bg-[#1f1f1f] p-6 rounded-2xl flex flex-col h-full overflow-y-auto">
          <div className="bg-black rounded-xl h-[360px] md:h-[480px] flex items-center justify-center text-gray-500 font-bold text-xl mb-6 relative overflow-hidden">
             <img src="https://picsum.photos/seed/live/1200/800" className="absolute inset-0 w-full h-full object-cover opacity-50" />
             <span className="relative z-10 bg-red-600 text-white px-3 py-1 rounded text-sm uppercase tracking-widest">LIVE VIDEO</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Stream Title</h2>
            <p className="text-gray-400 text-sm mb-2">Hosted by Creator Name</p>
            <span className="bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-gray-300">
               <i className="fa-solid fa-eye mr-2"></i> 1,245 watching
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowGiftModal(true)}
              className="bg-[#ff4081] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#e91e63] transition-colors"
            >
              Tip
            </button>
            <button className="bg-[#6a1b9a] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#7b1fa2] transition-colors">
              Subscribe
            </button>
            <button className="bg-gradient-to-br from-[#ff4081] to-[#6a1b9a] text-white px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity">
              Private Show
            </button>
          </div>
        </section>

        {/* CHAT */}
        <aside className="bg-[#1e1e1e] p-4 rounded-2xl flex flex-col h-[400px] lg:h-full">
          <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Live Chat</h3>
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2 no-scrollbar">
            {comments.map((c, i) => (
              <p key={i} className="text-sm">
                <strong className="text-gray-300 mr-2">{c.user}:</strong>
                <span className="text-gray-400">{c.text}</span>
              </p>
            ))}
          </div>
          <form onSubmit={handleSendChat}>
            <input 
              type="text" 
              placeholder="Say something..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white p-3 rounded-lg border-none focus:ring-2 focus:ring-[#ff4081] text-sm"
            />
          </form>
        </aside>

      </main>

      {showGiftModal && (
        <GiftModal 
          recipientName="Creator Name" 
          onClose={() => setShowGiftModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default StreamPage;
