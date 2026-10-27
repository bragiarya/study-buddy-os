"use client";
import { AIChatbot } from "@/components/ai/AIChatbot";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }
  if (!user) return null;

  return (
    // UBAH 1: Gunakan h-[100dvh] agar menyesuaikan dengan bar navigasi sistem HP
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full relative">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/30 pb-32 md:pb-8">
          {children}
        </main>
        
        <BottomNav />
        <AIChatbot />
      </div>
    </div>
  );
}