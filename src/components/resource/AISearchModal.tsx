"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Globe, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function AISearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();

      if (data.result) {
        setResult(data.result);
      } else {
        throw new Error(data.error || "Gagal melakukan pencarian");
      }
    } catch (error) {
      toast.error("Gagal terhubung ke AI Search.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setQuery("");
        setResult(null);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <span className="inline-block">
          {/* UBAH: Kelas warna disamakan persis dengan tombol ImageAnalyzer agar seragam dan teksnya terlihat */}
          <Button variant="outline" className="rounded-xl gap-2 border-primary/20 hover:bg-primary/5 text-foreground">
            <Globe className="w-4 h-4 text-primary" /> AI Web Search
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Pencarian Pintar
          </DialogTitle>
          <DialogDescription className="sr-only">
            Gunakan fitur ini untuk mencari informasi terbaru dari internet menggunakan AI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4 font-body">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tanya info terbaru dari internet..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 rounded-xl bg-muted/50 border-none h-12 focus-visible:ring-primary"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cari"}
            </Button>
          </form>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-in fade-in">
              <Globe className="w-8 h-8 animate-pulse mb-3 text-primary/50" />
              <p className="text-sm">Menjelajahi internet untuk mencari jawaban terbaik...</p>
            </div>
          )}

          {result && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-2 text-sm font-bold text-primary">
                <Sparkles className="w-4 h-4" /> Hasil Pencarian AI:
              </div>
              <ScrollArea className="h-[300px] w-full rounded-2xl border bg-muted/20 p-5">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}