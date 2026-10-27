"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { habitsHelper } from "@/lib/firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function HabitForm() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    setIsLoading(true);
    try {
      await habitsHelper.addHabit(user.uid, title.trim());
      setTitle("");
      toast.success("Habit ditambahkan!");
    } catch (error) {
      toast.error("Gagal menambahkan habit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tambah target belajar harian..." className="bg-card h-12 rounded-xl" disabled={isLoading} />
      <Button type="submit" className="h-12 px-6 rounded-xl" disabled={isLoading || !title.trim()}>
        <Plus className="w-4 h-4 mr-2" /> Tambah
      </Button>
    </form>
  );
}
