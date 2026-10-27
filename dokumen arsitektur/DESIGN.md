# DESIGN.md — Study Buddy OS
> Design system wajib diikuti oleh semua komponen.
> Referensi visual: Dashboard CoachPro (soft glassmorphism, teal primary, card-based layout)

---

## 1. DESIGN PHILOSOPHY

```
Kata kunci: "Clean · Modern · Trustworthy · Smart"

Bukan sekadar app belajar — ini terasa seperti command center pribadi.
Setiap elemen harus membuat user merasa: "Gua in control."

Inspirasi: CoachPro dashboard — sidebar kiri, card-based content,
           warna soft dengan aksen teal yang kuat.
```

---

## 2. COLOR SYSTEM

### Primary Palette
```css
/* TEAL — Warna utama brand */
--teal-50:  #F0FDFA
--teal-100: #CCFBF1
--teal-400: #2DD4BF
--teal-500: #14B8A6   /* Primary action */
--teal-600: #0D9488   /* Hover state */
--teal-700: #0F766E   /* Active state */

/* CYAN — Aksen sekunder */
--cyan-400: #22D3EE
--cyan-500: #06B6D4

/* SLATE — Netral */
--slate-50:  #F8FAFC
--slate-100: #F1F5F9
--slate-200: #E2E8F0
--slate-400: #94A3B8
--slate-600: #475569
--slate-700: #334155
--slate-800: #1E293B
--slate-900: #0F172A
```

### Semantic Colors
```css
--color-success: #10B981   /* Habit selesai, streak active */
--color-warning: #F59E0B   /* Perhatian, deadline dekat */
--color-danger:  #EF4444   /* Error, streak putus */
--color-info:    #3B82F6   /* Info, tips */
```

### Theme Variables (Light / Dark)
```css
/* ===== LIGHT MODE ===== */
[data-theme="light"] {
  --bg-app:        #F0F4F8;      /* Background halaman */
  --bg-surface:    #FFFFFF;      /* Card, panel */
  --bg-sidebar:    #FFFFFF;      /* Sidebar */
  --bg-hover:      #F8FAFC;      /* Hover state item */
  --bg-input:      #F1F5F9;      /* Input field */

  --text-primary:  #1A202C;
  --text-secondary:#4A5568;
  --text-muted:    #94A3B8;
  --text-inverse:  #FFFFFF;

  --border:        #E2E8F0;
  --border-focus:  #14B8A6;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.08);

  --gradient-bg: linear-gradient(135deg, #F0F4F8 0%, #E8F4F8 100%);
  --gradient-card: linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%);
  --gradient-accent: linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%);
}

/* ===== DARK MODE ===== */
[data-theme="dark"] {
  --bg-app:        #0F1117;
  --bg-surface:    #1A1D27;
  --bg-sidebar:    #13151F;
  --bg-hover:      #1E2130;
  --bg-input:      #0F1117;

  --text-primary:  #F7FAFC;
  --text-secondary:#A0AEC0;
  --text-muted:    #4A5568;
  --text-inverse:  #0F1117;

  --border:        #2D3748;
  --border-focus:  #2DD4BF;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.4);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.5);

  --gradient-bg: linear-gradient(135deg, #0F1117 0%, #131820 100%);
  --gradient-card: linear-gradient(135deg, #1A1D27 0%, #1E2535 100%);
  --gradient-accent: linear-gradient(135deg, #2DD4BF 0%, #22D3EE 100%);
}
```

---

## 3. TYPOGRAPHY

```css
/* Font Stack */
--font-display: 'Plus Jakarta Sans', sans-serif;   /* Heading, brand */
--font-body:    'DM Sans', sans-serif;              /* Body text, UI */
--font-mono:    'JetBrains Mono', monospace;        /* Code, angka GPA */

/* Import di globals.css */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

/* Scale */
--text-xs:   0.75rem   /* 12px — label kecil */
--text-sm:   0.875rem  /* 14px — caption, label */
--text-base: 1rem      /* 16px — body */
--text-lg:   1.125rem  /* 18px — sub-heading */
--text-xl:   1.25rem   /* 20px — card title */
--text-2xl:  1.5rem    /* 24px — page section title */
--text-3xl:  1.875rem  /* 30px — page title */
--text-4xl:  2.25rem   /* 36px — hero number (IPK, streak) */
```

---

## 4. LAYOUT SYSTEM

### Sidebar (Desktop)
```
Lebar     : 240px (expanded) / 72px (collapsed)
Posisi    : Fixed left
Bg        : var(--bg-sidebar)
Border    : 1px solid var(--border) di sisi kanan

Struktur:
┌─────────────────┐
│ 🎓 StudyBuddy   │  ← Logo + nama app
│ ─────────────── │
│ ■ Dashboard     │  ← Nav item active
│   Habit Log     │  ← Nav item
│   Resources     │
│   Calculator    │
│ ─────────────── │
│ [Avatar] Nama   │  ← User profile (bottom)
│ ☀️ / 🌙 Theme  │  ← Theme toggle
└─────────────────┘
```

### Main Content Area
```
Margin left : 240px (mengikuti sidebar)
Padding     : 24px
Max-width   : 1200px (centered pada layar sangat lebar)
```

### Grid System
```css
/* Dashboard cards */
.grid-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

/* Stats row (angka-angka kecil) */
.grid-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
```

---

## 5. COMPONENT DESIGN SPECS

### 5.1 Card
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* Card dengan accent kiri */
.card-accent-left {
  border-left: 3px solid var(--teal-500);
}
```

### 5.2 Button
```
PRIMARY   → bg: teal-500, text: white, hover: teal-600
SECONDARY → bg: transparent, border: teal-500, text: teal-500
GHOST     → bg: transparent, text: text-secondary, hover: bg-hover
DANGER    → bg: red-500, text: white
ICON      → 36x36px, rounded-full, ghost style

Border-radius semua button: 10px
Padding: 10px 20px (medium), 8px 16px (small)
Font: DM Sans, 500 weight
Transition: all 0.15s ease
```

### 5.3 Habit Card
```
┌──────────────────────────────────┐
│ 📖  Baca Buku          [✓] / [○] │  ← Nama + checkbox
│     Kategori: Reading            │  ← Sub-info
│     +10 poin                     │  ← Reward
└──────────────────────────────────┘

Selesai: bg berubah ke teal-50 (light) / teal-900/20 (dark)
         Checkbox ✓ berwarna teal
         Text sedikit muted
```

### 5.4 Streak Badge
```
┌─────────────────┐
│  🔥  7 Hari     │  ← Large number + icon
│  Streak aktif   │  ← Label kecil
└─────────────────┘

Gradient: teal ke cyan (jika streak aktif)
Warna abu: jika streak 0
```

### 5.5 Resource Card
```
┌──────────────────────────────────┐
│ [ICON]  Judul Resource      [⋮]  │
│ 🏷️ Matkul  ·  📎 link           │
│ Tag: [algo] [ds] [week3]         │
│ Dibuka 12x  ·  2 hari lalu      │
└──────────────────────────────────┘

Icon per type:
  link  → 🔗 (cyan)
  note  → 📝 (teal)
  pdf   → 📄 (orange)
  image → 🖼️ (purple)
```

### 5.6 GPA Display (Calculator)
```
┌─────────────────────────────────┐
│         IPK Kamu                │
│          3.75                   │  ← Font: JetBrains Mono, 4xl, teal
│    ████████████░░  93.7%        │  ← Progress bar
│  dari target 4.00               │
└─────────────────────────────────┘
```

### 5.7 AI Insight Card
```
┌──────────────────────────────────┐
│ ✨ Insight Minggu Ini       [↺]  │
│ ─────────────────────────────── │
│ "Kamu paling produktif di hari  │
│  Selasa. Jadwalkan materi berat │
│  di hari itu!"                  │
│                                 │
│ 📊 Dianalisa dari 7 hari data  │
└──────────────────────────────────┘

Background: gradient accent tipis (teal-500/10)
Border: 1px solid teal-500/30
Teks insight: italic, teal-700 (light) / teal-300 (dark)
```

### 5.8 Sidebar Nav Item
```css
/* Default */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 10px;
  color: var(--text-secondary);
  transition: all 0.15s ease;
}

/* Active */
.nav-item.active {
  background: linear-gradient(90deg, teal-500/15, transparent);
  color: var(--teal-600);   /* light */
  color: var(--teal-400);   /* dark */
  font-weight: 600;
  border-left: 3px solid var(--teal-500);  /* opsional */
}

/* Hover */
.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
```

---

## 6. ICONOGRAPHY

```
Library   : Lucide React (sudah include di shadcn/ui)
Size      : 18px (nav), 20px (card), 24px (section heading)
Stroke    : 1.5px (konsisten)

Icon per modul:
  Dashboard      → LayoutDashboard
  Daily Habit    → CalendarCheck
  Resource Lib   → BookOpen (atau Library)
  Calculator     → Calculator
  AI Insight     → Sparkles
  Chatbot        → MessageSquare
  Settings       → Settings
  User           → User
  Theme toggle   → Sun / Moon
  Streak         → Flame
  Points         → Star
  Upload         → Upload
  Analyze        → ScanSearch
  Search         → Search
  Add            → Plus
  Delete         → Trash2
  Edit           → Pencil
  Export         → Download
  Share          → Share2
```

---

## 7. ANIMATION & MICRO-INTERACTIONS

```css
/* Durasi standar */
--transition-fast:   0.15s ease
--transition-normal: 0.25s ease
--transition-slow:   0.4s ease

/* Page load — staggered reveal */
.card { animation: fadeSlideUp 0.3s ease forwards; }
.card:nth-child(2) { animation-delay: 0.05s; }
.card:nth-child(3) { animation-delay: 0.10s; }
.card:nth-child(4) { animation-delay: 0.15s; }

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Habit checkbox — satisfying check */
.habit-check { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.habit-check.done { transform: scale(1.15) → scale(1); }

/* Streak number — bounce */
.streak-number.updated { animation: bounceIn 0.4s ease; }

/* AI Insight — typewriter feel */
.ai-text { animation: fadeIn 0.5s ease; }

/* Points popup */
@keyframes pointsFloat {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-30px); }
}
```

---

## 8. RESPONSIVE BEHAVIOR

### Mobile (< 768px)
```
Sidebar  → disembunyikan, diganti Bottom Navigation Bar
Header   → Hamburger menu + nama halaman + avatar
Cards    → Full width, 1 kolom
Stats    → 2x2 grid
```

### Tablet (768px - 1024px)
```
Sidebar  → Collapsed (icon only, 72px)
Cards    → 2 kolom
```

### Desktop (> 1024px)
```
Sidebar  → Full expanded (240px)
Cards    → 3-4 kolom (tergantung konten)
```

---

## 9. LOADING STATES

```
Skeleton loading: Gunakan untuk semua data dari Firestore
  → Warna: slate-200 (light) / slate-700 (dark)
  → Animasi: shimmer (CSS animation)

AI Loading: Khusus untuk Gemini API calls
  → Tampilkan "Gemini sedang berpikir..." dengan animasi dots
  → Warna: teal dengan pulse animation
  → JANGAN blank screen
```

---

## 10. EMPTY STATES

```
Setiap halaman HARUS punya empty state yang engaging:

Habit Log kosong:
  Ilustrasi + "Mulai journey belajarmu hari ini!"
  Button: "+ Tambah Kebiasaan Pertama"

Resource Library kosong:
  Ilustrasi + "Belum ada resource tersimpan"
  Button: "+ Tambah Resource"

Calculator kosong:
  Ilustrasi + "Hitung IPK semester pertamamu"
  Button: "+ Tambah Semester"
```

---

*Design System v1.0 — Study Buddy OS*
*Konsistensi adalah kunci. Jangan pernah hardcode warna di luar CSS variables.*
