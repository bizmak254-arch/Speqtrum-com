import React, { useState, useRef } from 'react';
import { VideoContent } from '../types';
import { useAuth } from '../context/AuthContext';

interface CreatorPageProps {
  onPost: (video: VideoContent) => void;
  onBack?: () => void;
}

const CreatorPage: React.FC<CreatorPageProps> = ({ onPost, onBack }) => {
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(30);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setUploadProgress(100);

      const newVideo: VideoContent = {
        id: Date.now().toString(),
        videoUrl: data.url,
        thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/400/600`,
        displayName: currentUser?.displayName || 'Creator',
        likes: 0,
        comments: 0,
        description: 'New upload via Creator Dashboard',
        userId: currentUser?.id || 'unknown',
        tags: [],
        isAdult: false
      };

      setTimeout(() => {
        onPost(newVideo);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video');
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#121212] text-white">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="video/*" 
        onChange={handleFileChange} 
      />

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e1e1e] sticky top-0 z-10">
        <div className="font-bold text-lg">CREATOR DASHBOARD</div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-[#ff4081] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e91e63] transition-colors disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload New'}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#181818] border-r border-white/5 p-4 hidden md:block overflow-y-auto">
          <ul className="space-y-1">
            {['Overview', 'My Content', 'Subscribers', 'Earnings', 'Go Live'].map((item, i) => (
              <li key={i} className="px-4 py-3 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors font-medium">
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {isUploading && (
            <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Processing Media...</span>
                <span className="text-xs font-black text-pink-500">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500 transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1f1f1f] p-6 rounded-xl border border-white/5 text-center">
               <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Subscribers</div>
               <div className="text-3xl font-bold text-white">120</div>
            </div>
            <div className="bg-[#1f1f1f] p-6 rounded-xl border border-white/5 text-center">
               <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Earnings</div>
               <div className="text-3xl font-bold text-white">$2,450</div>
            </div>
            <div className="bg-[#1f1f1f] p-6 rounded-xl border border-white/5 text-center">
               <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Videos</div>
               <div className="text-3xl font-bold text-white">32</div>
            </div>
          </section>

          {/* My Videos */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">My Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#1f1f1f] p-6 rounded-xl border border-white/5 flex items-center justify-center min-h-[160px] text-gray-300 font-medium">Video 1</div>
              <div className="bg-[#1f1f1f] p-6 rounded-xl border border-white/5 flex items-center justify-center min-h-[160px] text-gray-300 font-medium">Video 2</div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#1f1f1f] p-6 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center min-h-[160px] text-gray-400 hover:bg-[#2a2a2a] hover:text-white cursor-pointer transition-colors"
              >
                 <i className="fa-solid fa-cloud-arrow-up text-2xl mb-2"></i>
                 <span className="font-bold">Upload New</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CreatorPage;
