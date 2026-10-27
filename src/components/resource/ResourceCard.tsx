"use client";
import { useState } from "react";
import { Resource } from "@/types";
import { resourcesHelper } from "@/lib/firebase/resourcesHelper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Globe, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function ResourceCard({ resource }: { resource: Resource }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const executeDelete = async () => {
    try {
      await resourcesHelper.deleteResource(resource.id);
      toast.success("Referensi dihapus");
    } catch (error) {
      toast.error("Gagal menghapus");
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const handleOpen = async () => {
    await resourcesHelper.updateAccess(resource.id, resource.accessCount);
    if (resource.url) {
      window.open(resource.url, "_blank");
    }
  };

  const Icon = resource.type === 'link' ? Globe : FileText;

  return (
    <>
      <Card className="glass-panel overflow-hidden border-none hover:shadow-xl transition-all group rounded-2xl">
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="rounded-md font-medium text-[10px] uppercase tracking-wider">
              {resource.courseName}
            </Badge>
          </div>
          
          <div className="flex-1">
            <h3 className="font-heading font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 font-body">
              {resource.content || resource.url || "Tidak ada deskripsi"}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.map(tag => (
              <div key={tag} className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                <Tag className="w-2.5 h-2.5" /> {tag}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <span className="text-[10px] text-muted-foreground">
              {format(resource.createdAt, "dd MMM yyyy", { locale: id })}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsDeleteOpen(true)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
              {resource.url && (
                <Button size="sm" onClick={handleOpen} className="h-8 rounded-lg gap-2">
                  Buka <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <ConfirmDialog 
        isOpen={isDeleteOpen} 
        title="Hapus Referensi" 
        description={`Apakah kamu yakin ingin menghapus referensi "${resource.title}"?`} 
        onConfirm={executeDelete} 
        onCancel={() => setIsDeleteOpen(false)} 
        confirmText="Hapus" 
      />
    </>
  );
}

