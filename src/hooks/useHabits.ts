import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Habit } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.uid) {
      setHabits([]);
      setLoading(false);
      return;
    }

    // Real-time subscription ke Firestore
    const q = query(collection(db, 'habits'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const habitsData: Habit[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        habitsData.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          isCompleted: data.isCompleted,
          currentStreak: data.currentStreak,
          longestStreak: data.longestStreak,
          createdAt: new Date(data.createdAt),
          lastCompletedAt: data.lastCompletedAt ? new Date(data.lastCompletedAt) : undefined,
        });
      });
      
      // Sort: yang belum selesai di atas, lalu urutkan berdasarkan abjad
      habitsData.sort((a, b) => {
        if (a.isCompleted === b.isCompleted) {
          return a.title.localeCompare(b.title);
        }
        return a.isCompleted ? 1 : -1;
      });

      setHabits(habitsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching habits:", error);
      setLoading(false);
    });

    // Cleanup subscription saat unmount
    return () => unsubscribe();
  }, [user?.uid]);

  return { habits, loading };
}
