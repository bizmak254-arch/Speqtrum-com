
import { VideoContent, CommunityGroup } from '../types';

export const INITIAL_MOCK_VIDEOS: VideoContent[] = [
  {
    id: 'v1',
    userId: 'u1',
    displayName: 'IndigoMoon',
    videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536966601_tiny.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/v1/400/600',
    description: 'Celebrating self-love tonight ✨ #Pride #QueerJoy',
    likes: 1240,
    comments: 82,
    tags: ['Pride', 'QueerJoy'],
    isAdult: true,
  },
  {
    id: 'v2',
    userId: 'u2',
    displayName: 'RiverRider',
    videoUrl: 'https://cdn.pixabay.com/video/2020/09/24/50702-462826620_tiny.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/v2/400/600',
    description: 'Anyone up for a late night chat? 😈',
    likes: 4502,
    comments: 310,
    tags: ['LateNight', 'Flirt'],
    isAdult: true,
  }
];

export const MOCK_GROUPS: CommunityGroup[] = [
  { id: 'g1', name: 'Digital Artists Collective', description: 'Showcase your queer art and get feedback from the community.', members: 1240, isPrivate: false, coverImage: 'https://picsum.photos/seed/art/600/200' },
  { id: 'g2', name: 'London Queer Tech', description: 'Connecting LGBTQ+ professionals in the tech industry.', members: 450, isPrivate: true, coverImage: 'https://picsum.photos/seed/tech/600/200' },
  { id: 'g3', name: 'Late Night Gamers', description: 'Fortnite, Valorant, and late night laughs.', members: 2100, isPrivate: false, coverImage: 'https://picsum.photos/seed/gaming/600/200' },
];

export const PREDEFINED_INTERESTS = [
  "Art", "Music", "Fitness", "Gaming", "Travel", "Cooking", "Photography", 
  "Coding", "Dancing", "Movies", "Outdoors", "Fashion", "Nightlife", "Yoga"
];
