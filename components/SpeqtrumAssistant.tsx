
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAuth } from '../context/AuthContext';

const SpeqtrumAssistant: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `You are 'Speqtrum Assistant', a witty, empathetic, and helpful AI companion for a social companionship and connection app. 
          Your goal is to help ${currentUser?.displayName} find meaningful connections. 
          You give companionship advice, rewrite profile bios to be more authentic/engaging, suggest icebreakers, and explain community safety. 
          Stay supportive, inclusive, and keep responses under 3 sentences unless asked for a rewrite.`,
        }
      });

      const response = await chat.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm drawing a blank, hun. Try asking that another way!" }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I hit a snag. Let's try again in a bit!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 sm:bottom-12 sm:right-12 z-[400] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-3rem)] sm:w-96 bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden mb-6 animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 max-h-[60vh]">
          <header className="p-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-xl">
                 <i className="fa-solid fa-wand-sparkles text-white"></i>
               </div>
               <div>
                 <h3 className="font-black text-sm">Speqtrum Assistant</h3>
                 <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Your AI Companion</p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar bg-black/20">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-4">
                 <p className="text-sm text-gray-500 italic">"Hey ${currentUser?.displayName}! Want me to polish your bio or suggest a killer icebreaker?"</p>
                 <div className="flex flex-wrap justify-center gap-2">
                    {['Rewrite my bio', 'Suggest icebreaker', 'Connection advice'].map(tip => (
                      <button 
                        key={tip} 
                        onClick={() => { setInput(tip); handleSend(); }}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                      >
                        {tip}
                      </button>
                    ))}
                 </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-white/10 text-white rounded-tr-none border border-white/5' 
                    : 'bg-purple-600/20 text-purple-100 rounded-tl-none border border-purple-500/20'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-purple-600/10 p-4 rounded-3xl rounded-tl-none border border-purple-500/20 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5">
            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-purple-500 transition-colors">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for advice..."
                className="flex-1 bg-white/10 dark:bg-transparent border-none focus:ring-0 text-sm px-3 text-black font-black dark:text-white placeholder:text-gray-500"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all disabled:opacity-50"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-zinc-800 border border-white/10 rotate-90 text-gray-400' 
            : 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20 pointer-events-none"></div>
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-wand-magic-sparkles'} text-2xl`}></i>
      </button>
    </div>
  );
};

export default SpeqtrumAssistant;
