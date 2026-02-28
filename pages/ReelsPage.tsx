
import React, { useState, useRef } from 'react';
import VideoFeed from '../components/VideoFeed';
import { VideoContent } from '../types';

interface ReelsPageProps {
  videos: VideoContent[];
  onLike?: (video: VideoContent) => void;
  onTip?: (video: VideoContent) => void;
}

const ReelsPage: React.FC<ReelsPageProps> = ({ videos, onLike, onTip }) => {
  const [localVideos, setLocalVideos] = useState<VideoContent[]>(videos);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewVideo(url);
    }
  };

  const handlePostVideo = () => {
    if (!previewVideo) return;

    setIsUploading(true);
    let progress = 0;

    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        
        const newVideo: VideoContent = {
          id: `video-${Date.now()}`,
          userId: 'current-user', // In a real app, get from auth context
          displayName: 'You',
          videoUrl: previewVideo,
          thumbnailUrl: 'https://picsum.photos/seed/new/300/500', // Placeholder
          description: description || 'New video upload',
          likes: 0,
          comments: 0,
          tags: ['new', 'upload'],
          isAdult: false
        };

        setLocalVideos([newVideo, ...localVideos]);
        setPreviewVideo(null);
        setDescription('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsUploading(false);
        setUploadProgress(0);
      }
    }, 100);
  };

  const handleCancelPreview = () => {
    if (isUploading) return;
    setPreviewVideo(null);
    setDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="h-full w-full bg-black animate-in fade-in duration-500 relative">
      <VideoFeed 
        videos={localVideos} 
        onLike={onLike}
        onTip={onTip}
      />

      {/* Add Video Button */}
      <div className="absolute bottom-8 right-6 z-30">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        >
          <i className="fa-solid fa-plus text-2xl"></i>
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="video/*"
          onChange={handleFileSelect}
        />
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl overflow-hidden max-w-md w-full border border-white/10 shadow-2xl">
            <div className="relative aspect-[9/16] bg-black">
              <video src={previewVideo} className="w-full h-full object-contain" controls autoPlay />
              <button 
                onClick={handleCancelPreview}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black/80"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-white font-bold text-lg">New Post</h3>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a caption..."
                disabled={isUploading}
                className="w-full bg-zinc-800 text-white rounded-xl p-3 border border-white/5 focus:border-pink-500 outline-none resize-none h-24 disabled:opacity-50"
              />
              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-full transition-all duration-100 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={handleCancelPreview}
                    className="flex-1 py-3 rounded-xl font-bold text-zinc-400 hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePostVideo}
                    className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
                  >
                    Post Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsPage;
