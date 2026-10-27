"use client";
import { useState } from "react";
import { Habit } from "@/types";
import { habitsHelper } from "@/lib/firebase/firestore";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { StreakBadge } from "./StreakBadge";
import { toast } from "sonner";
import { isSameDay } from "date-fns";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function HabitCard({ habit }: { habit: Habit }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleToggle = async () => {
    try {
      const now = new Date();
      const alreadyCompletedToday = habit.lastCompletedAt ? isSameDay(habit.lastCompletedAt, now) : false;
      let newStreak = habit.currentStreak;
      const newCompletedState = !habit.isCompleted;

      if (newCompletedState) {
        if (!alreadyCompletedToday) newStreak += 1;
        const newLongest = Math.max(newStreak, habit.longestStreak);
        await habitsHelper.toggleHabit(habit.id, true, newStreak, newLongest);
        await habitsHelper.updateUserPoints(habit.userId, 10);
        toast.success("Mantap! +10 Pts");
      } else {
        if (newStreak > 0 && alreadyCompletedToday) newStreak -= 1;
        await habitsHelper.toggleHabit(habit.id, false, newStreak, habit.longestStreak);
      }
    } catch (error) {
      toast.error("Gagal mengubah status habit");
    }
  };

  const executeDelete = async () => {
    try {
      await habitsHelper.deleteHabit(habit.id);
      toast.success("Habit dihapus");
    } catch (error) {
      toast.error("Gagal menghapus habit");
    } finally {
      setIsDeleteOpen(false);
    }
  };

  return (
    <>
      <div className={`glass-panel p-4 rounded-2xl flex items-center justify-between transition-all ${habit.isCompleted ? 'opacity-60 bg-muted/50' : ''}`}>
        <div className="flex items-center gap-4">
          <Checkbox checked={habit.isCompleted} onCheckedChange={handleToggle} className="w-6 h-6 rounded-full" />
          <div>
            <p className={`font-medium ${habit.isCompleted ? 'line-through text-muted-foreground' : ''}`}>{habit.title}</p>
            <StreakBadge current={habit.currentStreak} />
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsDeleteOpen(true)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <ConfirmDialog 
        isOpen={isDeleteOpen} 
        title="Hapus Habit" 
        description={`Apakah kamu yakin ingin menghapus habit "${habit.title}"?`} 
        onConfirm={executeDelete} 
        onCancel={() => setIsDeleteOpen(false)} 
        confirmText="Hapus" 
      />
    </>
  );
}

