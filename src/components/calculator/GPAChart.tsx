"use client";
import { SemesterResult } from "@/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function GPAChart({ data }: { data: SemesterResult[] }) {
  if (data.length === 0) return null;

  const chartData = data.map(d => ({
    semester: `Sem ${d.semesterNumber}`,
    ipk: d.gpa
  }));

  return (
    <div className="glass-panel p-6 rounded-2xl h-[300px]">
      <h3 className="font-heading font-semibold mb-4 text-sm text-muted-foreground">Tren IPK Tiap Semester</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="semester" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis domain={[0, 4]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
            itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
          />
          <Line type="monotone" dataKey="ipk" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
