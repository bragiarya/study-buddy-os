"use client";
import { Button } from "./button";
import { Loader2, AlertCircle, HelpCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: "danger" | "info";
  confirmText?: string;
}

export function ConfirmDialog({ isOpen, title, description, onConfirm, onCancel, isLoading, type = "danger", confirmText = "Hapus" }: ConfirmDialogProps) {
  if (!isOpen) return null;
  const isDanger = type === "danger";
  const Icon = isDanger ? AlertCircle : HelpCircle;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-[90%] max-w-md rounded-3xl p-6 shadow-2xl border flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full flex-shrink-0 ${isDanger ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading} className="rounded-xl">Batal</Button>
          <Button onClick={onConfirm} disabled={isLoading} className={`rounded-xl ${isDanger ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
