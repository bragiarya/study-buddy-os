# ARCHITECTURE.md — Study Buddy OS
> Dokumen ini adalah sumber kebenaran tunggal (single source of truth) untuk arsitektur sistem.
> Gemini & Antigravity WAJIB mengikuti dokumen ini tanpa deviasi.

---

## 1. TECH STACK

| Layer | Teknologi | Alasan |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SSR, routing modern, performance optimal |
| **Styling** | Tailwind CSS + CSS Variables | Dark/light mode mudah, maintainable |
| **UI Components** | shadcn/ui | Konsisten, accessible, customizable |
| **Database** | Firebase Firestore | Realtime, free tier generous, NoSQL fleksibel |
| **Auth** | Firebase Auth (Google OAuth) | Google ecosystem, 1-klik login |
| **Storage** | Firebase Storage | Upload foto catatan (Analyze Images) |
| **AI Engine** | Gemini 2.5 Flash | PALING HEMAT — $5 budget kita |
| **AI Vision** | Gemini 2.5 Flash (multimodal) | Analyze Images fitur |
| **Deploy** | GCP Cloud Run | Pakai trial credits GCP, support Next.js SSR penuh via Docker |
| **State Management** | Local State + Zustand | React Local State untuk performa efisien, Zustand khusus authStore |

---

## 2. STRATEGI HEMAT AI ($5 BUDGET — KRITIS!)

> ⚠️ Budget Gemini API hanya $5. Setiap API call harus terencana.

### Aturan Wajib:
```
RULE #1: Cache semua response Gemini di Firestore. 
         Jangan panggil ulang kalau data belum berubah.

RULE #2: Gunakan SELALU Gemini 2.5 Flash (bukan Pro).
         Flash: ~$0.075/1M token input — jauh lebih hemat.

RULE #3: AI Insight (Gemini Intelligence) hanya dijalankan 
         1x per minggu per user, bukan real-time.

RULE #4: Chatbot menggunakan response streaming + 
         max_tokens dibatasi 500 token per response.

RULE #5: Analyze Images hanya dipanggil saat user 
         explicit klik tombol "Analyze", BUKAN auto.

RULE #6: Google Search integration menggunakan 
         Gemini Grounding (built-in, hemat token).
```

### Estimasi Penggunaan Token:
| Fitur | Frekuensi | Token/Call | Estimasi/Bulan |
|---|---|---|---|
| Weekly AI Insight | 4x/user/bulan | ~1.000 | Minimal |
| Analyze Images | On-demand | ~500 | Minimal |
| AI Chatbot | 10x/user/hari | ~300 | Dikontrol |
| Google Search | On-demand | ~200 | Minimal |

---

## 3. DATABASE SCHEMA (Firebase Firestore)

### Struktur Koleksi:

```
firestore/
├── users/
│   └── {userId}/
│       ├── profile: { name, email, photoURL, level, totalPoints, createdAt }
│       └── settings: { theme, notifications, weeklyGoal }
│
├── habits/
│   └── {userId}/
│       └── items/
│           └── {habitId}/
│               ├── name: string
│               ├── icon: string (emoji)
│               ├── category: string
│               ├── createdAt: timestamp
│               └── isActive: boolean
│
├── habit_logs/
│   └── {userId}/
│       └── logs/
│           └── {logId}/
│               ├── habitId: string (ref)
│               ├── date: string (YYYY-MM-DD)
│               ├── completedAt: timestamp
│               └── pointsEarned: number
│
├── streaks/
│   └── {userId}/
│       ├── currentStreak: number
│       ├── longestStreak: number
│       ├── lastCheckIn: string (YYYY-MM-DD)
│       └── totalPoints: number
│
├── resources/
│   └── {userId}/
│       └── items/
│           └── {resourceId}/
│               ├── title: string
│               ├── url: string (nullable)
│               ├── type: "link" | "note" | "pdf" | "image"
│               ├── subject: string (mata kuliah)
│               ├── tags: string[]
│               ├── content: string (catatan/rangkuman)
│               ├── aiSummary: string (nullable — dari Analyze Images)
│               ├── imageUrl: string (nullable — Firebase Storage)
│               ├── openCount: number
│               ├── createdAt: timestamp
│               └── updatedAt: timestamp
│
├── semesters/
│   └── {semesterId}/
│       ├── userId: string
│       ├── semesterNumber: number
│       ├── subjects: [
│       │     { id: number, name: string, credits: number, grade: string }
│       │   ]
│       ├── gpa: number
│       ├── totalCredits: number
│       └── createdAt: timestamp
│
└── ai_cache/
    └── {userId}/
        └── insights/
            └── {weekKey}/  ← format: "2024-W20"
                ├── insight: string
                ├── generatedAt: timestamp
                └── expiresAt: timestamp (7 hari dari generatedAt)
```

### Index yang Dibutuhkan (Firestore Composite):
```
habit_logs → userId + date (DESC)
resources  → userId + subject + createdAt (DESC)
resources  → userId + tags (ARRAY_CONTAINS)
semesters  → userId + semesterNumber (ASC)
```

---

## 4. DATA FLOW

### 4.1 Auth Flow
```
User klik "Login dengan Google"
    → Firebase Auth (Google OAuth)
    → Dapat userId
    → Cek apakah user doc sudah ada di Firestore
    → Jika belum: buat dokumen user baru (onboarding)
    → Jika sudah: langsung ke Dashboard
    → Simpan session di Firebase Auth (persisten)
```

### 4.2 Daily Habit Log Flow
```
User buka app setiap hari
    → Load habits dari Firestore (habits/{userId}/items)
    → Load log hari ini dari habit_logs/{userId}/logs (filter by date = today)
    → Tampilkan habit dengan status ✓ / ○
    
User centang habit
    → Tulis ke habit_logs/{userId}/logs/{logId}
    → Update streaks/{userId} (hitung streak)
    → Tambah points ke streaks/{userId}.totalPoints
    → Update level jika threshold tercapai
    → Reset otomatis: Cloud Function atau client-side check saat tengah malam
```

### 4.3 AI Insight Flow (Hemat Token)
```
User buka Weekly Summary
    → Cek ai_cache/{userId}/insights/{weekKey}
    → Jika cache ADA dan belum expired (< 7 hari): tampilkan dari cache
    → Jika cache TIDAK ADA atau expired:
        → Ambil data: habit_logs 7 hari terakhir + streaks
        → Format jadi prompt ringkas (< 500 token)
        → Panggil Gemini 2.5 Flash
        → Simpan response ke ai_cache (set expiry 7 hari)
        → Tampilkan ke user
```

### 4.4 Analyze Images Flow
```
User klik "Upload Foto Catatan"
    → User pilih gambar dari device
    → Preview gambar ditampilkan
    → User klik "Analyze dengan AI" (EXPLICIT — tidak auto)
    → Upload gambar ke Firebase Storage
    → Kirim imageUrl ke Gemini 2.5 Flash (multimodal)
    → Prompt: "Rangkum isi catatan ini dalam poin-poin utama. Bahasa Indonesia."
    → Tampilkan rangkuman
    → User konfirmasi → simpan ke resources dengan aiSummary
```

### 4.5 Resource Library Flow
```
User tambah resource
    → Input: title, url/content, subject, tags, type
    → Simpan ke resources/{userId}/items
    
User cari resource
    → Client-side filter by subject/tags/type (tidak perlu API call)
    → Sort by: terbaru / paling sering dibuka
    
User klik resource
    → Increment openCount (untuk "paling sering dibuka")
```

### 4.6 Smart Calculator Flow
```
User input nilai & SKS per matkul
    → Hitung GPA: Σ(gradePoint × credits) / Σ(credits) — pure client-side
    → Simpan ke gpa_records/{userId}/semesters
    
User minta simulasi
    → "Nilai berapa biar IPK naik ke 3.7?"
    → Hitung di client-side (algoritma, bukan AI)
    
User tanya AI Chatbot di Calculator
    → Ini satu-satunya AI call di Calculator
    → Panggil Gemini hanya jika pertanyaan kompleks
    → Batasi max_tokens: 300
```

---

## 5. FOLDER STRUCTURE (Next.js 14 App Router)

```
study-buddy-os/
├── .env.local                    ← API keys (JANGAN di-commit!)
├── .env.example                  ← Template env (boleh di-commit)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── package.json
│
├── public/
│   └── icons/                    ← App icons, favicon
│
├── src/
│   ├── app/                      ← Next.js App Router
│   │   ├── layout.tsx            ← Root layout (font, theme provider)
│   │   ├── page.tsx              ← Landing / redirect to dashboard
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx      ← Login page
│   │   └── (dashboard)/
│   │       ├── layout.tsx        ← Dashboard layout (sidebar)
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── habit-log/
│   │       │   └── page.tsx
│   │       ├── resource-library/
│   │       │   └── page.tsx
│   │       └── calculator/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                   ← shadcn/ui components (auto-generated)
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── habit/
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   ├── StreakBadge.tsx
│   │   │   └── WeeklySummaryChart.tsx
│   │   ├── resource/
│   │   │   ├── ResourceCard.tsx
│   │   │   ├── ResourceForm.tsx
│   │   │   ├── ImageAnalyzer.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── calculator/
│   │   │   ├── GPAForm.tsx
│   │   │   ├── GPAChart.tsx
│   │   │   └── SimulatorPanel.tsx
│   │   └── ai/
│   │       ├── AIInsightCard.tsx
│   │       └── AIChatbot.tsx
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts         ← Firebase init
│   │   │   ├── auth.ts           ← Auth helpers
│   │   │   ├── firestore.ts      ← Firestore helpers
│   │   │   └── storage.ts        ← Storage helpers
│   │   ├── gemini/
│   │   │   ├── client.ts         ← Gemini client init
│   │   │   ├── prompts.ts        ← Semua prompt template
│   │   │   └── cache.ts          ← Cache logic (baca Firestore dulu)
│   │   └── utils/
│   │       ├── gpa.ts            ← GPA calculation logic
│   │       └── (streak, points, date digabung ke logika komponen & helper demi efisiensi)
│   │
│   ├── hooks/
│   │   ├── useHabits.ts          ← Hook pelacak habit harian
│   │   ├── useResources.ts       ← Hook perpustakaan materi
│   │   └── useCalculator.ts      ← Hook kalkulator & riwayat nilai (menggantikan useGPA)
│   │
│   ├── stores/
│   │   └── authStore.ts          ← Zustand: user state (habitStore & uiStore digabung ke local/hook state demi efisiensi)
│   │
│   ├── types/
│   │   └── index.ts              ← Semua TypeScript types
│   │
│   └── styles/
│       └── globals.css           ← Tailwind base + CSS variables theme
│
└── docs/                         ← Semua dokumen arsitektur
    ├── ARCHITECTURE.md           ← (file ini)
    ├── DESIGN.md
    ├── CODING_STANDARDS.md
    └── MASTER_PROMPT.md
```

---

## 6. SECURITY

### Environment Variables (WAJIB):
```bash
# .env.local — JANGAN PERNAH DI-COMMIT KE GITHUB
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
GEMINI_API_KEY=xxx          ← Server-side only, TIDAK pakai NEXT_PUBLIC_
```

### Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User hanya bisa akses data milik sendiri
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    match /habits/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    match /habit_logs/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    match /streaks/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    match /resources/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    match /gpa_records/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    match /ai_cache/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
  }
}
```

### API Route Protection:
```
Semua panggilan ke Gemini API HARUS melalui Next.js API Routes (server-side).
DILARANG memanggil Gemini langsung dari client/browser.
Ini melindungi GEMINI_API_KEY dari exposure.

Pattern: Client → /api/ai/insight → Gemini API
         Client → /api/ai/analyze → Gemini API  
         Client → /api/ai/chat → Gemini API
```

---

## 7. GAMIFICATION SYSTEM

### Level & Points:
```
Poin per habit selesai   : +10 poin
Streak bonus (7 hari)    : +50 poin
Streak bonus (30 hari)   : +200 poin
Upload & analyze catatan : +15 poin
Tambah resource baru     : +5 poin

Level 1 — Pemula         : 0 - 199 poin
Level 2 — Pelajar        : 200 - 499 poin
Level 3 — Mahasiswa      : 500 - 999 poin
Level 4 — Scholar        : 1.000 - 2.499 poin
Level 5 — Academic Pro   : 2.500+ poin
```

---

## 8. RESPONSIVE BREAKPOINTS

```css
Mobile  : < 768px   → Sidebar menjadi bottom navigation
Tablet  : 768-1024px → Sidebar collapsed (icon only)
Desktop : > 1024px  → Sidebar full dengan label
```

---

## 9. THEME SYSTEM (Light & Dark Mode)

```css
/* Light Mode */
--bg-primary: #F0F4F8
--bg-surface: #FFFFFF
--bg-sidebar: #FFFFFF
--text-primary: #1A202C
--text-secondary: #4A5568
--accent-primary: #0D9488    /* Teal — dari design ref */
--accent-secondary: #06B6D4  /* Cyan */
--border: #E2E8F0

/* Dark Mode */
--bg-primary: #0F1117
--bg-surface: #1A1D27
--bg-sidebar: #13151F
--text-primary: #F7FAFC
--text-secondary: #A0AEC0
--accent-primary: #2DD4BF
--accent-secondary: #22D3EE
--border: #2D3748
```

---

## 10. API ROUTES YANG DIBUTUHKAN

```
POST /api/ai/insight     → Weekly AI insight (dengan cache check)
POST /api/ai/analyze     → Analyze gambar catatan
POST /api/ai/chat        → Chatbot response (streaming)
POST /api/ai/search      → Google Search via Gemini Grounding
```

---

*Dokumen ini dibuat sebagai fondasi arsitektur Study Buddy OS.*
*Versi: 1.0 | Tanggal: Mei 2025*
*Setiap perubahan arsitektur HARUS diupdate di dokumen ini terlebih dahulu.*
