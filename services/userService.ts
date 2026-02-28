
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User, UserRole } from "../types";

export const userService = {
  /**
   * Get user from Firestore by UID
   */
  getUser: async (uid: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  },

  /**
   * Create or update user in Firestore
   */
  saveUser: async (user: User): Promise<void> => {
    await setDoc(doc(db, "users", user.id), user, { merge: true });
  },

  /**
   * Update specific fields of a user
   */
  updateUserFields: async (uid: string, fields: Partial<User>): Promise<void> => {
    await updateDoc(doc(db, "users", uid), fields);
  },

  /**
   * Delete user from Firestore
   */
  deleteUser: async (uid: string): Promise<void> => {
    await deleteDoc(doc(db, "users", uid));
  },

  /**
   * Initialize a new user document if it doesn't exist
   */
  syncUser: async (firebaseUser: any): Promise<User> => {
    const existingUser = await userService.getUser(firebaseUser.uid);
    
    if (existingUser) {
      return existingUser;
    }

    // Create new user document
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "New Member",
      avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
      role: UserRole.USER,
      isVerified: false,
      bio: "New member ready to explore.",
      activeModules: ['social', 'dating', 'creator', 'live'],
      datingMode: 'open',
      purpose: 'Not sure yet',
      interests: [],
      badges: [],
      subscriptionTier: 'standard',
      visibilitySettings: {
        showOnlineStatus: true,
        incognitoMode: false,
        travelMode: false,
        nsfwEnabled: false,
        hideLocationPrecision: false,
        hideIdentityFields: false,
        viewableBy: 'everyone',
        datingProfileVisible: true
      }
    };

    await userService.saveUser(newUser);
    return newUser;
  }
};
