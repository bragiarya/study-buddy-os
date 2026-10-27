import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { Resource } from '@/types';

export const resourcesHelper = {
  addResource: async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'lastAccessedAt' | 'accessCount'>) => {
    try {
      const newResourceRef = doc(collection(db, 'resources'));
      const newResource: Resource = {
        ...resourceData,
        id: newResourceRef.id,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        accessCount: 0,
      };
      await setDoc(newResourceRef, { 
        ...newResource, 
        createdAt: newResource.createdAt.toISOString(),
        lastAccessedAt: newResource.lastAccessedAt.toISOString()
      });
      return newResource;
    } catch (error) {
      console.error("Error adding resource:", error);
      throw error;
    }
  },

  updateAccess: async (resourceId: string, currentCount: number) => {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      await updateDoc(resourceRef, {
        accessCount: currentCount + 1,
        lastAccessedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating resource access:", error);
      throw error;
    }
  },

  deleteResource: async (resourceId: string) => {
    try {
      await deleteDoc(doc(db, 'resources', resourceId));
    } catch (error) {
      console.error("Error deleting resource:", error);
      throw error;
    }
  }
};
