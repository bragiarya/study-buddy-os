"use client";
import { Habit } from "@/types";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { subDays, format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

export function WeeklySummaryChart({ habits }: { habits: Habit[] }) {
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const completedCount = habits.filter(h => h.lastCompletedAt && isSameDay(new Date(h.lastCompletedAt), date)).length;
    return { name: format(date, "EEE", { locale: id }), selesai: completedCount };
  });

  return (
    // 1. Tambahkan min-h-[300px] agar di HP layarnya tidak pernah terhimpit
    <div className="glass-panel p-6 rounded-2xl h-[300px] min-h-[300px] flex flex-col">
      <h3 className="font-heading font-semibold mb-4">Ringkasan 7 Hari</h3>
      
      {/* 2. Tambahkan min-h-0 dan relative. 
          min-h-0 sangat penting di flexbox agar tinggi tidak ambruk ke 0 saat render pertama */}
      <div className="flex-1 w-full min-h-0 relative text-xs">
        <ResponsiveContainer width="99%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="selesai" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}