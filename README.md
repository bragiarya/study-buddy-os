# Study Buddy OS

Study Buddy OS adalah aplikasi pendamping belajar yang menyatukan berbagai kebutuhan akademik dalam satu tempat. Dibangun dengan Next.js, Firebase, dan Gemini AI, aplikasi ini menyediakan dashboard belajar, kalkulator GPA, pencatatan kebiasaan, perpustakaan sumber belajar, serta fitur bantuan AI.

## Problem

Aktivitas belajar sering tersebar di berbagai aplikasi: progres sulit dipantau, kebiasaan belajar tidak tercatat, dan sumber belajar maupun bantuan akademik berada di tempat yang berbeda. Kondisi ini membuat pelajar perlu berpindah-pindah alat untuk mengelola kegiatan belajar sehari-hari.

## Method

Study Buddy OS menjawab kebutuhan tersebut melalui satu aplikasi web yang menggabungkan alat pengelolaan belajar dan dukungan AI. Firebase digunakan untuk layanan backend dan pengelolaan data, sementara Gemini AI mendukung fitur bantuan akademik. Konfigurasi aplikasi disimpan dalam environment variables agar dapat disesuaikan untuk setiap lingkungan tanpa menaruh nilai konfigurasi privat di source code.

## Process

Pengembangan dimulai dengan menyiapkan konfigurasi Firebase dan Gemini, lalu memasang dependency proyek. Aplikasi dapat dijalankan secara lokal untuk pengembangan dan diperiksa melalui production build sebelum dirilis. Untuk deployment, proyek menyediakan konfigurasi Docker serta alur Google Cloud Build dan Cloud Run. Langkah menjalankan aplikasi dan menyiapkan environment variables dijelaskan pada bagian berikutnya.

## Technology

- **Next.js 14, React 18, dan TypeScript** untuk membangun aplikasi web.
- **Tailwind CSS dan Radix UI** untuk antarmuka dan komponen interaktif.
- **Firebase** untuk layanan backend dan pengelolaan data.
- **Google Gemini AI** untuk fitur berbasis kecerdasan buatan generatif.
- **Docker, Google Cloud Build, dan Cloud Run** untuk proses build dan deployment.

## Result & Temuan

Fitur inti aplikasi tersedia dalam satu alur belajar: pengguna dapat meninjau dashboard, menghitung GPA, mencatat kebiasaan, mengelola sumber belajar, dan mengakses dukungan AI. Pada validasi lokal terakhir, production build berhasil dibuat. Pemeriksaan lint masih menemukan sejumlah masalah pada source code, seperti import yang tidak digunakan dan tipe yang perlu diperjelas; hal ini perlu ditangani sebelum menjadikan lint sebagai pemeriksaan yang lulus.

Source aplikasi berada di `src/`. Sebelum menjalankan atau men-deploy aplikasi, siapkan konfigurasi Firebase dan Gemini melalui environment variables seperti dijelaskan di bawah. Jangan commit file `.env.local` atau membagikan nilai API key.

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
