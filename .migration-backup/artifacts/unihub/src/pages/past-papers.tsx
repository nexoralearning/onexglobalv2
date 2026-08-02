import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getStorage, setStorage } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, FileStack, Plus, Trash2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_PAPERS, type PastPaper } from "@/lib/past-papers-seed";

const COUNTRIES = ["Australia","Brazil","Canada","France","Germany","Ghana","India","Ireland","Japan","Kenya","Malaysia","Mauritius","Netherlands","New Zealand","Nigeria","Portugal","Rwanda","Singapore","South Africa","South Korea","Spain","Sweden","Switzerland","Turkey","UAE","UK","USA","Other"];
const SEMESTERS: PastPaper["semester"][] = ["Semester 1", "Semester 2", "Annual"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => CURRENT_YEAR - i);

export default function PastPapers() {
  const user = useRequireAuth();
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");

  // Form
  const [fTitle, setFTitle] = useState("");
  const [fSubject, setFSubject] = useState("");
  const [fDegree, setFDegree] = useState("");
  const [fUniversity, setFUniversity] = useState("");
  const [fCountry, setFCountry] = useState("Mauritius");
  const [fYear, setFYear] = useState(String(CURRENT_YEAR));
  const [fSemester, setFSemester] = useState<PastPaper["semester"]>("Semester 1");
  const [fLink, setFLink] = useState("");

  useEffect(() => {
    if (!user) return;
    const stored = getStorage<PastPaper[]>("unihub_past_papers", []);
    if (stored.length === 0) {
      // First visit — seed with built-in archive
      setStorage("unihub_past_papers", SEED_PAPERS);
      setPapers(SEED_PAPERS);
    } else {
      // Patch any seed papers that are missing links (data from before links were added)
      const seedMap = new Map(SEED_PAPERS.map(p => [p.id, p]));
      let changed = false;
      const patched = stored.map(p => {
        if (!p.link && seedMap.has(p.id)) {
          changed = true;
          return { ...p, link: seedMap.get(p.id)!.link };
        }
        return p;
      });
      if (changed) setStorage("unihub_past_papers", patched);
      setPapers(patched);
    }
  }, [user]);

  if (!user) return null;

  const resetForm = () => {
    setFTitle(""); setFSubject(""); setFDegree("");
    setFUniversity(""); setFCountry("Mauritius");
    setFYear(String(CURRENT_YEAR)); setFSemester("Semester 1"); setFLink("");
  };

  const handleAdd = () => {
    if (!fTitle.trim() || !fSubject.trim() || !fUniversity.trim()) return;
    const paper: PastPaper = {
      id: Math.random().toString(36).slice(2),
      title: fTitle.trim(),
      subject: fSubject.trim(),
      degree: fDegree.trim() || "General",
      university: fUniversity.trim(),
      country: fCountry,
      year: Number(fYear),
      semester: fSemester,
      link: fLink.trim() || undefined,
      addedBy: user.name,
      addedAt: new Date().toISOString(),
    };
    const next = [paper, ...papers];
    setPapers(next);
    setStorage("unihub_past_papers", next);
    setIsOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const next = papers.filter(p => p.id !== id);
    setPapers(next);
    setStorage("unihub_past_papers", next);
  };

  // Derived filter options
  const allSubjects = ["All", ...Array.from(new Set(papers.map(p => p.subject))).sort()];
  const allCountries = ["All", ...Array.from(new Set(papers.map(p => p.country))).sort()];
  const allYears = ["All", ...Array.from(new Set(papers.map(p => p.year))).sort((a, b) => b - a).map(String)];

  const filtered = papers.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) && !p.university.toLowerCase().includes(q) && !p.degree.toLowerCase().includes(q) && !p.subject.toLowerCase().includes(q)) return false;
    if (countryFilter !== "All" && p.country !== countryFilter) return false;
    if (subjectFilter !== "All" && p.subject !== subjectFilter) return false;
    if (yearFilter !== "All" && String(p.year) !== yearFilter) return false;
    if (semesterFilter !== "All" && p.semester !== semesterFilter) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Past Papers</h1>
          <p className="text-muted-foreground mt-2">
            A community-shared archive of past exam papers. Share yours to help fellow students.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={open => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="shadow-sm shrink-0">
              <Plus className="w-4 h-4 mr-2" /> Share a Paper
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Share a Past Paper</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Paper Title <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. Data Structures Final Exam" value={fTitle} onChange={e => setFTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Subject <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. Computer Science" value={fSubject} onChange={e => setFSubject(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Degree / Programme</Label>
                  <Input placeholder="e.g. BSc Computer Science" value={fDegree} onChange={e => setFDegree(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>University <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. University of Mauritius" value={fUniversity} onChange={e => setFUniversity(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Select value={fCountry} onChange={e => setFCountry(e.target.value)}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Year</Label>
                  <Select value={fYear} onChange={e => setFYear(e.target.value)}>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Semester</Label>
                  <Select value={fSemester} onChange={e => setFSemester(e.target.value as PastPaper["semester"])}>
                    {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Paper Link <span className="text-xs text-muted-foreground">(optional — Google Drive, Dropbox, etc.)</span></Label>
                <Input placeholder="https://drive.google.com/..." value={fLink} onChange={e => setFLink(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={handleAdd} disabled={!fTitle.trim() || !fSubject.trim() || !fUniversity.trim()}>
                  Share Paper
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search university, subject, degree…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
            {allCountries.map(c => <option key={c} value={c}>{c === "All" ? "All Countries" : c}</option>)}
          </Select>
          <Select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
            {allSubjects.map(s => <option key={s} value={s}>{s === "All" ? "All Subjects" : s}</option>)}
          </Select>
          <Select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            {allYears.map(y => <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>)}
          </Select>
          <Select value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)}>
            {["All", "Semester 1", "Semester 2", "Annual"].map(s => <option key={s} value={s}>{s === "All" ? "All Semesters" : s}</option>)}
          </Select>
        </div>
        {papers.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3">{filtered.length} of {papers.length} paper{papers.length !== 1 ? "s" : ""} shown</p>
        )}
      </div>

      {/* Empty state */}
      {papers.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-xl bg-sidebar/30 border-border/60">
          <FileStack className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="font-semibold text-xl text-foreground">No papers shared yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">
            Be the first to share a past exam paper with your university community. Every paper helps a fellow student.
          </p>
          <Button className="mt-6" onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Share the First Paper
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-sidebar/30 border-border/60">
          <FileStack className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="font-semibold text-lg text-foreground">No papers match your filters</h3>
          <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        /* Table */
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sidebar/80 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Paper</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground hidden md:table-cell">University</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Year</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground hidden sm:table-cell">Shared by</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((paper, idx) => (
                    <motion.tr
                      key={paper.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <FileStack className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground leading-tight">{paper.title}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span>{paper.subject}</span>
                              {paper.degree && paper.degree !== "General" && (
                                <><span className="w-1 h-1 rounded-full bg-border inline-block" /><span>{paper.degree}</span></>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="font-medium text-foreground/90 text-sm">{paper.university}</div>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 mt-1 border-border/60">{paper.country}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="bg-sidebar font-medium">{paper.year}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">{paper.semester}</div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">{paper.addedBy}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {paper.link ? (
                            <Button
                              variant="outline" size="sm"
                              onClick={() => window.open(paper.link, "_blank", "noopener")}
                              className="hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No link</span>
                          )}
                          {paper.addedBy === user.name && (
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(paper.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
