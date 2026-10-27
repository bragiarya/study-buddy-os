export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  currentLevel: number;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  currentStreak: number;
  longestStreak: number;
  createdAt: Date;
  lastCompletedAt?: Date;
}

export interface Resource {
  id: string;
  userId: string;
  title: string;
  type: 'link' | 'note' | 'pdf' | 'image';
  url?: string;
  content?: string;
  tags: string[];
  courseName: string;
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
}

export interface CourseGrade {
  id: string;
  userId: string;
  courseName: string;
  credits: number; // SKS
  grade: string; // A, B, C, D, E
  semester: number;
  createdAt: Date;
}

export interface Subject {
  id: number;
  name: string;
  credits: number;
  grade: string;
}

export interface SemesterResult {
  id: string;
  userId: string;
  semesterNumber: number;
  subjects: Subject[];
  gpa: number;
  totalCredits: number;
  createdAt: Date;
}

