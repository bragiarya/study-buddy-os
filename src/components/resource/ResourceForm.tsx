"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { resourcesHelper } from "@/lib/firebase/resourcesHelper";
import { uploadFile } from "@/lib/firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Link as LinkIcon, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ResourceForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: "",
    type: "link" as "link" | "note" | "pdf" | "image",
    courseName: "",
    content: "",
    url: "",
    tags: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let finalUrl = formData.url;
      
      // Jika tipe adalah PDF atau Image, kita butuh input file (disederhanakan untuk link dulu)
      // Note: Implementasi upload file lengkap akan menyusul di modul Image Analyzer
      
      await resourcesHelper.addResource({
        userId: user.uid,
        title: formData.title,
        type: formData.type,
        courseName: formData.courseName,
        content: formData.content,
        url: finalUrl,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t !== "")
      });

      toast.success("Referensi berhasil disimpan!");
      setOpen(false);
      setFormData({ title: "", type: "link", courseName: "", content: "", url: "", tags: "" });
    } catch (error) {
      toast.error("Gagal menyimpan referensi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-6 h-12 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> Tambah Referensi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Simpan Referensi Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 font-body">
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul</label>
            <Input required placeholder="Contoh: Rumus Kalkulus Dasar" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="rounded-xl" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mata Kuliah</label>
              <Input required placeholder="Nama matkul" value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipe</label>
              <Select value={formData.type} onValueChange={(v: "link" | "note" | "pdf" | "image") => setFormData({...formData, type: v})}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Link Web</SelectItem>
                  <SelectItem value="note">Catatan Teks</SelectItem>
                  <SelectItem value="pdf">File PDF</SelectItem>
                  <SelectItem value="image">Gambar/Foto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.type === 'link' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Link</label>
              <Input required type="url" placeholder="https://..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="rounded-xl" />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Isi Catatan / Keterangan</label>
              <Textarea placeholder="Tulis catatan penting di sini..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="rounded-xl min-h-[100px]" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (pisahkan dengan koma)</label>
            <Input placeholder="ujian, materi, penting" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="rounded-xl" />
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl mt-4" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Simpan Sekarang"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
