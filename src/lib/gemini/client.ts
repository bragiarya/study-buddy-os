import { GoogleGenerativeAI } from '@google/generative-ai';

// Kita menggunakan GEMINI_API_KEY tanpa NEXT_PUBLIC_ agar kuncinya aman di server
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn("GEMINI_API_KEY belum di-set di file .env.local");
}

// Inisialisasi client Gemini
export const genAI = new GoogleGenerativeAI(apiKey);

// REVISI: Menggunakan tag 'latest' untuk menghindari 404 Not Found 
// akibat model lama yang di-deprecate oleh Google.
export const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });