import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { SemesterResult } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export function useCalculator() {
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.uid) {
      setResults([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'semesters'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const resultsData: SemesterResult[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        resultsData.push({
          id: doc.id,
          userId: data.userId,
          semesterNumber: data.semesterNumber,
          subjects: data.subjects,
          gpa: data.gpa,
          totalCredits: data.totalCredits,
          createdAt: new Date(data.createdAt),
        });
      });
      
      // Urutkan berdasarkan semester
      resultsData.sort((a, b) => a.semesterNumber - b.semesterNumber);

      setResults(resultsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching semesters:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const cumulativeGPA = results.length > 0 
    ? Number((results.reduce((acc, curr) => acc + curr.gpa, 0) / results.length).toFixed(2))
    : 0;

  const totalCreditsEarned = results.reduce((acc, curr) => acc + curr.totalCredits, 0);

  return { results, loading, cumulativeGPA, totalCreditsEarned };
}
