
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { User } from '../types';

interface SearchResult {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  interests: string[];
  distance: number; // in miles
}

const MOCK_RESULTS: SearchResult[] = [
  { id: 's1', name: 'Zane', age: 26, avatar: 'https://picsum.photos/seed/zane/100', bio: 'Techno lover & hiking enthusiast.', interests: ['Music', 'Outdoors'], distance: 2 },
  { id: 's2', name: 'Sasha', age: 24, avatar: 'https://picsum.photos/seed/sasha/100', bio: 'Creative coder living life in color.', interests: ['Coding', 'Art'], distance: 5 },
  { id: 's3', name: 'Morgan', age: 30, avatar: 'https://picsum.photos/seed/morgan/100', bio: 'Bookworm looking for a cozy companion.', interests: ['Reading', 'Cooking'], distance: 12 },
  { id: 's4', name: 'Kai', age: 22, avatar: 'https://picsum.photos/seed/kai/100', bio: 'Just here for the good vibes and coffee.', interests: ['Travel', 'Music'], distance: 1 },
  { id: 's5', name: 'Skyler', age: 28, avatar: 'https://picsum.photos/seed/skyler/100', bio: 'Fitness junkie & amateur photographer.', interests: ['Fitness', 'Photography'], distance: 8 },
  { id: 's6', name: 'Nico', age: 27, avatar: 'https://picsum.photos/seed/nico/100', bio: 'Night owl and gamer.', interests: ['Gaming', 'Nightlife'], distance: 15 },
];

interface UserSearchProps {
  onOpenChat: (userId: string) => void;
  onBack?: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onOpenChat, onBack }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(MOCK_RESULTS);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Advanced Filter State
  const [ageRange, setAgeRange] = useState({ min: 18, max: 50 });
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const availableInterests = ['Art', 'Music', 'Travel', 'Coding', 'Fitness', 'Gaming', 'Cooking', 'Nightlife', 'Outdoors'];
  const quickTags = ['Queer', 'Trans', 'Non-Binary', 'Gay', 'Lesbian', 'Artist', 'Tech', 'London', 'Berlin', 'NYC'];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      const filtered = MOCK_RESULTS.filter(u => {
        const matchesQuery = !query || 
          u.name.toLowerCase().includes(query.toLowerCase()) || 
          u.interests.some(i => i.toLowerCase().includes(query.toLowerCase())) ||
          u.bio.toLowerCase().includes(query.toLowerCase());

        const matchesAge = u.age >= ageRange.min && u.age <= ageRange.max;
        const matchesDistance = u.distance <= maxDistance;
        const matchesInterests = selectedInterests.length === 0 || 
          selectedInterests.every(interest => u.interests.includes(interest));

        return matchesQuery && matchesAge && matchesDistance && matchesInterests;
      });
      setResults(filtered);
      setIsSearching(false);
    }, 400);
  };

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch();
    };

    recognition.start();
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const appendQuickTag = (tag: string) => {
    setQuery(prev => prev ? `${prev} ${tag}` : tag);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [ageRange, maxDistance, selectedInterests]);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
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
        <h1 className="text-5xl font-black tracking-tight rainbow-text">Find Friends</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm font-bold uppercase tracking-widest">
          Connect with vetted members of the Speqtrum community
        </p>
      </header>

      {/* Main Search Bar with Voice Feature */}
      <section className="sticky top-0 z-20 pt-2 pb-4 bg-black/80 backdrop-blur-md">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors">
            <i className="fa-solid fa-magnifying-glass text-xl"></i>
          </div>
          <input 
            type="text" 
            value={query}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isListening ? "Listening..." : "Search by name, interest, or vibe..."}
            className={`w-full bg-white dark:bg-zinc-900 border-2 rounded-[2.5rem] py-6 pl-16 pr-56 text-lg text-black font-black dark:text-white placeholder:text-gray-500 focus:border-purple-500 outline-none transition-all shadow-2xl ${isListening ? 'border-red-500/50' : 'border-white/10'}`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {/* WhatsApp style Voice Recording Button */}
            <button 
              type="button"
              onClick={startVoiceRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-purple-400'}`}
              title="Voice Search"
            >
              <i className="fa-solid fa-microphone text-lg"></i>
            </button>
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-2xl border transition-all ${showFilters ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
              title="Advanced Filters"
            >
              <i className="fa-solid fa-sliders"></i>
            </button>
            <button 
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.05] text-white font-black px-8 py-4 rounded-2xl shadow-lg transition-all hidden sm:block"
            >
              {isSearching ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'SEARCH'}
            </button>
          </div>
        </form>

        {/* Custom Mobile/Tablet Quick-Tag Keyboard */}
        {isInputFocused && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] sm:hidden bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 p-4 animate-in slide-in-from-bottom-full duration-300">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quick Identity Keyboard</span>
                <button onClick={() => setIsInputFocused(false)} className="text-gray-400"><i className="fa-solid fa-chevron-down"></i></button>
             </div>
             <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                {quickTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => appendQuickTag(tag)}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white whitespace-nowrap active:scale-95 transition-all"
                  >
                    {tag}
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-6 p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Age Range</h4>
                  <span className="text-xs font-black text-purple-400">{ageRange.min} - {ageRange.max}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" min="18" max="80" value={ageRange.min} 
                    onChange={(e) => setAgeRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="flex-1 accent-purple-600 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                  <input 
                    type="range" min="18" max="80" value={ageRange.max} 
                    onChange={(e) => setAgeRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="flex-1 accent-purple-600 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Distance</h4>
                  <span className="text-xs font-black text-blue-400">Within {maxDistance} miles</span>
                </div>
                <input 
                  type="range" min="1" max="100" value={maxDistance} 
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-end justify-end">
                <button 
                  onClick={() => {
                    setAgeRange({ min: 18, max: 50 });
                    setMaxDistance(50);
                    setSelectedInterests([]);
                    setQuery('');
                  }}
                  className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Must have interests:</h4>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedInterests.includes(interest) 
                        ? 'bg-purple-600 border-purple-500 text-white' 
                        : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Results Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {results.length > 0 ? (
          results.map((user) => (
            <div key={user.id} className="bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden group hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
                  <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-black relative" />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full"></div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black">{user.name}, {user.age}</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Verified Member</p>
                    <span className="text-gray-700">•</span>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{user.distance} mi away</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 italic leading-relaxed">
                  "{user.bio}"
                </p>

                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {user.interests.map(i => (
                    <span key={i} className="text-[9px] font-black uppercase bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-500">
                      {i}
                    </span>
                  ))}
                </div>

                <div className="w-full pt-4 grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white text-black text-[10px] font-black py-3 rounded-xl hover:bg-gray-200 transition-colors uppercase">
                      Profile
                    </button>
                    <button className="bg-white/10 text-white text-[10px] font-black py-3 rounded-xl hover:bg-white/20 transition-colors uppercase">
                      Add
                    </button>
                  </div>
                  <button 
                    onClick={() => onOpenChat(user.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black py-3 rounded-xl hover:opacity-90 transition-all uppercase flex items-center justify-center space-x-2"
                  >
                    <i className="fa-solid fa-comment"></i>
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-3xl text-gray-700">
              <i className="fa-solid fa-user-slash"></i>
            </div>
            <h2 className="text-2xl font-black">No matches found</h2>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">Try adjusting your filters or searching for something else.</p>
            <button 
              onClick={() => {
                setAgeRange({ min: 18, max: 50 });
                setMaxDistance(50);
                setSelectedInterests([]);
                setQuery('');
              }}
              className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserSearch;
