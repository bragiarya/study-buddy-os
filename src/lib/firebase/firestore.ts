import { collection, doc, setDoc, deleteDoc, updateDoc, query, where, onSnapshot, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './config';
import { Habit } from '@/types';

export const habitsHelper = {
  // Tambah Habit Baru
  addHabit: async (userId: string, title: string) => {
    try {
      const newHabitRef = doc(collection(db, 'habits'));
      const newHabit: Habit = {
        id: newHabitRef.id,
        userId,
        title,
        isCompleted: false,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: new Date(),
      };
      // Note: Kita simpan createdAt sebagai string ISO untuk mempermudah parsing di client
      await setDoc(newHabitRef, { ...newHabit, createdAt: newHabit.createdAt.toISOString() });
      return newHabit;
    } catch (error) {
      console.error("Error adding habit:", error);
      throw error;
    }
  },

  // Toggle Habit (Selesai / Belum)
  toggleHabit: async (habitId: string, isCompleted: boolean, currentStreak: number, longestStreak: number) => {
    try {
      const habitRef = doc(db, 'habits', habitId);
      const updates: {
        isCompleted: boolean;
        currentStreak: number;
        longestStreak: number;
        lastCompletedAt?: string;
      } = { 
        isCompleted,
        currentStreak,
        longestStreak
      };
      
      if (isCompleted) {
        updates.lastCompletedAt = new Date().toISOString();
      }
      
      await updateDoc(habitRef, updates);
    } catch (error) {
      console.error("Error toggling habit:", error);
      throw error;
    }
  },

  // Hapus Habit
  deleteHabit: async (habitId: string) => {
    try {
      await deleteDoc(doc(db, 'habits', habitId));
    } catch (error) {
      console.error("Error deleting habit:", error);
      throw error;
    }
  },

  // Update Points & Level User (Gamifikasi)
  updateUserPoints: async (userId: string, pointsToAdd: number) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newPoints = (userData.totalPoints || 0) + pointsToAdd;
        // Logic level sederhana: setiap 100 poin naik 1 level
        const newLevel = Math.floor(newPoints / 100) + 1; 
        
        await updateDoc(userRef, {
          totalPoints: newPoints,
          currentLevel: newLevel
        });
      }
    } catch (error) {
      console.error("Error updating user points:", error);
      throw error;
    }
  }
};
