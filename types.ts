
export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export type SubscriptionTier = 'standard' | 'core_member' | 'gold' | 'platinum' | 'creator_pro';

export type ModuleType = 'social' | 'dating' | 'creator' | 'live';

export type DatingMode = 'open' | 'lgbtq' | 'both' | 'none';

export type PurposeType = 
  | 'Companionship / Long-term' 
  | 'Casual Connections' 
  | 'Friendship' 
  | 'Entertainment' 
  | 'Community & Socializing' 
  | 'Networking' 
  | 'Exploring' 
  | 'Not sure yet';

export type TabType = 
  // Social Module
  | 'feed' | 'community' | 'chat' | 'search' | 'groups'
  // Dating Module
  | 'dating_open' | 'dating_lgbtq' | 'discovery' // discovery is legacy, mapping to dating
  // Creator Module
  | 'marketplace' | 'creator_studio' | 'reels'
  // Live Module
  | 'live_feed' | 'go_live'
  // System
  | 'profile' | 'settings' | 'admin' | 'safety_hub' | 'help' | 'landing' | 'invite'
  | 'calls' | 'contacts' | 'saved' | 'channels' | 'history' | 'tips' | 'video_player' | 'websearch' | 'creator';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  displayName: string;
  avatar: string;
  age?: number;
  country?: string;
  city?: string;
  bio?: string;
  banner?: string;
  headline?: string;
  prompts?: { question: string; answer: string }[];
  
  // Module Permissions & Settings
  activeModules: ModuleType[];
  datingMode: DatingMode;
  
  purpose?: PurposeType;
  interests?: string[];
  vibeTags?: string[];
  genderIdentity?: string;
  sexualOrientation?: string;
  interestedIn?: string[];
  agePreference?: { min: number; max: number };
  lifestyleChoices?: string[];
  badges: string[];
  subscriptionTier: SubscriptionTier;
  balance?: number;
  
  visibilitySettings: {
    showOnlineStatus: boolean;
    incognitoMode: boolean;
    travelMode: boolean;
    nsfwEnabled: boolean;
    hideLocationPrecision: boolean;
    hideIdentityFields: boolean;
    viewableBy: 'everyone' | 'connections_only' | 'nobody';
    datingProfileVisible: boolean;
  };
  
  media?: string[];
  activity?: {
    groupsJoined: number;
    eventsAttended: number;
    videosPosted: number;
  };
}

export interface CreatorStats {
  totalEarnings: number;
  totalViews: number;
  totalTips: number;
  activeSubscribers: number;
}

export interface CompatibilityResult {
  score: number;
  reason: string;
  sharedVibes: string[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface VideoContent {
  id: string;
  userId: string;
  displayName: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  likes: number;
  comments: number;
  tips?: number;
  tags: string[];
  isAdult: boolean;
  price?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  hasTip?: boolean;
  tipAmount?: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  coverImage: string;
  tags?: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isOnline: boolean;
  attendees: number;
  image: string;
}
