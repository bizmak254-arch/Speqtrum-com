
import { useState, useEffect } from 'react';
import { calculateCompatibility } from '../services/matching';
import { CompatibilityResult, User } from '../types';

export const MOCK_PROFILES = [
  { id: 'p1', name: 'Jordan', age: 24, location: '2 miles away', bio: 'Looking for someone to share coffee and deep conversations. ✨', interests: ['Art', 'Music', 'Travel'], img: 'https://picsum.photos/seed/jordan/400/600' },
  { id: 'p2', name: 'Casey', age: 29, location: '5 miles away', bio: 'Adventure seeker. Let\'s explore the city together! 🏙️', interests: ['Fitness', 'Dining', 'Movies'], img: 'https://picsum.photos/seed/casey/400/600' },
  { id: 'p3', name: 'Taylor', age: 31, location: '1 mile away', bio: 'Creative mind. Book lover. Part-time chef. 🍳', interests: ['Cooking', 'Reading', 'Gaming'], img: 'https://picsum.photos/seed/taylor/400/600' },
];

export const useDiscovery = (currentUser: User | null) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const [aiResult, setAiResult] = useState<CompatibilityResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

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

  const nextProfile = () => {
    setCardCount(prev => prev + 1);
    setCurrentIndex((prev) => (prev < MOCK_PROFILES.length - 1 ? prev + 1 : 0));
    setAiResult(null);
  };

  return {
    profile: MOCK_PROFILES[currentIndex],
    isDailyPrompt: cardCount % 4 === 3,
    aiResult,
    loadingAi,
    nextProfile
  };
};
