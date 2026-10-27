# CODING_STANDARDS.md — Study Buddy OS
> Semua kode WAJIB mengikuti standar ini.
> Gemini & Antigravity tidak boleh deviasi dari konvensi berikut.

---

## 1. BAHASA & FRAMEWORK

```
TypeScript   : WAJIB. Tidak ada file .js (kecuali config)
React        : Functional components ONLY. Tidak ada class components.
Next.js      : App Router ONLY. Tidak ada Pages Router.
Tailwind     : Utility-first. CSS custom hanya di globals.css untuk variables.
```

---

## 2. FILE NAMING

```
Component    : PascalCase      → HabitCard.tsx, AIInsightCard.tsx
Hook         : camelCase       → useHabits.ts, useAIInsight.ts
Utility      : camelCase       → gpaCalculator.ts, streakHelper.ts
Store        : camelCase       → habitStore.ts, authStore.ts
Type file    : camelCase       → index.ts (di folder types/)
API Route    : kebab-case dir  → /api/ai/analyze/route.ts
Page         : page.tsx        → selalu page.tsx (Next.js convention)
Layout       : layout.tsx      → selalu layout.tsx
```

---

## 3. COMPONENT STRUCTURE

```tsx
// ✅ BENAR — Urutan wajib dalam setiap component file

// 1. Imports (grouped)
import { useState, useEffect } from 'react'           // React
import { useRouter } from 'next/navigation'            // Next.js
import { doc, getDoc } from 'firebase/firestore'       // Firebase
import { Flame, Star } from 'lucide-react'             // Icons
import { Button } from '@/components/ui/button'        // shadcn/ui
import { useHabits } from '@/hooks/useHabits'          // Internal hooks
import { cn } from '@/lib/utils'                       // Utilities
import type { Habit } from '@/types'                   // Types

// 2. Type/Interface definition
interface HabitCardProps {
  habit: Habit
  isCompleted: boolean
  onToggle: (habitId: string) => void
}

// 3. Component (named export — bukan default)
export function HabitCard({ habit, isCompleted, onToggle }: HabitCardProps) {
  // 3a. Hooks (selalu di atas)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // 3b. Derived state / computed values
  const cardClass = cn(
    'card',
    isCompleted && 'opacity-75 bg-teal-50 dark:bg-teal-900/10'
  )
  
  // 3c. Event handlers
  const handleToggle = () => {
    setIsAnimating(true)
    onToggle(habit.id)
    setTimeout(() => setIsAnimating(false), 300)
  }
  
  // 3d. Effects (jika ada)
  useEffect(() => {
    // ...
  }, [])
  
  // 3e. JSX return
  return (
    <div className={cardClass}>
      {/* ... */}
    </div>
  )
}
```

---

## 4. TYPESCRIPT TYPES

```typescript
// src/types/index.ts — Semua types di sini

export interface User {
  id: string
  name: string
  email: string
  photoURL: string | null
  level: number
  totalPoints: number
  createdAt: Date
}

export interface Habit {
  id: string
  userId: string
  name: string
  icon: string
  category: string
  createdAt: Date
  isActive: boolean
}

export interface HabitLog {
  id: string
  habitId: string
  date: string          // Format: YYYY-MM-DD
  completedAt: Date
  pointsEarned: number
}

export interface Streak {
  currentStreak: number
  longestStreak: number
  lastCheckIn: string   // Format: YYYY-MM-DD
  totalPoints: number
}

export interface Resource {
  id: string
  userId: string
  title: string
  url: string | null
  type: 'link' | 'note' | 'pdf' | 'image'
  subject: string
  tags: string[]
  content: string
  aiSummary: string | null
  imageUrl: string | null
  openCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  name: string
  credits: number
  grade: string         // 'A', 'A-', 'B+', 'B', dst
  gradePoint: number    // 4.0, 3.7, 3.3, 3.0, dst
}

export interface GPARecord {
  id: string
  userId: string
  semesterName: string
  year: string
  courses: Course[]
  gpa: number
  totalCredits: number
  createdAt: Date
}

export interface AICache {
  insight: string
  generatedAt: Date
  expiresAt: Date
}

// API Response types
export interface APIResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}
```

---

## 5. FIREBASE HELPERS PATTERN

```typescript
// src/lib/firebase/firestore.ts

// ✅ Pattern untuk semua Firestore operations
// Selalu gunakan try-catch
// Selalu return typed response

export async function getUserStreak(userId: string): Promise<Streak | null> {
  try {
    const docRef = doc(db, 'streaks', userId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) return null
    
    return docSnap.data() as Streak
  } catch (error) {
    console.error('[Firestore] getUserStreak error:', error)
    return null
  }
}

// ✅ Real-time subscription pattern
export function subscribeToHabits(
  userId: string,
  callback: (habits: Habit[]) => void
) {
  const q = query(
    collection(db, 'habits', userId, 'items'),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const habits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Habit[]
    callback(habits)
  })
}
```

---

## 6. GEMINI API PATTERN

```typescript
// src/lib/gemini/client.ts

import { GoogleGenerativeAI } from '@google/generative-ai'

// ✅ Singleton — inisialisasi sekali
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiFlash = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',  // SELALU Flash, bukan Pro
})

// src/lib/gemini/cache.ts

// ✅ WAJIB cek cache sebelum panggil Gemini
export async function getWeeklyInsight(
  userId: string,
  weekKey: string,
  generateFn: () => Promise<string>
): Promise<string> {
  // 1. Cek cache Firestore
  const cacheRef = doc(db, 'ai_cache', userId, 'insights', weekKey)
  const cacheSnap = await getDoc(cacheRef)
  
  if (cacheSnap.exists()) {
    const cache = cacheSnap.data() as AICache
    const now = new Date()
    if (cache.expiresAt.toDate() > now) {
      console.log('[AI Cache] HIT — tidak panggil Gemini')
      return cache.insight
    }
  }
  
  // 2. Cache miss — panggil Gemini
  console.log('[AI Cache] MISS — memanggil Gemini')
  const insight = await generateFn()
  
  // 3. Simpan ke cache (expire 7 hari)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  
  await setDoc(cacheRef, {
    insight,
    generatedAt: new Date(),
    expiresAt
  })
  
  return insight
}
```

---

## 7. API ROUTE PATTERN (Next.js)

```typescript
// src/app/api/ai/insight/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'

// ✅ Setiap API route HARUS:
// 1. Validasi auth
// 2. Validasi input
// 3. Error handling
// 4. Typed response

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.split('Bearer ')[1]
    const decoded = await getAuth().verifyIdToken(token)
    const userId = decoded.uid
    
    // 2. Input validation
    const body = await req.json()
    if (!body.weekKey || typeof body.weekKey !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    
    // 3. Business logic
    const insight = await getWeeklyInsight(userId, body.weekKey, async () => {
      // generate dari Gemini...
    })
    
    // 4. Success response
    return NextResponse.json({ data: insight, success: true })
    
  } catch (error) {
    console.error('[API/ai/insight] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## 8. CUSTOM HOOK PATTERN

```typescript
// src/hooks/useHabits.ts

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!user) return
    
    setIsLoading(true)
    
    // Realtime subscription
    const unsubscribe = subscribeToHabits(user.uid, (data) => {
      setHabits(data)
      setIsLoading(false)
    })
    
    return () => unsubscribe() // ✅ Cleanup wajib
  }, [user])
  
  const toggleHabit = async (habitId: string) => {
    // optimistic update...
  }
  
  return { habits, isLoading, error, toggleHabit }
}
```

---

## 9. ERROR HANDLING RULES

```
✅ WAJIB:
  - Setiap async function: try-catch
  - Setiap API call: loading + error state
  - User-facing error: tampilkan toast notification (bukan console.error)
  - Firestore fail: tampilkan empty state, bukan crash

❌ DILARANG:
  - console.log di production (gunakan conditional: if (process.env.NODE_ENV === 'development'))
  - Throw error tanpa catch di component level
  - Menampilkan stack trace ke user
  - Silent fail (error diabaikan tanpa feedback ke user)
```

---

## 10. COMMIT MESSAGE FORMAT

```
feat: tambah fitur analyze images di resource library
fix: perbaiki streak counter yang tidak reset tengah malam
style: update warna button primary ke teal-600
refactor: pisah logika GPA ke utility function
docs: update ARCHITECTURE.md dengan schema baru
chore: update dependency next ke 14.2.0
```

---

## 11. ENVIRONMENT & SECRETS

```
❌ DILARANG KERAS:
  - Hardcode API key di kode manapun
  - Commit file .env.local ke GitHub
  - Gunakan NEXT_PUBLIC_ untuk Gemini API key
  
✅ WAJIB:
  - Semua key di .env.local
  - Gemini key: GEMINI_API_KEY (server-side only)
  - Firebase public config: NEXT_PUBLIC_FIREBASE_* (aman)
  - Pastikan .env.local ada di .gitignore
```

---

*Coding Standards v1.0 — Study Buddy OS*
*Standar ini tidak bisa dikompromikan demi kecepatan development.*
