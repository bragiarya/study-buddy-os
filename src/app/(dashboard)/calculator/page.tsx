"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCalculator } from "@/hooks/useCalculator";
import { calculateGPA, GRADE_VALUES } from "@/lib/utils/gpa";
import { calculatorHelper } from "@/lib/firebase/calculatorHelper";
import { GPAChart } from "@/components/calculator/GPAChart";
import { SimulatorPanel } from "@/components/calculator/SimulatorPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Plus, Trash2, Save, History } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CalculatorPage() {
  const { user } = useAuthStore();
  const { results, loading, cumulativeGPA, totalCreditsEarned } = useCalculator();
  const [semesterNum, setSemesterNum] = useState<number>(1);
  const [subjects, setSubjects] = useState([{ id: 1, name: "", credits: 3, grade: "A" }]);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewSemester, setViewSemester] = useState<any | null>(null);

  const addSubject = () => setSubjects([...subjects, { id: Date.now(), name: "", credits: 3, grade: "A" }]);
  
  const removeSubject = (id: number) => {
    if (subjects.length > 1) setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: number, field: string, value: string | number) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const currentGPA = calculateGPA(subjects);
  const currentCredits = subjects.reduce((acc, curr) => acc + curr.credits, 0);

  const triggerSave = () => {
    const isAllNamed = subjects.every(s => s.name.trim() !== "");
    if (!isAllNamed) {
      toast.error("Semua Nama Mata Kuliah wajib diisi!");
      return;
    }
    setIsSaveOpen(true);
  };

  const executeSave = async () => {
    if (!user) return;
    try {
      await calculatorHelper.saveSemesterResult(user.uid, semesterNum, subjects, currentGPA, currentCredits);
      toast.success(`Hasil Semester ${semesterNum} berhasil disimpan!`);
      setSemesterNum(prev => prev + 1);
      setSubjects([{ id: Date.now(), name: "", credits: 3, grade: "A" }]);
    } catch (error) {
      toast.error("Gagal menyimpan hasil semester");
    } finally {
      setIsSaveOpen(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await calculatorHelper.deleteSemesterResult(deleteId);
      toast.success("Hasil semester berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus hasil semester");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-muted/60 rounded-xl animate-pulse"></div>
          <div className="flex gap-4"><div className="h-16 w-32 bg-muted/50 rounded-2xl animate-pulse"></div></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[400px] bg-muted/40 rounded-3xl animate-pulse"></div>
            <div className="h-48 bg-muted/30 rounded-3xl animate-pulse"></div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="h-64 bg-muted/40 rounded-3xl animate-pulse"></div>
            <div className="h-64 bg-muted/40 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <Calculator className="text-primary w-8 h-8" /> Kalkulator IPK
          </h1>
          <p className="text-muted-foreground mt-1 font-body">Hitung dan pantau perkembangan nilai akademikmu.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-3 rounded-2xl flex flex-col items-end">
            <span className="text-sm text-muted-foreground font-medium">IPK Kumulatif</span>
            <span className="text-2xl font-heading font-bold text-primary">{cumulativeGPA.toFixed(2)}</span>
          </div>
          <div className="glass-panel px-6 py-3 rounded-2xl flex flex-col items-end hidden md:flex">
            <span className="text-sm text-muted-foreground font-medium">Total SKS</span>
            <span className="text-2xl font-heading font-bold text-foreground">{totalCreditsEarned}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* KOLOM KIRI (Input & History) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Input Nilai */}
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold">Input Nilai Semester</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Semester</span>
                <Input type="number" min={1} max={14} value={semesterNum} onChange={(e) => setSemesterNum(Number(e.target.value))} className="w-16 h-8 text-center" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="hidden md:flex items-center gap-2 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="w-8 shrink-0"></div>
                <div className="flex-1">Nama Mata Kuliah (Wajib)</div>
                <div className="w-24 text-center shrink-0">Bobot SKS</div>
                <div className="w-28 text-center shrink-0">Nilai</div>
                <div className="w-9 shrink-0"></div>
              </div>

              {subjects.map((subject, index) => (
                <div key={subject.id} className="flex flex-col md:flex-row md:items-center gap-2 bg-muted/20 p-3 rounded-xl border border-transparent hover:border-primary/20 transition-all">
                  <div className="flex gap-2 items-center flex-1 min-w-0">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-background border text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <Input 
                      required
                      placeholder="Contoh: Pemrograman Web" 
                      value={subject.name} 
                      onChange={(e) => updateSubject(subject.id, 'name', e.target.value)} 
                      className="flex-1 bg-background rounded-lg min-w-0" 
                    />
                  </div>
                  
                  <div className="flex gap-2 items-center mt-2 md:mt-0 pl-10 md:pl-0">
                    <div className="w-24 shrink-0">
                      <label className="text-[10px] md:hidden font-bold text-muted-foreground mb-1 block uppercase">SKS</label>
                      <Input 
                        type="number" 
                        min={1} 
                        max={6} 
                        value={subject.credits} 
                        onChange={(e) => updateSubject(subject.id, 'credits', Number(e.target.value))} 
                        className="text-center bg-background rounded-lg w-full" 
                      />
                    </div>
                    <div className="w-28 shrink-0">
                      <label className="text-[10px] md:hidden font-bold text-muted-foreground mb-1 block uppercase">Nilai</label>
                      <Select value={subject.grade} onValueChange={(v) => updateSubject(subject.id, 'grade', v)}>
                        <SelectTrigger className="bg-background rounded-lg w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(GRADE_VALUES).map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSubject(subject.id)} 
                      className="w-9 shrink-0 text-muted-foreground hover:text-destructive" 
                      disabled={subjects.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
              <Button variant="outline" onClick={addSubject} className="w-full sm:w-auto rounded-xl gap-2 border-dashed">
                <Plus className="w-4 h-4" /> Tambah Matkul
              </Button>
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">IP Semester Ini</p>
                  <p className="text-2xl font-heading font-bold text-primary">{currentGPA.toFixed(2)}</p>
                </div>
                <Button onClick={triggerSave} className="rounded-xl px-6 h-12 shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" /> Simpan
                </Button>
              </div>
            </div>
          </div>

          {/* 2. History (Dipindah ke kiri bawah) */}
          <div className="glass-panel p-6 rounded-3xl bg-secondary/5 border-secondary/20">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-secondary" /> Riwayat Semester
              </h3>
            </div>
            {results.length === 0 ? (
              <div className="bg-background/50 border border-dashed rounded-2xl p-8 text-center">
                <p className="text-sm text-muted-foreground">Belum ada data semester yang disimpan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => setViewSemester(r)}
                    className="flex justify-between items-center p-4 rounded-2xl bg-background border hover:border-secondary/30 transition-colors shadow-sm cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-sm">Semester {r.semesterNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.totalCredits} SKS Total</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-heading font-bold text-xl text-primary">{r.gpa.toFixed(2)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(r.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN (Visual & Simulasi) */}
        <div className="lg:col-span-1 space-y-6">
          {/* 3. Grafik IPK */}
          <GPAChart data={results} />
          
          {/* 4. Simulator */}
          <SimulatorPanel currentGPA={cumulativeGPA} currentCredits={totalCreditsEarned} />
        </div>
      </div>

      {/* Dialog Konfirmasi */}
      <ConfirmDialog 
        isOpen={isSaveOpen} 
        title="Simpan Nilai Semester" 
        description={`Apakah kamu yakin ingin menyimpan hasil Semester ${semesterNum} dengan IP ${currentGPA.toFixed(2)}?`} 
        onConfirm={executeSave} 
        onCancel={() => setIsSaveOpen(false)} 
        type="info" 
        confirmText="Simpan" 
      />

      <ConfirmDialog 
        isOpen={deleteId !== null} 
        title="Hapus Nilai Semester" 
        description="Apakah kamu yakin ingin menghapus hasil semester ini dari riwayat?" 
        onConfirm={executeDelete} 
        onCancel={() => setDeleteId(null)} 
        type="danger" 
        confirmText="Hapus" 
      />

      {/* Pop-up Detail Riwayat Semester */}
      <Dialog open={!!viewSemester} onOpenChange={(open) => !open && setViewSemester(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 bg-card/95 backdrop-blur-md border border-border/80">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-heading text-xl font-bold text-foreground">
              Detail Semester {viewSemester?.semesterNumber}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">
              <div className="col-span-2">Mata Kuliah</div>
              <div className="text-center">SKS</div>
              <div className="text-right">Nilai</div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {viewSemester?.subjects?.map((sub: any) => (
                <div key={sub.id} className="grid grid-cols-3 gap-2 items-center p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                  <div className="col-span-2 font-medium text-sm text-foreground truncate pr-2" title={sub.name}>
                    {sub.name}
                  </div>
                  <div className="text-center text-sm font-semibold text-muted-foreground">
                    {sub.credits} SKS
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 min-w-[36px] text-center">
                      {sub.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border mt-4 flex justify-between items-center px-2">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">IP Semester</p>
                <p className="text-2xl font-heading font-bold text-primary">
                  {viewSemester?.gpa?.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total SKS</p>
                <p className="text-lg font-bold text-foreground">
                  {viewSemester?.totalCredits} SKS
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
