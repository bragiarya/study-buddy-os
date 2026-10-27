"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Image as ImageIcon, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function ImageAnalyzer() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      toast.error("Mohon upload file gambar (JPG/PNG)");
      return;
    }

    setFile(selectedFile);
    setSummary(null); // Reset hasil jika ganti gambar
    
    // Buat preview URL untuk ditampilkan
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  // Helper untuk mengubah File menjadi Base64 (tanpa prefix data URI)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error("Gagal membaca file"));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const base64Data = await fileToBase64(file);
      
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: file.type
        }),
      });

      const data = await res.json();
      
      if (data.summary) {
        setSummary(data.summary);
        toast.success("Gambar berhasil dianalisa!");
      } else {
        throw new Error(data.error || "Gagal menganalisa");
      }
    } catch (error) {
      toast.error("Gagal terhubung ke AI. Pastikan file tidak terlalu besar.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Rangkuman disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl gap-2 border-primary/20 hover:bg-primary/5">
          <Camera className="w-4 h-4 text-primary" /> Analisa Foto Catatan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Image Analyzer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4 font-body">
          {/* Area Upload & Preview */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${preview ? 'border-primary/50 bg-primary/5' : 'border-border hover:bg-muted/50'} relative overflow-hidden`}
            style={{ minHeight: preview ? '200px' : '150px' }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            {preview ? (
              // Tampilan jika ada gambar
              <div className="absolute inset-0 w-full h-full p-2">
                <div className="w-full h-full rounded-xl bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${preview})` }} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl m-2">
                  <p className="text-white text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Ganti Gambar
                  </p>
                </div>
              </div>
            ) : (
              // Tampilan awal sebelum upload
              <>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-sm">Klik untuk upload foto materi</p>
                <p className="text-xs text-muted-foreground mt-1">Mendukung format JPG dan PNG</p>
              </>
            )}
          </div>

          {/* Tombol Aksi */}
          {file && !summary && (
            <Button 
              onClick={handleAnalyze} 
              disabled={loading} 
              className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sedang membaca gambar...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Analisa Sekarang</>
              )}
            </Button>
          )}

          {/* Hasil Rangkuman */}
          {summary && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm">Hasil Rangkuman:</h4>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 rounded-lg text-xs gap-1">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Tersalin" : "Salin Teks"}
                </Button>
              </div>
              <ScrollArea className="h-[200px] w-full rounded-xl border bg-muted/30 p-4">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {summary}
                </div>
              </ScrollArea>
              <p className="text-[10px] text-muted-foreground text-center italic">
                *Salin teks di atas dan paste saat menambahkan Referensi Baru.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}