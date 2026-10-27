import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile } from '@/types';

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async (): Promise<UserProfile | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    let userProfile: UserProfile;

    if (!userSnap.exists()) {
      userProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Mahasiswa',
        photoURL: user.photoURL || undefined,
        totalPoints: 0,
        currentLevel: 1,
      };
      await setDoc(userRef, userProfile);
    } else {
      userProfile = userSnap.data() as UserProfile;
    }

    return userProfile;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
