import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './config';
import { SemesterResult, Subject } from '@/types';

export const calculatorHelper = {
  saveSemesterResult: async (userId: string, semesterNumber: number, subjects: Subject[], gpa: number, totalCredits: number) => {
    try {
      const resultRef = doc(collection(db, 'semesters'));
      const newResult: SemesterResult = {
        id: resultRef.id,
        userId,
        semesterNumber,
        subjects,
        gpa,
        totalCredits,
        createdAt: new Date(),
      };
      await setDoc(resultRef, {
        ...newResult,
        createdAt: newResult.createdAt.toISOString()
      });
      return newResult;
    } catch (error) {
      console.error("Error saving semester result:", error);
      throw error;
    }
  },

  deleteSemesterResult: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'semesters', id));
    } catch (error) {
      console.error("Error deleting semester result:", error);
      throw error;
    }
  }
};
