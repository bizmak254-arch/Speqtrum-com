
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { userService } from "../services/userService";
// import { authService } from "../services/auth";
import { User, SubscriptionTier } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  upgradeSubscription: (tier: SubscriptionTier) => void;
  isLoading: boolean;
  setCurrentUser: (user: User) => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Safety timeout to prevent permanent loading state
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth initialization timed out. Proceeding with null user.");
        setIsLoading(false);
      }
    }, 5000);

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeoutId);
      if (firebaseUser) {
        try {
          // Sync with Firestore
          const userData = await userService.syncUser(firebaseUser);
          setCurrentUser(userData);
        } catch (error) {
          console.error("Error syncing user:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = async () => {
    await auth.signOut();
    setCurrentUser(null);
  };

  const updateUser = async (user: User) => {
    if (currentUser) {
      await userService.saveUser(user);
      setCurrentUser(user);
    }
  };

  const upgradeSubscription = async (tier: SubscriptionTier) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, subscriptionTier: tier };
      await updateUser(updatedUser);
    }
  };

  const deleteAccount = async () => {
    if (currentUser) {
      const uid = currentUser.id;
      const user = auth.currentUser;
      if (user) {
        await userService.deleteUser(uid);
        await user.delete();
        setCurrentUser(null);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated: !!currentUser, 
      login, 
      logout, 
      updateUser, 
      upgradeSubscription, 
      isLoading, 
      setCurrentUser,
      deleteAccount
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
