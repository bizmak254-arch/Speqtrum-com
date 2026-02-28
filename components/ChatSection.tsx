
import React, { useState, useEffect, useRef } from 'react';
import MatchGallery from './MatchGallery';
import LiveCallOverlay from './LiveCallOverlay';
import { socketService } from '../services/socketService';
import { useAuth } from '../context/AuthContext';
import { checkMessageSafety } from '../services/moderationService';

interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  isRead: boolean;
  senderName?: string;
  flagged?: boolean;
  attachment?: {
    type: 'image' | 'document';
    url: string;
    name?: string;
  };
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isGroup?: boolean;
  memberCount?: number;
}

const INITIAL_CHATS: Chat[] = [
  { id: 'c1', name: 'Luca', avatar: 'https://picsum.photos/seed/luca/100', status: 'online' },
  { id: 'c2', name: 'Skyler', avatar: 'https://picsum.photos/seed/skyler/100', status: 'offline' },
  { id: 'c3', name: 'Nico', avatar: 'https://picsum.photos/seed/nico/100', status: 'online' },
  { id: 'g1', name: 'Queer Creators', avatar: 'https://picsum.photos/seed/art/100', status: '840 online', isGroup: true },
];

// Fallback data to hydrate chats if coming from Contacts page with an ID not in INITIAL_CHATS
const USER_DATABASE: Record<string, Chat> = {
  's1': { id: 's1', name: 'Zane', avatar: 'https://picsum.photos/seed/zane/100', status: 'online' },
  's2': { id: 's2', name: 'Sasha', avatar: 'https://picsum.photos/seed/sasha/100', status: 'away' },
  's3': { id: 's3', name: 'Morgan', avatar: 'https://picsum.photos/seed/morgan/100', status: 'offline' },
  's4': { id: 's4', name: 'Kai', avatar: 'https://picsum.photos/seed/kai/100', status: 'online' },
  's5': { id: 's5', name: 'Skyler', avatar: 'https://picsum.photos/seed/skyler/100', status: 'online' },
  's6': { id: 's6', name: 'Nico', avatar: 'https://picsum.photos/seed/nico/100', status: 'online' },
  'c1': { id: 'c1', name: 'Alex Thorne', status: 'Available', avatar: 'https://picsum.photos/seed/alex/100' },
  'c2': { id: 'c2', name: 'Zane', status: 'Busy', avatar: 'https://picsum.photos/seed/zane/100' },
  'c3': { id: 'c3', name: 'Sasha', status: 'Offline', avatar: 'https://picsum.photos/seed/sasha/100' },
  'c4': { id: 'c4', name: 'Kai', status: 'Traveling', avatar: 'https://picsum.photos/seed/kai/100' },
};

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'c1': [
    { id: 'm1', sender: 'them', text: 'Hey! Are we still meeting for the pride march? 🌈', time: '10:42 PM', isRead: true },
    { id: 'm2', sender: 'me', text: 'Yes! See you there at 11am.', time: '10:45 PM', isRead: true },
  ]
};

const AUTO_RESPONSES = [
  "That sounds amazing! tell me more.",
  "I was just thinking about that. ✨",
  "Haha, you're hilarious!",
  "Are you free this weekend?",
  "Sent you a photo!",
  "Can't wait to see you.",
  "Totally agree with you on that.",
  "Let's catch up on a video call soon?"
];

interface ChatSectionProps {
  initialUserId?: string | null;
  onChatConsumed?: () => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({ initialUserId, onChatConsumed }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = useState<string | null>(initialUserId || 'c1');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [showAttachments, setShowAttachments] = useState(false);
  const [activeCall, setActiveCall] = useState<{ match: Chat, mode: 'voice' | 'video' } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 0. Socket Connection
  useEffect(() => {
    socketService.connect();
    
    socketService.onMessage((data) => {
      // Only add if it's not from me (since we add "me" messages optimistically)
      if (data.senderId !== currentUser?.id) {
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'them',
          text: data.text,
          time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
          flagged: data.flagged
        };
        
        setMessages(prev => ({
          ...prev,
          [data.roomId]: [...(prev[data.roomId] || []), newMsg]
        }));
      }
    });

    return () => {
      socketService.offMessage();
    };
  }, [currentUser]);

  // 1. Handle Deep Linking / Selection from Contacts
  useEffect(() => {
    if (initialUserId) {
      // Check if chat exists in current list
      const existingChat = chats.find(c => c.id === initialUserId);
      
      if (existingChat) {
        setSelectedChat(initialUserId);
      } else {
        // If not, try to find in "Database" or create a temp one
        const user = USER_DATABASE[initialUserId] || { 
          id: initialUserId, 
          name: 'New Contact', 
          avatar: `https://picsum.photos/seed/${initialUserId}/100`, 
          status: 'online' 
        };
        
        // Add to chat list and select
        setChats(prev => [user, ...prev]);
        setSelectedChat(initialUserId);
      }

      if (onChatConsumed) onChatConsumed();
    }
  }, [initialUserId]);

  // Join room when selectedChat changes and fetch history
  useEffect(() => {
    if (selectedChat) {
      socketService.joinRoom(selectedChat);
      
      // Fetch history
      fetch(`/api/messages/${selectedChat}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const formattedMessages: ChatMessage[] = data.map(m => ({
              id: m.id,
              sender: m.senderId === currentUser?.id ? 'me' : 'them',
              text: m.text,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isRead: true,
              flagged: m.flagged
            }));
            
            setMessages(prev => ({
              ...prev,
              [selectedChat]: formattedMessages
            }));
          }
        })
        .catch(err => console.error("Failed to fetch message history:", err));
    }
  }, [selectedChat, currentUser]);

  // 2. Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [selectedChat, messages, isTyping]);

  // 3. Automatic Response System (Keep for demo purposes, but now it's "real-time" simulated)
  useEffect(() => {
    if (!selectedChat) return;
    
    const currentChatMsgs = messages[selectedChat] || [];
    const lastMsg = currentChatMsgs[currentChatMsgs.length - 1];

    // Only trigger auto-response if it's a mock chat (not a real socket room in a real app)
    // For this demo, we'll keep it but it will now "broadcast" via socket too
    if (lastMsg && lastMsg.sender === 'me' && selectedChat.startsWith('c')) {
      setIsTyping(true);
      const delay = Math.random() * 2000 + 1000; // 1-3 seconds delay

      const timeout = setTimeout(() => {
        const responseText = AUTO_RESPONSES[Math.floor(Math.random() * AUTO_RESPONSES.length)];
        
        // Emit via socket so other "clients" (if any) see it
        socketService.sendMessage(selectedChat, 'them_bot', responseText);
        
        setIsTyping(false);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [messages, selectedChat]);

  const handleSendMessage = async (attachment?: ChatMessage['attachment']) => {
    if (!selectedChat || (!inputValue.trim() && !attachment)) return;
    
    setIsModerating(true);
    const safetyCheck = await checkMessageSafety(inputValue);
    setIsModerating(false);

    if (safetyCheck.suggestedAction === 'block') {
      alert(`Message blocked by AI: ${safetyCheck.reason}`);
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      flagged: safetyCheck.suggestedAction === 'warn',
      attachment
    };

    // Optimistic update
    setMessages(prev => ({ ...prev, [selectedChat]: [...(prev[selectedChat] || []), newMessage] }));
    
    // Send via socket
    socketService.sendMessage(selectedChat, currentUser?.id || 'me', inputValue, safetyCheck.suggestedAction === 'warn');

    setInputValue('');
    setShowAttachments(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleSendMessage({ type, url, name: file.name });
    }
  };

  const currentChatData = chats.find(c => c.id === selectedChat);
  const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

  return (
    <div className="h-full flex overflow-hidden">
      {/* Hidden inputs for attachments */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
      <input type="file" ref={docInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'document')} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => handleFileUpload(e, 'image')} />

      {/* List */}
      <div className={`w-full lg:w-96 border-r border-white/10 flex flex-col ${selectedChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/10"><h2 className="text-xl font-black">Messages</h2></div>
        <MatchGallery />
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {chats.map(chat => (
            <button key={chat.id} onClick={() => setSelectedChat(chat.id)} className={`w-full p-4 flex items-center space-x-4 hover:bg-white/5 transition-colors border-l-4 ${selectedChat === chat.id ? 'border-purple-500 bg-white/5' : 'border-transparent'}`}>
              <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-gray-100 truncate">{chat.name}</p>
                <p className="text-sm text-gray-500 truncate">{chat.status}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main View */}
      <div className={`flex-1 flex flex-col bg-zinc-950 ${!selectedChat ? 'hidden lg:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedChat(null)} className="lg:hidden p-2 text-gray-400"><i className="fa-solid fa-chevron-left"></i></button>
                <img src={currentChatData?.avatar} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-sm">{currentChatData?.name}</h3>
                  {isTyping && <p className="text-[10px] text-purple-400 font-bold animate-pulse">typing...</p>}
                  {isModerating && <p className="text-[10px] text-blue-400 font-bold animate-pulse">AI scanning...</p>}
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
               {currentMessages.length === 0 && (
                 <div className="text-center py-10 text-gray-500 text-sm italic">
                   Start the conversation with {currentChatData?.name}...
                 </div>
               )}
               {currentMessages.map(msg => (
                 <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`p-3 max-w-[80%] rounded-2xl relative ${
                      msg.sender === 'me' 
                        ? msg.flagged ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-purple-600 text-white rounded-tr-none' 
                        : msg.flagged ? 'bg-red-900/40 text-gray-200 rounded-tl-none border border-red-500/30' : 'bg-white/10 text-gray-200 rounded-tl-none'
                    }`}>
                       {msg.flagged && (
                         <div className="flex items-center space-x-1 text-[8px] font-black uppercase tracking-widest mb-1 text-white/70">
                           <i className="fa-solid fa-triangle-exclamation"></i>
                           <span>AI Flagged</span>
                         </div>
                       )}
                       {msg.attachment?.type === 'image' && <img src={msg.attachment.url} className="max-w-xs rounded-lg mb-2" />}
                       {msg.attachment?.type === 'document' && (
                         <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-xl mb-2">
                           <i className="fa-solid fa-file-pdf text-red-400"></i>
                           <span className="text-xs truncate">{msg.attachment.name}</span>
                         </div>
                       )}
                       {msg.text && <p className="text-sm">{msg.text}</p>}
                       <span className="text-[8px] opacity-50 block text-right mt-1 uppercase">{msg.time}</span>
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start animate-in fade-in">
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none flex space-x-1">
                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
               )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-black/50 relative border-t border-white/10">
               {showAttachments && (
                <div className="absolute bottom-20 left-4 bg-zinc-900 border border-white/10 rounded-3xl p-4 grid grid-cols-3 gap-4 shadow-2xl z-50 animate-in slide-in-from-bottom-4 duration-300">
                   <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center space-y-2 group">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"><i className="fa-solid fa-camera"></i></div>
                      <span className="text-[10px] font-black uppercase text-gray-500">Camera</span>
                   </button>
                   <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center space-y-2 group">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"><i className="fa-solid fa-image"></i></div>
                      <span className="text-[10px] font-black uppercase text-gray-500">Gallery</span>
                   </button>
                   <button onClick={() => docInputRef.current?.click()} className="flex flex-col items-center space-y-2 group">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"><i className="fa-solid fa-file-pdf"></i></div>
                      <span className="text-[10px] font-black uppercase text-gray-500">Document</span>
                   </button>
                </div>
              )}

              <div className="flex items-center space-x-2 bg-white/5 rounded-[2.5rem] border border-white/10 p-2 focus-within:border-purple-500 transition-all">
                <button 
                  onClick={() => setShowAttachments(!showAttachments)} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-purple-400 transition-all ${showAttachments ? 'rotate-45 text-purple-400' : ''}`}
                >
                  <i className="fa-solid fa-plus text-lg"></i>
                </button>

                <div className="flex-1">
                  <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                    placeholder="Type a message..." 
                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-1 text-white outline-none" 
                  />
                </div>
                
                <div className="flex items-center space-x-1">
                  {!inputValue.trim() ? (
                    <>
                      <button 
                        onClick={() => currentChatData && setActiveCall({ match: currentChatData, mode: 'video' })} 
                        className="w-10 h-10 text-blue-400 hover:bg-white/10 rounded-full flex items-center justify-center"
                        title="Video Call"
                      >
                        <i className="fa-solid fa-video"></i>
                      </button>
                      <button 
                        onClick={() => currentChatData && setActiveCall({ match: currentChatData, mode: 'voice' })} 
                        className="w-10 h-10 text-green-400 hover:bg-white/10 rounded-full flex items-center justify-center"
                        title="Voice Call"
                      >
                        <i className="fa-solid fa-phone"></i>
                      </button>
                      <button 
                        className="w-10 h-10 text-gray-400 hover:bg-white/10 rounded-full flex items-center justify-center"
                        title="Microphone"
                      >
                        <i className="fa-solid fa-microphone"></i>
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleSendMessage()} 
                      className="w-10 h-10 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-all mr-1"
                    >
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 space-y-4">
            <i className="fa-solid fa-comments text-5xl"></i>
            <p className="text-sm font-black uppercase tracking-widest">Select a chat to begin</p>
          </div>
        )}
      </div>

      {activeCall && <LiveCallOverlay match={activeCall.match} mode={activeCall.mode} onClose={() => setActiveCall(null)} />}
    </div>
  );
};

export default ChatSection;
