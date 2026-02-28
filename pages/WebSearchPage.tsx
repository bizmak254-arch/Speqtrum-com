
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const WebSearchPage: React.FC<{onBack?: () => void}> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Search for community events, lifestyle tips, or social resources related to: ${query}`,
        config: { tools: [{ googleSearch: {} }] }
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webLinks = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
      
      setResults(webLinks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-8 border-b border-gray-100">
         <div className="flex items-center space-x-4 mb-6">
            {onBack && <button onClick={onBack}><i className="fa-solid fa-arrow-left text-gray-500"></i></button>}
            <h1 className="text-3xl font-black text-gray-900">Web Search</h1>
         </div>
         <form onSubmit={handleSearch} className="relative">
            <i className="fa-brands fa-google absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search community resources..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:border-blue-500 outline-none"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
               {loading ? '...' : 'Search'}
            </button>
         </form>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
         {results.map((res, i) => (
            <a key={i} href={res.uri} target="_blank" rel="noreferrer" className="block p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
               <h3 className="text-lg font-black text-blue-600 group-hover:underline mb-1">{res.title}</h3>
               <p className="text-xs text-gray-400 truncate">{res.uri}</p>
            </a>
         ))}
         {results.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-12">
               <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-20"></i>
               <p>Search the web for local events, safe spaces, news, and more.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default WebSearchPage;
