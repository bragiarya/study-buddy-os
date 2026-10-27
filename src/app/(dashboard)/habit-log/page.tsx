"use client";

import { useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { HabitForm } from "@/components/habit/HabitForm";
import { HabitCard } from "@/components/habit/HabitCard";
import { WeeklySummaryChart } from "@/components/habit/WeeklySummaryChart";
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HabitLogPage() {
  const { habits, loading } = useHabits();
  const [sortBy, setSortBy] = useState<"newest" | "alphabet">("newest");

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-3">
            <div className="h-10 w-48 bg-muted/60 rounded-xl animate-pulse"></div>
            <div className="h-5 w-64 bg-muted/40 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-20 w-36 bg-muted/50 rounded-2xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-16 w-full bg-muted/50 rounded-2xl animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-muted/30 rounded-2xl animate-pulse"></div>)}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="h-64 w-full bg-muted/50 rounded-3xl animate-pulse"></div>
            <div className="h-48 w-full bg-muted/50 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const completedToday = habits.filter(h => h.isCompleted).length;
  const totalHabits = habits.length;

  const sortedHabits = sortBy === "alphabet"
    ? [...habits].sort((a, b) => a.title.localeCompare(b.title))
    : habits;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <CheckCircle className="text-primary w-8 h-8" /> Habit Log
          </h1>
          <p className="text-muted-foreground mt-1 font-body">Konsistensi adalah kunci. Lacak target harianmu di sini.</p>
        </div>
        <div className="glass-panel px-6 py-3 rounded-2xl flex flex-col items-end">
          <span className="text-sm text-muted-foreground font-medium">Selesai Hari Ini</span>
          <span className="text-2xl font-heading font-bold text-primary">{completedToday} <span className="text-muted-foreground text-lg">/ {totalHabits}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          <HabitForm />
          
          <div className="flex justify-end items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Urutkan:</span>
            <Select 
              value={sortBy} 
              onValueChange={(value: "newest" | "alphabet") => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px] bg-card/50 backdrop-blur-sm border-border rounded-xl">
                <SelectValue placeholder="Urutkan Habit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru / Default</SelectItem>
                <SelectItem value="alphabet">Abjad (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {sortedHabits.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-2xl border-dashed">
                <p className="text-muted-foreground">Belum ada habit. Mulai dari kebiasaan kecil seperti "Membaca 10 Menit"!</p>
              </div>
            ) : (
              sortedHabits.map((habit) => <HabitCard key={habit.id} habit={habit} />)
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <WeeklySummaryChart habits={habits} />
          
          {/* Ini bagian yang diubah: Memanggil komponen AI yang sudah terhubung ke API */}
          <AIInsightCard habits={habits} />
        </div>
      </div>
    </div>
  );
}