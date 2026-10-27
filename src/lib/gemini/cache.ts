import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const aiCacheHelper = {
  // Mengambil insight yang tersimpan (Valid 7 hari)
  getCachedInsight: async (userId: string) => {
    try {
      const cacheRef = doc(db, 'ai_cache', `insight_${userId}`);
      const snap = await getDoc(cacheRef);
      
      if (snap.exists()) {
        const data = snap.data();
        const now = new Date().getTime();
        const cacheTime = new Date(data.timestamp).getTime();
        
        // 7 Hari dalam milidetik = 7 * 24 * 60 * 60 * 1000 = 604800000 ms
        if (now - cacheTime < 604800000) {
          return data.insight;
        }
      }
      return null;
    } catch (error) {
      console.error("Error reading cache:", error);
      return null;
    }
  },

  // Menyimpan insight baru ke cache
  setCachedInsight: async (userId: string, insight: string) => {
    try {
      const cacheRef = doc(db, 'ai_cache', `insight_${userId}`);
      await setDoc(cacheRef, {
        insight,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving cache:", error);
    }
  }
};