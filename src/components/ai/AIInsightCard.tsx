"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { aiCacheHelper } from "@/lib/gemini/cache";
import { Habit } from "@/types";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function AIInsightCard({ habits }: { habits: Habit[] }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const generateInsight = async (force = false) => {
    if (!user || habits.length === 0) return;
    setLoading(true);

    try {
      // 1. Cek Cache dulu kecuali dipaksa refresh
      if (!force) {
        const cached = await aiCacheHelper.getCachedInsight(user.uid);
        if (cached) {
          setInsight(cached);
          setLoading(false);
          return;
        }
      }

      // 2. Jika tidak ada cache atau force refresh, panggil API
      const res = await fetch("/api/ai/insight", {
        method: "POST",
        body: JSON.stringify({ userId: user.uid, habitsData: habits }),
      });
      
      const data = await res.json();
      if (data.insight) {
        setInsight(data.insight);
        await aiCacheHelper.setCachedInsight(user.uid, data.insight);
      }
    } catch (error) {
      toast.error("Gagal mendapatkan insight AI");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsight();
  }, [user, habits.length]);

  return (
    <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
        <Sparkles className="w-16 h-16 text-primary" />
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-heading font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> AI Insight
        </h3>
        <button 
          onClick={() => generateInsight(true)} 
          disabled={loading}
          className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Menganalisa pola belajarmu...
        </div>
      ) : insight ? (
        <p className="text-sm leading-relaxed text-foreground/90 font-body animate-in fade-in duration-700">
          "{insight}"
        </p>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Belum ada cukup data untuk dianalisa. Terus catat habit-mu ya!
        </p>
      )}
    </div>
  );
}