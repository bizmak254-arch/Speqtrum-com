
import React, { useState, useEffect } from 'react';
import { findSafeSpaces, SafetyHubResponse } from '../services/safetyService';

interface SafetyHubViewProps {
  onBack?: () => void;
}

const SafetyHubView: React.FC<SafetyHubViewProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SafetyHubResponse | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn("Geolocation denied", err)
    );
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !userLocation) return;

    setLoading(true);
    const res = await findSafeSpaces(searchQuery, userLocation);
    setResult(res);
    setLoading(false);
  };

  const quickFilters = [
    { label: 'Bars & Clubs', icon: 'fa-glass-cheers', color: 'text-pink-400' },
    { label: 'Health Clinics', icon: 'fa-heart-pulse', color: 'text-blue-400' },
    { label: 'Community Centers', icon: 'fa-house-user', color: 'text-purple-400' },
    { label: 'Hotels', icon: 'fa-bed', color: 'text-yellow-400' }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
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
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <i className="fa-solid fa-shield-halved animate-pulse"></i>
          <span>Global Safe Passage Active</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight">Safe Space Finder</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Navigate the world with confidence. We use real-time Google Maps and community grounding to find verified LGBTQ+ friendly havens.
        </p>
      </header>

      {/* Search Console */}
      <section className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all"></div>
        
        <form onSubmit={handleSearch} className="relative space-y-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {quickFilters.map(filter => (
              <button
                key={filter.label}
                type="button"
                onClick={() => { setSearchQuery(filter.label); }}
                className="px-5 py-2.5 bg-transparent border-2 border-orange-500/20 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center space-x-3 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all text-orange-500"
              >
                <i className={`fa-solid ${filter.icon}`}></i>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <i className="fa-solid fa-location-crosshairs absolute left-6 top-1/2 -translate-y-1/2 text-blue-400 text-xl"></i>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Where do you need to find a safe space? (e.g. Queer-friendly cafes in Brooklyn)"
              className="w-full bg-black/40 border border-white/10 rounded-3xl py-6 pl-16 pr-24 text-lg font-medium focus:border-blue-500 outline-none transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={loading || !userLocation}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'SEARCH'}
            </button>
          </div>
          {!userLocation && (
            <p className="text-center text-xs text-red-400 font-bold">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              Please enable location services for best results
            </p>
          )}
        </form>
      </section>

      {/* Results Rendering */}
      {result && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] prose prose-invert max-w-none">
              <h3 className="text-xl font-black mb-4 flex items-center">
                <i className="fa-solid fa-sparkles text-yellow-500 mr-3"></i>
                AI Recommendation
              </h3>
              <p className="text-gray-300 leading-relaxed italic text-lg">"{result.text}"</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Verified Links</h3>
            {result.links.map((link, i) => (
              <a 
                key={i} 
                href={link.uri} 
                target="_blank" 
                rel="noreferrer"
                className="block p-5 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl hover:border-blue-500/50 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <i className={`fa-solid ${link.uri.includes('google.com/maps') ? 'fa-map-pin' : 'fa-link'}`}></i>
                      </div>
                      <span className="font-bold text-sm line-clamp-1">{link.title}</span>
                   </div>
                   <i className="fa-solid fa-arrow-up-right-from-square text-gray-600 group-hover:text-blue-400 text-xs"></i>
                </div>
                <p className="text-[10px] text-gray-500 truncate">{link.uri}</p>
              </a>
            ))}
            {result.links.length === 0 && (
              <div className="p-8 text-center text-gray-600 border border-white/5 rounded-2xl italic">
                No external links found for this specific query.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Security Info Grid */}
      {!result && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <i className="fa-solid fa-route text-blue-400 text-2xl mb-4"></i>
            <h4 className="font-black text-sm mb-2">Route Obfuscation</h4>
            <p className="text-xs text-gray-500">Your specific path is never stored on our servers. Grounding queries are localized and encrypted.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <i className="fa-solid fa-hand-holding-heart text-pink-400 text-2xl mb-4"></i>
            <h4 className="font-black text-sm mb-2">Community Vetted</h4>
            <p className="text-xs text-gray-500">Places are analyzed against real-time social reviews and LGBTQ+ safety indices.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <i className="fa-solid fa-globe text-green-400 text-2xl mb-4"></i>
            <h4 className="font-black text-sm mb-2">Global Coverage</h4>
            <p className="text-xs text-gray-500">Works in over 190 countries using Google's global knowledge graph.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default SafetyHubView;
