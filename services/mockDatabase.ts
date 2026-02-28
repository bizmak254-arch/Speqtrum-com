
import { User, UserRole } from '../types';

const DB_KEYS = {
  USERS: 'sp_db_users',
  CODES: 'sp_db_codes',
};

// Seed data
const SEED_USERS: User[] = [
  {
    id: 'usr-admin',
    email: 'admin@speqtrum.com',
    role: UserRole.ADMIN,
    isVerified: true,
    displayName: 'Admin User',
    avatar: 'https://picsum.photos/seed/admin/200',
    bio: 'System Administrator',
    subscriptionTier: 'gold',
    badges: ['verified'],
    activeModules: ['social', 'dating', 'creator', 'live'],
    datingMode: 'both',
    visibilitySettings: { showOnlineStatus: true, incognitoMode: false, travelMode: false, nsfwEnabled: false, hideLocationPrecision: false, hideIdentityFields: false, viewableBy: 'everyone', datingProfileVisible: true }
  },
  {
    id: 'usr-777',
    email: 'test@speqtrum.com',
    role: UserRole.USER,
    isVerified: true,
    displayName: 'Alex Thorne',
    avatar: 'https://picsum.photos/seed/alex/200',
    banner: 'https://picsum.photos/seed/banner/1200/400',
    headline: 'Digital Artist & Coffee Enthusiast',
    bio: 'Living my best life in the spectrum. 🌈',
    interests: ['Art', 'Music', 'Coding', 'Photography'],
    prompts: [
      { question: "My golden rule...", answer: "Treat others how you want to be treated." },
      { question: "I'm looking for...", answer: "Creative collaborations and good vibes." }
    ],
    badges: ['verified-id', 'pioneer'],
    subscriptionTier: 'standard',
    activeModules: ['social', 'dating'],
    datingMode: 'open',
    visibilitySettings: { showOnlineStatus: true, incognitoMode: false, travelMode: false, nsfwEnabled: false, hideLocationPrecision: false, hideIdentityFields: false, viewableBy: 'everyone', datingProfileVisible: true }
  }
];

// Helper to initialize DB
const initDB = () => {
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
};

export const mockDB = {
  getUsers: (): User[] => {
    initDB();
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
  },

  findUserByEmail: (email: string): User | undefined => {
    const users = mockDB.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  saveUser: (user: User) => {
    const users = mockDB.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  },

  // Simulate storing a verification code in a Redis/Memcache equivalent
  createVerificationContext: (email: string, tempUserData: any) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
    const codes = JSON.parse(localStorage.getItem(DB_KEYS.CODES) || '{}');
    
    codes[email.toLowerCase()] = { 
      code, 
      tempUserData, 
      expires: Date.now() + 300000 // 5 min expiry
    };
    
    localStorage.setItem(DB_KEYS.CODES, JSON.stringify(codes));
    
    // Simulate Sending Email via Console/Alert
    console.log(`%c[SMTP SERVICE] Email sent to ${email}. Code: ${code}`, 'color: #f97316; font-weight: bold; font-size: 14px;');
    // In a real dev environment, we might verify via console, but for this demo:
    setTimeout(() => alert(`[DEMO EMAIL SERVER]\n\nTo: ${email}\nSubject: Verify your Speqtrum ID\n\nYour code is: ${code}`), 500);
    
    return true;
  },

  verifyCode: (email: string, code: string) => {
    const codes = JSON.parse(localStorage.getItem(DB_KEYS.CODES) || '{}');
    const record = codes[email.toLowerCase()];
    
    if (!record) throw new Error("No pending verification found for this email.");
    if (Date.now() > record.expires) throw new Error("Verification code has expired.");
    if (record.code !== code) throw new Error("Invalid verification code.");
    
    // Clean up used code
    delete codes[email.toLowerCase()];
    localStorage.setItem(DB_KEYS.CODES, JSON.stringify(codes));
    
    return record.tempUserData;
  }
};
