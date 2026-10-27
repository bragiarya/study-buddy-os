"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Target, Plus, Minus } from "lucide-react";

export function SimulatorPanel({ currentGPA, currentCredits }: { currentGPA: number, currentCredits: number }) {
  const [targetGPA, setTargetGPA] = useState<number | string>(4.0);
  const [plannedCredits, setPlannedCredits] = useState<number | string>(20);

  // Validasi saat user selesai mengetik (onBlur)
  const validateTargetGPA = () => {
    let val = Number(targetGPA);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 4) val = 4;
    setTargetGPA(val.toFixed(2));
  };

  const validateCredits = () => {
    let val = Number(plannedCredits);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 24) val = 24;
    setPlannedCredits(Math.round(val));
  };

  // Fungsi untuk tombol kustom +/-
  const adjustTarget = (amount: number) => {
    setTargetGPA((prev) => {
      let val = Number(prev) + amount;
      return Math.min(Math.max(val, 0), 4).toFixed(2);
    });
  };

  const adjustCredits = (amount: number) => {
    setPlannedCredits((prev) => {
      let val = Number(prev) + amount;
      return Math.min(Math.max(val, 1), 24);
    });
  };

  const numTarget = Number(targetGPA);
  const numCredits = Number(plannedCredits);

  // Rumus matematika murni
  const requiredGPA = currentCredits === 0 
    ? numTarget 
    : ((numTarget * (currentCredits + numCredits)) - (currentGPA * currentCredits)) / numCredits;

  return (
    <div className="glass-panel p-6 rounded-3xl bg-primary/5 border-primary/20">
      <h3 className="font-heading font-bold mb-5 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" /> Simulator Target IPK
      </h3>
      
      <div className="space-y-6">
        {/* Input Target IPK */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-medium">Target IPK Akhir</span>
          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border">
            <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg hover:bg-muted" onClick={() => adjustTarget(-0.05)}>
              <Minus className="w-3 h-3" />
            </Button>
            <Input 
              type="number" 
              step="0.01"
              value={targetGPA} 
              onChange={(e) => setTargetGPA(e.target.value)} 
              onBlur={validateTargetGPA}
              // Utility ini menghilangkan panah kecil bawaan browser
              className="w-14 h-7 text-center border-none shadow-none focus-visible:ring-0 p-0 text-sm font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            />
            <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg hover:bg-muted" onClick={() => adjustTarget(0.05)}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Input SKS Semester Depan */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-medium">SKS Sem. Depan</span>
          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border">
            <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg hover:bg-muted" onClick={() => adjustCredits(-1)}>
              <Minus className="w-3 h-3" />
            </Button>
            <Input 
              type="number" 
              value={plannedCredits} 
              onChange={(e) => setPlannedCredits(e.target.value)} 
              onBlur={validateCredits}
              className="w-14 h-7 text-center border-none shadow-none focus-visible:ring-0 p-0 text-sm font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            />
            <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg hover:bg-muted" onClick={() => adjustCredits(1)}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Hasil Kalkulasi */}
        <div className="pt-5 border-t border-primary/10">
          <p className="text-xs text-muted-foreground mb-1 text-center">Kamu butuh nilai rata-rata:</p>
          <div className="text-3xl font-heading font-bold text-center text-primary">
            {requiredGPA > 4.0 ? "Mustahil 😅" : requiredGPA < 0 ? "Aman 🎉" : requiredGPA.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
