import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { TabType, VideoContent } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import MobileMenu from './components/MobileMenu';
import NotificationDrawer from './components/NotificationDrawer';
import PremiumOverlay from './components/PremiumOverlay';
import ReportModal from './components/ReportModal';
import VerificationOverlay from './components/VerificationOverlay';
import SpeqtrumAssistant from './components/SpeqtrumAssistant';

// Pages
import LandingPage from './pages/LandingPage';
import FeedPage from './pages/FeedPage';
import ReelsPage from './pages/ReelsPage';
import DiscoveryPage from './pages/DiscoveryPage';
import ChatPage from './pages/ChatPage';
import CommunityPage from './pages/CommunityPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import SafetyHubPage from './pages/SafetyHubPage';
import CreatorPage from './pages/CreatorPage';
import InvitePage from './pages/InvitePage';
import HelpPage from './pages/HelpPage';
import SettingsPage from './pages/SettingsPage';
import CallsPage from './pages/CallsPage';
import ContactsPage from './pages/ContactsPage';
import SavedMessagesPage from './pages/SavedMessagesPage';
import ChannelsPage from './pages/ChannelsPage';
import HistoryPage from './pages/HistoryPage';
import TipsPage from './pages/TipsPage';
import StreamPage from './pages/StreamPage';
import GoLivePage from './pages/GoLivePage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import VideoMarketplace from './pages/VideoMarketplace';
import WebSearchPage from './pages/WebSearchPage';
import SearchPage from './pages/SearchPage';

function App() {
  const { currentUser, setCurrentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [pendingChatUserId, setPendingChatUserId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type?: 'success' | 'info' }[]>([]);

  // Mock Videos
  const videos: VideoContent[] = [
    { id: '1', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4', thumbnailUrl: 'https://picsum.photos/seed/1/400/600', displayName: 'NeonDreamer', likes: 1200, comments: 45, description: 'Cyberpunk vibes tonight 🌃 #neon #vibes', userId: 'u1', tags: ['neon', 'vibes'], isAdult: false },
    { id: '2', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4', thumbnailUrl: 'https://picsum.photos/seed/2/400/600', displayName: 'NatureLover', likes: 850, comments: 20, description: 'Spring is here! 🌸 #nature #peace', userId: 'u2', tags: ['nature', 'peace'], isAdult: false },
    { id: '3', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.mp4', thumbnailUrl: 'https://picsum.photos/seed/3/400/600', displayName: 'FamilyFirst', likes: 2100, comments: 120, description: 'Sweet moments ❤️ #family #love', userId: 'u3', tags: ['family', 'love'], isAdult: false },
  ];

  useEffect(() => {
    if (currentUser && activeTab === 'landing') {
      setActiveTab('feed');
    }
  }, [currentUser]);

  const addToast = (message: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleOnboardingComplete = async (updatedUser: any) => {
    await updateUser(updatedUser);
    setActiveTab('feed');
    addToast("Profile Setup Complete!", "success");
  };

  const handleOpenChat = (userId: string) => {
    setPendingChatUserId(userId);
    setActiveTab('chat');
  };

  const handlePostVideo = (video: VideoContent) => {
    addToast("Video Uploaded Successfully!", "success");
    setActiveTab('reels');
  };

  const goHome = () => setActiveTab('feed');
  const handleTogglePanic = () => setIsPanicMode(!isPanicMode);

  const needsOnboarding = currentUser && (!currentUser.displayName || currentUser.displayName === 'New Member');

  const renderContent = () => {
    if (needsOnboarding) {
      return <ProfilePage user={currentUser} onSave={handleOnboardingComplete} />;
    }

    switch (activeTab) {
      case 'landing': return <LandingPage onAuth={() => setActiveTab('feed')} />;
      case 'feed': return <FeedPage videos={videos} onNavigate={setActiveTab} />;
      case 'reels': return <ReelsPage videos={videos} onLike={(v) => addToast(`Liked ${v.displayName}'s reel! ❤️`)} onTip={(v) => addToast(`Sent tip to ${v.displayName}! 🪙`)} />;
      case 'dating_open': return <DiscoveryPage onLike={(p) => addToast(`You liked ${p.name}! ✨`)} />;
      case 'dating_lgbtq': return <DiscoveryPage onLike={(p) => addToast(`You liked ${p.name}! ✨`)} />;
      case 'discovery': return <DiscoveryPage onLike={(p) => addToast(`You liked ${p.name}! ✨`)} />;
      case 'search': return <SearchPage onOpenChat={handleOpenChat} onBack={goHome} />;
      case 'chat': return <ChatPage initialUserId={pendingChatUserId} onChatConsumed={() => setPendingChatUserId(null)} />;
      case 'community': return <CommunityPage onJoin={(g) => addToast(`Joined ${g.name} Tribe`)} />;
      case 'admin': return <AdminPage onBack={goHome} />;
      case 'profile': return <ProfilePage user={currentUser} onSave={handleOnboardingComplete} onBack={goHome} />;
      case 'safety_hub': return <SafetyHubPage onBack={goHome} />;
      case 'creator': return <CreatorPage onPost={handlePostVideo} onBack={goHome} />;
      case 'creator_studio': return <CreatorPage onPost={handlePostVideo} onBack={goHome} />;
      case 'invite': return <InvitePage onBack={goHome} />;
      case 'help': return <HelpPage onBack={goHome} />;
      case 'settings': return <SettingsPage onBack={goHome} onSave={() => addToast("Settings Saved")} onPanic={handleTogglePanic} />;
      case 'calls': return <CallsPage onBack={goHome} />;
      case 'contacts': return <ContactsPage onBack={goHome} />;
      case 'saved': return <SavedMessagesPage onBack={goHome} />;
      case 'channels': return <ChannelsPage onBack={goHome} />;
      case 'history': return <HistoryPage onBack={goHome} />;
      case 'tips': return <TipsPage onBack={goHome} />;
      case 'live_feed': return <StreamPage />;
      case 'go_live': return <GoLivePage onBack={goHome} />;
      default: return <FeedPage videos={videos} onNavigate={setActiveTab} />;
    }
  };

  if (isPanicMode) {
    return (
      <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 mb-6">
          <i className="fa-solid fa-shield-halved text-4xl"></i>
        </div>
        <h1 className="text-2xl font-black mb-2 text-zinc-900">Safety Lockdown Active</h1>
        <p className="text-zinc-500 text-sm text-center max-w-xs mb-8">
          Your session has been paused and hidden for your privacy.
        </p>
        <div className="flex flex-col w-full max-w-xs space-y-4">
          <button onClick={() => setIsPanicMode(false)} className="w-full bg-zinc-900 text-white font-black py-4 rounded-2xl shadow-xl">RESTORE SESSION</button>
          <a href="https://www.google.com/news" className="w-full bg-zinc-100 text-zinc-900 font-black py-4 rounded-2xl text-center border border-zinc-200">REDIRECT TO NEWS</a>
        </div>
      </div>
    );
  }

  if (!isAgeVerified) {
    return <VerificationOverlay onVerify={() => { setIsAgeVerified(true); addToast("Age Verified", "success"); }} />;
  }

  if (!currentUser && activeTab === 'landing') {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] text-zinc-900 dark:text-white font-sans selection:bg-[#ff4da6] selection:text-white transition-colors duration-300">
      {/* Toast System */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] flex flex-col space-y-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-[#2a2a2a] text-white px-4 py-3 rounded-xl shadow-xl border border-white/10 flex items-center space-x-3 pointer-events-auto animate-in slide-in-from-top-2">
             <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check text-green-500' : 'fa-circle-info text-blue-500'}`}></i>
             <span className="text-sm font-bold">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      {!needsOnboarding && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onSearch={() => setActiveTab('search')}
          onChat={() => setActiveTab('chat')}
          onNotif={() => setIsNotifOpen(true)}
          onProfile={() => setActiveTab('profile')}
        />
      )}

      {/* Main Layout Grid */}
      <div className={`grid ${!needsOnboarding ? 'md:grid-cols-[220px_1fr]' : 'grid-cols-1'} min-h-[calc(100vh-64px)]`}>
        
        {/* Left Sidebar (Quick Access) */}
        {!needsOnboarding && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        )}

        {/* Main Content Area */}
        <main className="relative flex flex-col">
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
             {renderContent()}
             {!needsOnboarding && <SpeqtrumAssistant />}
          </div>
          
          {!needsOnboarding && <Footer />}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Menu */}
      {!needsOnboarding && (
        <>
          <BottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
          />
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeModules={currentUser?.activeModules}
          />
        </>
      )}

      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      {showPremium && <PremiumOverlay onClose={() => setShowPremium(false)} />}
      <ReportModal 
        isOpen={!!reportTarget} 
        onClose={() => setReportTarget(null)} 
        targetUser={reportTarget || "User"}
      />
    </div>
  );
}

export default App;
