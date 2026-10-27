import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Resource } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.uid) {
      setResources([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'resources'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const resourcesData: Resource[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        resourcesData.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          type: data.type,
          url: data.url,
          content: data.content,
          tags: data.tags || [],
          courseName: data.courseName,
          createdAt: new Date(data.createdAt),
          lastAccessedAt: new Date(data.lastAccessedAt),
          accessCount: data.accessCount || 0,
        });
      });
      
      // Default sorting: Terbaru di atas
      resourcesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setResources(resourcesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching resources:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return { resources, loading };
}
