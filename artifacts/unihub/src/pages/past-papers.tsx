import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getStorage, setStorage } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, FileStack, Plus, Trash2, ExternalLink, BookOpen, Bookmark, BookmarkCheck, Eye, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_PAPERS, type PastPaper } from "@/lib/past-papers-seed";

const SAVED_PAPERS_STORAGE_KEY = "unihub_saved_past_papers_v1";

const COUNTRIES = ["Australia","Brazil","Canada","France","Germany","Ghana","India","Ireland","Japan","Kenya","Malaysia","Mauritius","Netherlands","New Zealand","Nigeria","Portugal","Rwanda","Singapore","South Africa","South Korea","Spain","Sweden","Switzerland","Turkey","UAE","UK","USA","Other"];
const SEMESTERS: PastPaper["semester"][] = ["Semester 1", "Semester 2", "Annual"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2009 }, (_, i) => CURRENT_YEAR - i);

export default function PastPapers() {
  const user = useRequireAuth();
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewTab, setViewTab] = useState<"all" | "saved">("all");

  // In-App Paper Viewer State
  const [viewerPaper, setViewerPaper] = useState<PastPaper | null>(null);
  const [viewerActiveTab, setViewerActiveTab] = useState<"paper" | "solution">("paper");

  // Saved Papers LocalStorage State
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_PAPERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PAPERS_STORAGE_KEY, JSON.stringify(savedPaperIds));
    } catch {
      // ignore write errors
    }
  }, [savedPaperIds]);

  const isPaperSaved = (id: string) => savedPaperIds.includes(id);

  const toggleSavePaper = (id: string) => {
    setSavedPaperIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
  const [fSolutionUrl, setFSolutionUrl] = useState("");

  useEffect(() => {
    if (!user) return;
    const stored = getStorage<PastPaper[]>("unihub_past_papers", []);
    if (stored.length === 0) {
      setStorage("unihub_past_papers", SEED_PAPERS);
      setPapers(SEED_PAPERS);
    } else {
      // Retain user-added custom papers (non seed-) and always refresh seed papers with current active portal URLs
      const userAdded = stored.filter(p => !p.id.startsWith("seed-"));
      const updatedList = [...SEED_PAPERS, ...userAdded];
      setStorage("unihub_past_papers", updatedList);
      setPapers(updatedList);
    }
  }, [user]);

  if (!user) return null;

  const resetForm = () => {
    setFTitle(""); setFSubject(""); setFDegree("");
    setFUniversity(""); setFCountry("Mauritius");
    setFYear(String(CURRENT_YEAR)); setFSemester("Semester 1");
    setFLink(""); setFSolutionUrl("");
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
      solutionUrl: fSolutionUrl.trim() || undefined,
      addedBy: user.name,
      addedAt: new Date().toISOString(),
    };
    const next = [paper, ...papers];
    setPapers(next);
    setStorage("unihub_past_papers", next);
    setSavedPaperIds(prev => [...prev, paper.id]);
    setIsOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const next = papers.filter(p => p.id !== id);
    setPapers(next);
    setStorage("unihub_past_papers", next);
    setSavedPaperIds(prev => prev.filter(i => i !== id));
  };

  // Derived filter options
  const allSubjects = ["All", ...Array.from(new Set(papers.map(p => p.subject))).sort()];
  const allCountries = ["All", ...Array.from(new Set(papers.map(p => p.country))).sort()];
  const allYears = ["All", ...Array.from(new Set(papers.map(p => p.year))).sort((a, b) => b - a).map(String)];

  const sourcePapers = viewTab === "saved" ? papers.filter(p => isPaperSaved(p.id)) : papers;

  const filtered = sourcePapers.filter(p => {
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
      {/* In-App Paper Viewer Modal */}
      <Dialog open={!!viewerPaper} onOpenChange={open => { if (!open) setViewerPaper(null); }}>
        <DialogContent className="sm:max-w-[900px] h-[88vh] flex flex-col p-0 overflow-hidden bg-background">
          {viewerPaper && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-border bg-sidebar flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/40 text-primary">
                      {viewerPaper.country}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{viewerPaper.university}</span>
                    <span className="text-xs text-muted-foreground">• {viewerPaper.year} ({viewerPaper.semester})</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground mt-0.5 line-clamp-1">{viewerPaper.title}</h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant={isPaperSaved(viewerPaper.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSavePaper(viewerPaper.id)}
                    className="gap-1.5 text-xs h-8"
                  >
                    {isPaperSaved(viewerPaper.id) ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-primary-foreground" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5 text-primary" />
                        Save Paper
                      </>
                    )}
                  </Button>



                  {viewerPaper.link && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open(viewerPaper.link, "_blank", "noopener,noreferrer")}
                      className="gap-1.5 text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                      title="Open direct academic resource in new tab"
                    >
                      Open Link <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* View Switcher Bar inside viewer */}
              <div className="px-5 py-2 bg-card border-b border-border/60 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewerActiveTab === "paper" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewerActiveTab("paper")}
                    className="text-xs h-7 gap-1.5 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary" /> Exam Overview & Practice
                  </Button>
                  {viewerPaper.solutionUrl && (
                    <Button
                      variant={viewerActiveTab === "solution" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewerActiveTab("solution")}
                      className="text-xs h-7 gap-1.5 font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Solution & Guide
                    </Button>
                  )}
                </div>

                {viewerPaper.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(viewerPaper.link, "_blank", "noopener,noreferrer")}
                    className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-3 h-3" /> {viewerPaper.link}
                  </Button>
                )}
              </div>

              {/* Embedded In-App Reader Container */}
              <div className="flex-1 bg-muted/20 relative overflow-y-auto flex flex-col">
                {viewerActiveTab === "paper" ? (
                  <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
                    {/* Paper Specification Sheet */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                        <div>
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{viewerPaper.subject} • {viewerPaper.degree}</span>
                          <h3 className="text-xl font-bold text-foreground mt-1">{viewerPaper.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{viewerPaper.university} — {viewerPaper.country}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block">Academic Year</span>
                            <span className="text-sm font-semibold text-foreground">{viewerPaper.year} ({viewerPaper.semester})</span>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block">Time Allowed</span>
                            <span className="text-sm font-semibold text-foreground">{viewerPaper.durationMinutes || 180} Mins</span>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block">Total Marks</span>
                            <span className="text-sm font-semibold text-foreground">{viewerPaper.totalMarks || 100} Marks</span>
                          </div>
                        </div>
                      </div>

                      {/* Topics covered */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Exam Topics & Curriculum</h4>
                        <div className="flex flex-wrap gap-2">
                          {(viewerPaper.topics || ["Core Concepts", "Problem Solving", "Exam Technique"]).map((topic, i) => (
                            <Badge key={i} variant="secondary" className="text-xs py-1 px-2.5 bg-sidebar font-medium">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Direct External Link Banner */}
                      {viewerPaper.link && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between gap-4">
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-xs font-semibold text-primary block">Official Academic Portal & Archive Link</span>
                            <p className="text-xs text-muted-foreground truncate">{viewerPaper.link}</p>
                          </div>
                          <Button
                            size="sm"
                            className="text-xs gap-1.5 shrink-0"
                            onClick={() => window.open(viewerPaper.link, "_blank", "noopener,noreferrer")}
                          >
                            Open Working Portal <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Practice Exam Questions & Mark Scheme */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" /> Practice Exam Questions & Mark Scheme
                        </h4>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="p-4 rounded-lg bg-sidebar border border-border/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground text-xs uppercase tracking-wide">Question 1 (25 Marks)</span>
                            <Badge variant="outline" className="text-[10px]">Theory & Fundamentals</Badge>
                          </div>
                          <p className="text-foreground/90 leading-relaxed text-xs">
                            Explain the primary theoretical principles governing {viewerPaper.subject} in relation to {viewerPaper.title} ({viewerPaper.year}). Include relevant formulas or structural proofs.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-sidebar border border-border/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground text-xs uppercase tracking-wide">Question 2 (25 Marks)</span>
                            <Badge variant="outline" className="text-[10px]">Case Study & Analysis</Badge>
                          </div>
                          <p className="text-foreground/90 leading-relaxed text-xs">
                            Analyze how modern institutions apply concepts from {(viewerPaper.topics || [])[0] || "core modules"} to solve complex real-world problems.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-sidebar border border-border/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground text-xs uppercase tracking-wide">Question 3 (25 Marks)</span>
                            <Badge variant="outline" className="text-[10px]">Applied Problem Solving</Badge>
                          </div>
                          <p className="text-foreground/90 leading-relaxed text-xs">
                            Derive the step-by-step solution for the numerical or algorithmic problem presented in Section B of the exam paper.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Solution View
                  viewerPaper.solutionUrl ? (
                    <div className="w-full h-full flex flex-col">
                      <div className="p-2 bg-sidebar border-b border-border/50 text-xs text-muted-foreground flex items-center justify-between px-4 shrink-0">
                        <span className="flex items-center gap-1.5 truncate">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Solution Resource: <span className="font-mono text-[11px] text-foreground">{viewerPaper.solutionUrl}</span>
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] px-2 text-emerald-500 hover:underline"
                          onClick={() => window.open(viewerPaper.solutionUrl, "_blank", "noopener,noreferrer")}
                        >
                          Open Solution Link <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                      <iframe
                        src={viewerPaper.solutionUrl}
                        title={`${viewerPaper.title} Solution`}
                        className="w-full flex-1 border-0 bg-white dark:bg-zinc-950"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
                      <BookOpen className="w-12 h-12 text-muted-foreground opacity-30" />
                      <p className="text-sm text-muted-foreground">No specific external solution link attached to this paper.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Past Papers Archive</h1>
          <p className="text-muted-foreground mt-1">
            Access exam papers with direct in-app readers and save papers to your personal revision collection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-sidebar border border-border p-1 rounded-lg">
            <Button
              variant={viewTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewTab("all")}
              className="text-xs h-8 gap-1.5"
            >
              <FileStack className="w-3.5 h-3.5" />
              All Papers ({papers.length})
            </Button>
            <Button
              variant={viewTab === "saved" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewTab("saved")}
              className="text-xs h-8 gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-primary" />
              Saved Papers
              {savedPaperIds.length > 0 && (
                <Badge className="ml-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0 rounded-full h-4">
                  {savedPaperIds.length}
                </Badge>
              )}
            </Button>
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
                  <Label>Paper Link <span className="text-xs text-muted-foreground">(optional — Google Drive, Dropbox, direct PDF, etc.)</span></Label>
                  <Input placeholder="https://drive.google.com/..." value={fLink} onChange={e => setFLink(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Explanation / Solution Link <span className="text-xs text-muted-foreground">(optional — YouTube, Khan Academy, etc.)</span></Label>
                  <Input placeholder="https://www.youtube.com/watch?v=..." value={fSolutionUrl} onChange={e => setFSolutionUrl(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={handleAdd} disabled={!fTitle.trim() || !fSubject.trim() || !fUniversity.trim()}>
                    Share & Save Paper
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={viewTab === "saved" ? "Search inside saved papers..." : "Search university, subject, degree…"}
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
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
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>
            {viewTab === "saved"
              ? `Showing ${filtered.length} saved paper${filtered.length !== 1 ? "s" : ""}`
              : `Showing ${filtered.length} of ${papers.length} paper${papers.length !== 1 ? "s" : ""}`
            }
          </span>
          {viewTab === "saved" && savedPaperIds.length > 0 && (
            <button
              onClick={() => setSavedPaperIds([])}
              className="text-red-400 hover:underline hover:text-red-500 font-medium"
            >
              Clear saved collection
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {sourcePapers.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-xl bg-sidebar/30 border-border/60">
          <FileStack className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-20" />
          {viewTab === "saved" ? (
            <>
              <h3 className="font-semibold text-xl text-foreground">No Saved Papers Yet</h3>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">
                Bookmark any paper from the archive using the save icon, or share a paper to automatically store it in your saved collection!
              </p>
              <Button className="mt-6 text-xs" onClick={() => setViewTab("all")}>
                Browse All Papers Archive
              </Button>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-xl text-foreground">No papers shared yet</h3>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">
                Be the first to share a past exam paper with your university community. Every paper helps a fellow student.
              </p>
              <Button className="mt-6" onClick={() => setIsOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Share the First Paper
              </Button>
            </>
          )}
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
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((paper, idx) => {
                    const saved = isPaperSaved(paper.id);
                    return (
                      <motion.tr
                        key={paper.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                        className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${saved ? "bg-primary/[0.02]" : ""}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => setViewerPaper(paper)}
                              className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 cursor-pointer hover:bg-primary/20 transition-colors"
                              title="Click to view in-app reader"
                            >
                              <FileStack className="w-4 h-4" />
                            </div>
                            <div>
                              <div
                                onClick={() => setViewerPaper(paper)}
                                className="font-medium text-foreground leading-tight cursor-pointer hover:text-primary transition-colors flex items-center gap-1.5"
                              >
                                {paper.title}
                                {saved && <BookmarkCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
                              </div>
                              <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-0.5">
                                <div className="flex items-center gap-2">
                                  <span>{paper.subject}</span>
                                  {paper.degree && paper.degree !== "General" && (
                                    <><span className="w-1 h-1 rounded-full bg-border inline-block" /><span>{paper.degree}</span></>
                                  )}
                                </div>
                                {paper.link && (
                                  <a
                                    href={paper.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-[11px] text-primary font-mono hover:underline font-medium truncate max-w-[280px]"
                                    title={`Direct archive link: ${paper.link}`}
                                  >
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{paper.link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                  </a>
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
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* In-App Reader Launcher */}
                            <Button
                              variant="default"
                              size="sm"
                              className="text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => setViewerPaper(paper)}
                            >
                              <Eye className="w-3.5 h-3.5" /> Read in App
                            </Button>

                            {/* Direct External Link Button */}
                            {paper.link && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs gap-1 font-medium border-border hover:text-primary hover:border-primary/40"
                                onClick={() => window.open(paper.link, "_blank", "noopener,noreferrer")}
                                title="Open paper link directly in new tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Open Link
                              </Button>
                            )}

                            {/* Bookmark Save Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className={`text-xs gap-1 border-border ${saved ? "text-primary border-primary/40 bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
                              onClick={() => toggleSavePaper(paper.id)}
                              title={saved ? "Remove from Saved Papers" : "Save Paper"}
                            >
                              {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                              {saved ? "Saved" : "Save"}
                            </Button>

                            {paper.solutionUrl && (
                              <Button
                                variant="outline" size="sm"
                                onClick={() => {
                                  setViewerPaper(paper);
                                  setViewerActiveTab("solution");
                                }}
                                className="text-xs hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors"
                              >
                                <BookOpen className="w-3.5 h-3.5 mr-1" /> Explain
                              </Button>
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
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
