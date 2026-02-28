
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import MatchCelebration from './MatchCelebration';
import ProfileDetailView from './ProfileDetailView';
import DailyPrompt from './DailyPrompt';
import { calculateCompatibility } from '../services/matching';
import { CompatibilityResult } from '../types';
import { useAuth } from '../context/AuthContext';

const MOCK_PROFILES = [
  { id: 'p1', name: 'Jordan', age: 24, location: '2 miles away', bio: 'Looking for someone to share coffee and deep conversations. ✨', interests: ['Art', 'Music', 'Travel'], img: 'https://picsum.photos/seed/jordan/400/600', isVerified: true },
  { id: 'p2', name: 'Casey', age: 29, location: '5 miles away', bio: 'Adventure seeker. Let\'s explore the city together! 🏙️', interests: ['Fitness', 'Dining', 'Movies'], img: 'https://picsum.photos/seed/casey/400/600', isVerified: false },
  { id: 'p3', name: 'Taylor', age: 31, location: '1 mile away', bio: 'Creative mind. Book lover. Part-time chef. 🍳', interests: ['Cooking', 'Reading', 'Gaming'], img: 'https://picsum.photos/seed/taylor/400/600', isVerified: true },
  { id: 'p4', name: 'Alex', age: 26, location: '3 miles away', bio: 'Tech enthusiast and coffee addict. ☕', interests: ['Tech', 'Coffee', 'Coding'], img: 'https://picsum.photos/seed/alex/400/600', isVerified: false },
  { id: 'p5', name: 'Sam', age: 28, location: '4 miles away', bio: 'Nature lover. Hiking and photography. 📸', interests: ['Hiking', 'Photography', 'Nature'], img: 'https://picsum.photos/seed/sam/400/600', isVerified: true },
];

const Discovery: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [aiResult, setAiResult] = useState<CompatibilityResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [isTravelMode, setIsTravelMode] = useState(false);
  const [exitX, setExitX] = useState<number | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

  const next = () => {
    setCardCount(prev => prev + 1);
    setCurrentIndex((prev) => (prev < MOCK_PROFILES.length - 1 ? prev + 1 : 0));
    setAiResult(null);
    setExitX(null);
    x.set(0);
  };

  useEffect(() => {
    const analyze = async () => {
      if (!currentUser || cardCount % 4 === 3) return;
      setLoadingAi(true);
      const res = await calculateCompatibility(currentUser, MOCK_PROFILES[currentIndex]);
      setAiResult(res);
      setLoadingAi(false);
    };
    analyze();
  }, [currentIndex, currentUser, cardCount]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(200);
      handleLike();
    } else if (info.offset.x < -100) {
      setExitX(-200);
      setTimeout(next, 200);
    }
  };

  const handleLike = () => {
    if (Math.random() > 0.7) {
      setMatchedProfile(MOCK_PROFILES[currentIndex]);
      setShowMatch(true);
    } else {
      setTimeout(next, 200);
    }
  };

  const manualSwipe = (direction: 'left' | 'right') => {
    setExitX(direction === 'right' ? 200 : -200);
    if (direction === 'right') {
      handleLike();
    } else {
      setTimeout(next, 200);
    }
  };

  const profile = MOCK_PROFILES[currentIndex];
  const isDailyPrompt = cardCount > 0 && cardCount % 5 === 0;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black p-6 overflow-hidden">
      {/* Header Discovery Controls */}
      <div className="w-full max-w-sm flex items-center justify-between mb-6 z-10">
         <button 
          onClick={() => setIsTravelMode(!isTravelMode)}
          className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${isTravelMode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
         >
           <i className="fa-solid fa-plane"></i>
           <span>{isTravelMode ? 'London, UK' : 'Local Mode'}</span>
         </button>
         <div className="flex space-x-2">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white border border-white/5">
               <i className="fa-solid fa-sliders"></i>
            </button>
         </div>
      </div>

      {showMatch && (
        <MatchCelebration 
          user={currentUser} 
          match={matchedProfile} 
          onClose={() => { setShowMatch(false); next(); }}
          onStartChat={() => { setShowMatch(false); next(); }}
        />
      )}

      {showDetail && !isDailyPrompt && (
        <ProfileDetailView 
          profile={{ ...profile, compatibility: aiResult?.score || 50 }} 
          onClose={() => setShowDetail(false)} 
          onAction={(type) => {
            setShowDetail(false);
            manualSwipe(type === 'like' ? 'right' : 'left');
          }}
        />
      )}

      <div className="relative w-full max-w-sm aspect-[3/4] flex items-center justify-center">
        {/* Background Card (Next Profile) */}
        {MOCK_PROFILES[currentIndex + 1] && !isDailyPrompt && (
           <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden bg-zinc-800 border border-white/5 scale-[0.95] translate-y-4 opacity-60 -z-10 transition-all duration-300">
              <img src={MOCK_PROFILES[currentIndex + 1].img} className="w-full h-full object-cover grayscale-[0.5]" />
              <div className="absolute inset-0 bg-black/40"></div>
           </div>
        )}

        <AnimatePresence>
          {isDailyPrompt ? (
            <motion.div
              key="daily-prompt"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-0"
            >
              <DailyPrompt />
              <button 
                onClick={next}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full font-bold text-sm"
              >
                Skip Prompt
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={profile.id}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10 cursor-grab active:cursor-grabbing bg-zinc-900"
              onClick={() => setShowDetail(true)}
            >
              <img src={profile.img} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              
              {/* Swipe Indicators */}
              <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 rounded-xl px-4 py-2 -rotate-12 z-20">
                <span className="text-green-500 font-black text-4xl uppercase tracking-widest">LIKE</span>
              </motion.div>
              <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 rounded-xl px-4 py-2 rotate-12 z-20">
                <span className="text-red-500 font-black text-4xl uppercase tracking-widest">NOPE</span>
              </motion.div>

              <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
                <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center space-x-2">
                  {loadingAi ? (
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
                    {loadingAi ? 'AI Analyzing...' : `${aiResult?.score || '??'}% AI Compatibility`}
                  </span>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-3xl font-black text-white">{profile.name}, {profile.age}</h2>
                  {profile.isVerified && <i className="fa-solid fa-circle-check text-blue-500 text-xl"></i>}
                </div>
                <div className="flex items-center text-gray-300 text-[10px] font-black uppercase tracking-widest mb-4">
                  <i className="fa-solid fa-location-dot mr-2 text-purple-500"></i>
                  {isTravelMode ? 'San Francisco, CA' : profile.location}
                </div>
                
                {/* Interest Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.interests.map((interest, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {!isDailyPrompt && (
        <div className="flex items-center justify-center gap-6 mt-8 z-10">
          <button onClick={() => manualSwipe('left')} className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl text-red-500 hover:scale-110 transition-transform hover:bg-red-500/20">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg text-blue-400 hover:scale-110 transition-transform hover:bg-blue-500/20">
            <i className="fa-solid fa-star"></i>
          </button>
          <button onClick={() => manualSwipe('right')} className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl text-white shadow-xl shadow-purple-500/40 hover:scale-110 transition-transform">
            <i className="fa-solid fa-heart"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Discovery;
