"use client";
import { Flame } from "lucide-react";

export function StreakBadge({ current }: { current: number }) {
  if (current === 0) return null;
  return (
    <div className="flex items-center gap-1 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500 px-2 py-1 rounded-md text-xs font-bold w-fit">
      <Flame className="w-3 h-3" /> {current} Hari
    </div>
  );
}
