'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '@/lib/firebase/auth';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (resolvedTheme || theme) : "dark";
  const logoSrc = activeTheme === "light" ? "/logo2-warnaGelap.png" : "/logo2-warnaTerang.png";

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userProfile = await loginWithGoogle();
      if (userProfile) {
        setUser(userProfile);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-body">
      {/* CSS Internal Khusus untuk Animasi Background */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .dot-grid {
          position: absolute; inset: 0;
          /* UBAH: Transparansi dinaikkan ke 0.4 dan ukuran titik diperbesar ke 1.5px */
          background-image: radial-gradient(circle, rgba(20, 184, 166, 0.35) 1.5px, transparent 1.5px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%);
          z-index: 0;
        }
        .streak { position: absolute; pointer-events: none; z-index: 1; }
        .streak--h1 { top: 25%; left: -200px; width: 250px; height: 1px; background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.6), transparent); animation: streakH 8s linear infinite; }
        .streak--h2 { top: 75%; left: -200px; width: 200px; height: 1px; background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent); animation: streakH 12s linear 4s infinite; }
        .streak--v1 { left: 35%; top: -200px; width: 1px; height: 250px; background: linear-gradient(180deg, transparent, rgba(20, 184, 166, 0.6), transparent); animation: streakV 10s linear 1.5s infinite; }
        .streak--v2 { left: 75%; top: -200px; width: 1px; height: 200px; background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.4), transparent); animation: streakV 14s linear 6s infinite; }
        
        @keyframes streakH { 0% { left: -250px; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
        @keyframes streakV { 0% { top: -250px; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
      `}} />

      {/* Latar Belakang Animasi */}
      <div className="dot-grid pointer-events-none"></div>
      <div className="streak streak--h1"></div>
      <div className="streak streak--h2"></div>
      <div className="streak streak--v1"></div>
      <div className="streak streak--v2"></div>

      {/* Wide Command Center Card (Layout 2 Kolom) */}
      <div className="relative z-10 w-full max-w-4xl mx-4 rounded-3xl flex flex-col md:flex-row overflow-hidden backdrop-blur-xl bg-background/70 border border-white/10 dark:border-white/5 shadow-2xl">

        {/* Kolom Kiri: Branding & Informasi */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-center relative overflow-hidden">
          {/* Aksen cahaya halus di sudut kiri atas kotak */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="shrink-0">
                <Image src={logoSrc} alt="Logo" width={48} height={48} className="object-contain" />
              </div>
              <span className="font-heading font-bold text-lg text-primary tracking-wide">Study Buddy OS</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight mb-4 text-foreground">
              Sistem Operasi <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Produktivitas Belajar
              </span>
            </h1>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
              Masuk ke ruang belajar personalmu. Akses materi, catat habit harian, dan pantau target akademik — semua terintegrasi dalam satu command center pintar.
            </p>
          </div>
        </div>

        {/* Pemisah Kolom (Garis Tipis) */}
        <div className="hidden md:block w-px bg-border/50"></div>
        <div className="block md:hidden h-px bg-border/50 mx-8"></div>

        {/* Kolom Kanan: Area Aksi (Login) */}
        <div className="flex-1 p-8 md:p-14 flex flex-col items-center justify-center bg-muted/10 relative overflow-hidden">
          {/* Aksen cahaya halus di sudut kanan bawah kotak */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
            <div className="w-16 h-16 bg-background rounded-2xl shadow-sm border flex items-center justify-center mb-6">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>

            <h2 className="text-xl font-bold mb-2">Selamat Datang</h2>
            <p className="text-sm text-muted-foreground mb-8 text-center">Gunakan akun Google universitas atau pribadimu untuk melanjutkan.</p>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Lanjutkan dengan Google'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}