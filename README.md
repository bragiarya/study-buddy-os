# Study Buddy OS

Study Buddy OS adalah aplikasi pendamping belajar berbasis Next.js, Firebase, dan Gemini AI. Aplikasi menyediakan dashboard belajar, kalkulator GPA, pencatatan kebiasaan, perpustakaan sumber belajar, serta fitur bantuan AI.

## Problem

Pelajar membutuhkan satu ruang kerja yang membantu mengatur aktivitas belajar, mengakses data secara terpusat, dan mendapatkan bantuan AI tanpa berpindah-pindah aplikasi.

## Method

Proyek dirancang sebagai aplikasi web Next.js dengan Firebase untuk layanan backend dan Gemini AI untuk fitur generative AI. Konfigurasi deployment dipisahkan dari source code menggunakan environment variables.

## Process

1. Siapkan environment variables lokal berdasarkan `.env.example`.
2. Install dependency dengan `npm ci`.
3. Jalankan aplikasi dengan `npm run dev`.
4. Validasi production build dengan `npm run build`.
5. Deploy melalui Docker dan Google Cloud Build/Cloud Run.

## Technology

- Next.js 14, React 18, TypeScript
- Tailwind CSS dan Radix UI
- Firebase
- Google Gemini AI
- Docker
- Google Cloud Build dan Cloud Run

## Status

Source aplikasi tersedia di `src/`. Sebelum menjalankan atau men-deploy aplikasi, siapkan konfigurasi Firebase dan Gemini melalui environment variables seperti dijelaskan di bawah. Jangan commit file `.env.local` atau membagikan nilai API key.

## Setup dan instalasi

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Environment variables

Salin `.env.example` menjadi `.env.local`, lalu isi nilainya dari Firebase dan Google AI Studio. Jangan commit `.env.local` atau file environment lain yang berisi secret.

## Cara menjalankan aplikasi

```bash
npm run dev      # development
npm run build    # production build
npm run start    # jalankan hasil build
```

## Instruksi deployment

Deployment menggunakan `Dockerfile`, `cloudbuild.yaml`, dan `deploy.ps1`. Set semua environment variables di environment deployment atau secret manager sebelum menjalankan proses build. Jangan menaruh API key langsung di source code, Dockerfile, atau repository public.

## Dokumentasi

Dokumentasi arsitektur tersedia di folder `dokumen arsitektur/`.
