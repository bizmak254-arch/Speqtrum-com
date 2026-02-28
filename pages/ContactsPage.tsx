
import React, { useState } from 'react';

const MOCK_CONTACTS = [
  { id: 'c1', name: 'Alex Thorne', status: 'Available', avatar: 'https://picsum.photos/seed/alex/100' },
  { id: 'c2', name: 'Zane', status: 'Busy', avatar: 'https://picsum.photos/seed/zane/100' },
  { id: 'c3', name: 'Sasha', status: 'Offline', avatar: 'https://picsum.photos/seed/sasha/100' },
  { id: 'c4', name: 'Kai', status: 'Traveling', avatar: 'https://picsum.photos/seed/kai/100' },
];

interface ContactsPageProps {
  onBack: () => void;
  onChat?: (userId: string) => void;
}

const ContactsPage: React.FC<ContactsPageProps> = ({ onBack, onChat }) => {
  const [search, setSearch] = useState('');
  
  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      <header className="p-8 border-b border-white/10 shrink-0">
        <h1 className="text-3xl font-black mb-6">Contacts</h1>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input 
            type="text" 
            placeholder="Search contacts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-purple-500 transition-all"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {MOCK_CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(contact => (
          <div key={contact.id} className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
              <img src={contact.avatar} className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-sm">{contact.name}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{contact.status}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onChat && onChat(contact.id)}
                className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-lg"
                title="Message"
              >
                <i className="fa-solid fa-comment"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPage;
