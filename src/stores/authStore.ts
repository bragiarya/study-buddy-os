import { create } from 'zustand';
import { UserProfile } from '@/types';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            set({ user: userSnap.data() as UserProfile, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ user: null, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    });
    return unsubscribe; // Return cleanup function
  },
}));
