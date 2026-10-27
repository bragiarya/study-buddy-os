"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useHabits } from "@/hooks/useHabits";
import { useResources } from "@/hooks/useResources";
import { useCalculator } from "@/hooks/useCalculator";
import { habitsHelper } from "@/lib/firebase/firestore";
import { db } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  Flame, 
  Star, 
  CheckCircle2, 
  BookOpen, 
  Calculator, 
  ArrowRight,
  Plus,
  Check
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Habit } from "@/types";
import { Button } from "@/components/ui/button";


// Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-muted rounded-md", className)} />
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { habits, loading: habitsLoading } = useHabits();
  const { resources, loading: resourcesLoading } = useResources();
  const { cumulativeGPA, loading: gpaLoading } = useCalculator();

  const [streakData, setStreakData] = useState<{ currentStreak: number } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoadingStats(false);
      return;
    }

    const streakRef = doc(db, "streaks", user.uid);
    const unsubscribeStreak = onSnapshot(streakRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStreakData({ currentStreak: data?.currentStreak || 0 });
      } else {
        setStreakData({ currentStreak: 0 });
      }
      setLoadingStats(false);
    }, (error) => {
      console.error("Error fetching streak:", error);
      setStreakData({ currentStreak: 0 });
      setLoadingStats(false);
    });

    return () => {
      unsubscribeStreak();
    };
  }, [user?.uid]);

  const unfinishedHabits = habits.filter((h) => !h.isCompleted).slice(0, 3);
  const latestResources = resources.slice(0, 2);

  const handleToggleHabit = async (habit: Habit) => {
    try {
      const newStatus = !habit.isCompleted;
      let newStreak = habit.currentStreak;
      let newLongest = habit.longestStreak;

      if (newStatus) {
        newStreak += 1;
        if (newStreak > newLongest) newLongest = newStreak;
      } else {
        newStreak = Math.max(0, newStreak - 1);
      }

      await habitsHelper.toggleHabit(habit.id, newStatus, newStreak, newLongest);
      if (newStatus && user?.uid) {
        await habitsHelper.updateUserPoints(user.uid, 10);
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loadingStats || habitsLoading ? (
          <>
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </>
        ) : (
          <>
            {/* Streak */}
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-orange-500">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Streak Hari Ini</p>
                <p className="text-lg font-bold">{streakData?.currentStreak || 0} Hari</p>
              </div>
            </div>

            {/* Total Points */}
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-yellow-500">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Poin</p>
                <p className="text-lg font-bold">{user?.totalPoints || 0} Poin</p>
              </div>
            </div>

            {/* Habit Progress */}
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-teal-500">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Habit Progress</p>
                <p className="text-lg font-bold">
                  {habits.filter((h) => h.isCompleted).length}/{habits.length} Selesai
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* WELCOME CARD */}
      <div className="glass-panel p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Selamat datang kembali, {user?.displayName}! 👋
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Siap untuk menjadi lebih produktif hari ini? Mari kita selesaikan target belajarmu dan raih poin maksimal.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      {/* 2. GRID WIDGET (2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Widget A: Habit Hari Ini */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-border/50 hover:border-primary/30 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-500" />
              Habit Hari Ini
            </h3>
            <Link href="/habit-log" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3 flex-grow">
            {habitsLoading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
            ) : unfinishedHabits.length > 0 ? (
              unfinishedHabits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors">
                  <span className="font-medium">{habit.title}</span>
                  <button 
                    onClick={() => handleToggleHabit(habit)}
                    className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group-hover:scale-110"
                  >
                    <Check className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground text-sm mb-2">Semua habit hari ini selesai!</p>
                <Link href="/habit-log" className="text-xs text-primary font-bold uppercase tracking-wider">Tambah Baru</Link>
              </div>
            )}
          </div>
        </div>

        {/* Widget B: Level & Poin */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-border/50 hover:border-primary/30 transition-all duration-300">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            Level & Poin
          </h3>
          
          <div className="flex flex-col items-center justify-center flex-grow space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center bg-primary/5">
                <span className="text-4xl font-bold text-primary">{user?.currentLevel || 1}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                LVL
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress Level</span>
                <span>{(user?.totalPoints || 0) % 100} / 100 XP</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out" 
                  style={{ width: `${(user?.totalPoints || 0) % 100}%` }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Dapatkan {100 - ((user?.totalPoints || 0) % 100)} poin lagi untuk naik ke level {(user?.currentLevel || 1) + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Widget C: Resource Terbaru */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-border/50 hover:border-primary/30 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Resource Terbaru
            </h3>
            <Link href="/resource-library" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3 flex-grow">
            {resourcesLoading ? (
              [1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
            ) : latestResources.length > 0 ? (
              latestResources.map((resource) => (
                <Link 
                  href={resource.url || "#"} 
                  target="_blank" 
                  key={resource.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">{resource.courseName}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground text-sm mb-2">Belum ada resource.</p>
                <Link href="/resource-library" className="text-xs text-primary font-bold uppercase tracking-wider">Tambah Resource</Link>
              </div>
            )}
          </div>
        </div>

        {/* Widget D: Kalkulator IPK */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-border/50 hover:border-primary/30 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-secondary" />
              Kalkulator IPK
            </h3>
            <Link href="/calculator" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              Detail <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center flex-grow">
            {gpaLoading ? (
              <Skeleton className="w-32 h-16 rounded-xl" />
            ) : cumulativeGPA > 0 ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">IPK Kumulatif</p>
                <div className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {cumulativeGPA.toFixed(2)}
                </div>
                <Link href="/calculator">
                  <button className="mt-4 px-6 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full text-sm font-bold transition-all border border-primary/20 mx-auto">
                    Update Data
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                  <Calculator className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Belum ada data nilai tersimpan.</p>
                <Link href="/calculator">
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all mx-auto">
                    <Plus className="w-4 h-4" />
                    Mulai Hitung IPK
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
