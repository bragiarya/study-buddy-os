"use client";
import { useState } from "react";
import { useResources } from "@/hooks/useResources";
import { ResourceForm } from "@/components/resource/ResourceForm";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { Input } from "@/components/ui/input";
import { Library, Search, SlidersHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageAnalyzer } from "@/components/resource/ImageAnalyzer";
import { AISearchModal } from "@/components/resource/AISearchModal";

export default function ResourceLibraryPage() {
  const { resources, loading } = useResources();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.courseName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || res.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <Library className="text-primary w-8 h-8" /> Resource Library
          </h1>
          <p className="text-muted-foreground mt-1 font-body">Pusat penyimpanan materi, link, dan catatan kuliahmu.</p>
        </div>
        {/* Ini yang diubah: Memasukkan tombol AI di samping ResourceForm */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <AISearchModal />
          <ImageAnalyzer />
          <ResourceForm />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-2xl border">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari materi atau mata kuliah..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-background border-none ring-1 ring-border"
          />
        </div>
        
        <Tabs value={filterType} onValueChange={setFilterType} className="w-full md:w-auto">
          <TabsList className="rounded-xl p-1 bg-background ring-1 ring-border">
            <TabsTrigger value="all" className="rounded-lg text-xs px-4">Semua</TabsTrigger>
            <TabsTrigger value="link" className="rounded-lg text-xs px-4">Link</TabsTrigger>
            <TabsTrigger value="note" className="rounded-lg text-xs px-4">Catatan</TabsTrigger>
            <TabsTrigger value="pdf" className="rounded-lg text-xs px-4">PDF</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-[250px] bg-muted animate-pulse rounded-2xl" />)}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="glass-panel p-20 text-center rounded-3xl border-dashed">
          <Library className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="font-heading font-semibold text-xl mb-1">Belum ada referensi</h3>
          <p className="text-muted-foreground">Mulai simpan materi pertamamu untuk membangun perpustakaan pribadi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(res => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
}
