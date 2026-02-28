
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  deleteUser as deleteFirebaseUser
} from "firebase/auth";
import { auth } from "./firebase";
import { userService } from "./userService";
import { User, UserRole, AuthResponse } from '../types';

export const authService = {
  // Login with Firebase
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Sync with Firestore
      const userData = await userService.syncUser(firebaseUser);

      return {
        user: userData,
        accessToken: await firebaseUser.getIdToken(),
        refreshToken: firebaseUser.refreshToken
      };
    } catch (error: any) {
      throw error;
    }
  },

  // Login with Google
  loginWithGoogle: async (): Promise<AuthResponse> => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      // Sync with Firestore
      const userData = await userService.syncUser(firebaseUser);

      return {
        user: userData,
        accessToken: await firebaseUser.getIdToken(),
        refreshToken: firebaseUser.refreshToken
      };
    } catch (error: any) {
      throw error;
    }
  },

  // Register with Firebase
  register: async (email: string, displayName: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create new user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email,
        role: UserRole.USER,
        isVerified: false,
        displayName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: 'New member ready to explore.',
        activeModules: ['social', 'dating', 'creator', 'live'],
        datingMode: 'lgbtq',
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
    } catch (error: any) {
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  // Delete Account
  deleteAccount: async (uid: string): Promise<void> => {
    const user = auth.currentUser;
    if (user && user.uid === uid) {
      await userService.deleteUser(uid);
      await deleteFirebaseUser(user);
    } else {
      throw new Error("Unauthorized or user not found");
    }
  }
};

