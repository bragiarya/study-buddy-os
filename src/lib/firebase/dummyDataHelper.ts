import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from './config';

export const injectDummyData = async (userId: string) => {
  const batch = writeBatch(db);

  const subDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  const yesterdayISO = subDays(new Date(), 1);
  const yesterdayStr = yesterdayISO.toISOString();

  // 1. ACTIVE HABITS (4 items)
  const habitsData = [
    {
      title: "Mengerjakan Bab 4 Skripsi CSI",
      currentStreak: 12,
      longestStreak: 12,
      category: "Academic",
    },
    {
      title: "Eksplorasi Python & Odoo ERP",
      currentStreak: 5,
      longestStreak: 5,
      category: "Skill",
    },
    {
      title: "Latihan Soal TOEFL Listening",
      currentStreak: 8,
      longestStreak: 8,
      category: "Language",
    },
    {
      title: "Hafalan Kanji JLPT N3",
      currentStreak: 3,
      longestStreak: 3,
      category: "Language",
    }
  ];

  habitsData.forEach((habit) => {
    const ref = doc(collection(db, 'habits'));
    batch.set(ref, {
      id: ref.id,
      userId,
      title: habit.title,
      isCompleted: false,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      category: habit.category,
      createdAt: subDays(new Date(), 12).toISOString(),
      lastCompletedAt: yesterdayStr
    });
  });

  // 1b. HISTORICAL COMPLETED HABITS (to populate WeeklySummaryChart with a dynamic 7-day bar chart)
  // Pattern:
  // H-1: 4 items
  // H-2: 2 items
  // H-3: 5 items
  // H-4: 3 items
  // H-5: 4 items
  // H-6: 1 item
  // H-7: 3 items
  const historyPatterns = [
    { daysAgo: 1, titles: ["Latihan Soal TOEFL Listening", "Review Bab 4 Skripsi CSI", "Eksplorasi Odoo CRM", "Minum Air 2 Liter"] },
    { daysAgo: 2, titles: ["Latihan Percakapan Bahasa Inggris", "Membaca 10 Halaman Buku ERP"] },
    { daysAgo: 3, titles: ["Review Vocabulary TOEFL", "Menulis Draf Bab 1 Skripsi", "Belajar Tatabahasa JLPT N3", "Menonton Tutorial Next.js", "Merapikan Drive Kuliah"] },
    { daysAgo: 4, titles: ["Latihan Coding React Hook", "Diskusi Kelompok Technopreneurship", "Olahraga 15 Menit"] },
    { daysAgo: 5, titles: ["Review Bab 4 Skripsi CSI", "Mengerjakan Quiz Sistem Informasi", "Menghafal 5 Kanji Baru", "Membaca Dokumentasi Tailwind"] },
    { daysAgo: 6, titles: ["Membaca Jurnal Customer Satisfaction"] },
    { daysAgo: 7, titles: ["Eksplorasi Odoo CRM", "Review Vocabulary TOEFL", "Latihan Coding React Hook"] }
  ];

  historyPatterns.forEach((pattern) => {
    const dateOfCompletion = subDays(new Date(), pattern.daysAgo);
    pattern.titles.forEach((title) => {
      const ref = doc(collection(db, 'habits'));
      batch.set(ref, {
        id: ref.id,
        userId,
        title,
        isCompleted: false, // In the past, so reset to false for today
        currentStreak: 1,
        longestStreak: 1,
        createdAt: subDays(dateOfCompletion, 2).toISOString(),
        lastCompletedAt: dateOfCompletion.toISOString()
      });
    });
  });

  // 2. RESOURCES (3 items)
  const resourcesData = [
    {
      title: "Jurnal Referensi Customer Satisfaction Index",
      type: "link" as const,
      url: "https://scholar.google.com",
      tags: ["Thesis"],
      courseName: "Metodologi Penelitian",
    },
    {
      title: "Dokumentasi Next.js 14 Standalone",
      type: "link" as const,
      url: "https://nextjs.org/docs",
      tags: ["Programming"],
      courseName: "Pemrograman Web",
    },
    {
      title: "Panduan Grammar JLPT N3",
      type: "link" as const,
      url: "https://jlptsensei.com",
      tags: ["Language"],
      courseName: "Umum",
    }
  ];

  resourcesData.forEach((res) => {
    const ref = doc(collection(db, 'resources'));
    batch.set(ref, {
      id: ref.id,
      userId,
      title: res.title,
      type: res.type,
      url: res.url,
      tags: res.tags,
      courseName: res.courseName,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      accessCount: 0,
    });
  });

  // 3. SEMESTERS (Kalkulator IPK - 2 Semester terakhir)
  const semestersData = [
    {
      semesterNumber: 5,
      gpa: 3.75,
      totalCredits: 9,
      subjects: [
        { id: 1, name: "Pemrograman Web", credits: 3, grade: "A" },
        { id: 2, name: "Basis Data Lanjut", credits: 3, grade: "A" },
        { id: 3, name: "Metodologi Penelitian", credits: 3, grade: "B+" }
      ]
    },
    {
      semesterNumber: 6,
      gpa: 4.00,
      totalCredits: 9,
      subjects: [
        { id: 4, name: "Sistem Informasi Manajemen", credits: 3, grade: "A" },
        { id: 5, name: "Pengantar ERP", credits: 3, grade: "A" },
        { id: 6, name: "Technopreneurship", credits: 3, grade: "A" }
      ]
    }
  ];

  semestersData.forEach((sem) => {
    const ref = doc(collection(db, 'semesters'));
    batch.set(ref, {
      id: ref.id,
      userId,
      semesterNumber: sem.semesterNumber,
      subjects: sem.subjects,
      gpa: sem.gpa,
      totalCredits: sem.totalCredits,
      createdAt: new Date().toISOString(),
    });
  });

  // Commit batch
  await batch.commit();
};
