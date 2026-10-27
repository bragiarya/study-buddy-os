import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadFile = async (file: File, folder: string, userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileName = `${new Date().getTime()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const storageRef = ref(storage, `${folder}/${userId}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress upload bisa dilacak dari sini jika dibutuhkan nanti
      },
      (error) => {
        console.error("Error uploading file:", error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
