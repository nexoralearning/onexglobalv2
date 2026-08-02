import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Job } from "@/lib/mock-data";
import { getDailyJobs, getTodayLabel } from "@/lib/job-pool";
import { getStorage, setStorage } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Briefcase, MapPin, Building2, ExternalLink,
  BookmarkPlus, BookmarkCheck, DollarSign,
  GraduationCap, RefreshCw, Search, Eye,
  CheckCircle2, Globe, Clock, Bookmark, FileText, Check, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JOB_TYPES = [
  "All",
  "Internship",
  "Graduate Job",
  "Full Time Job",
  "Part-time Job",
  "Remote Job",
  "Research Opportunity",
];

const FIELDS = [
  "All",
  "Technology",
  "Finance",
  "Healthcare",
  "Engineering",
  "Marketing",
  "Design",
  "Law",
  "Education",
  "Consulting",
  "Logistics",
  "Hospitality",
  "Media",
  "Science",
  "Business",
];

function getApplyUrl(job: Job): string {
  if (job.applyUrl) return job.applyUrl;
  if (job.link) return job.link;
  // Fallback to direct official search link for company + role
  return `https://www.google.com/search?q=${encodeURIComponent(`${job.company} ${job.title} career application portal`)}`;
}

export default function Jobs() {
  const user = useRequireAuth();

  // Daily job pool — deterministic for today, different tomorrow
  const [allJobs] = useState<Job[]>(() => getDailyJobs(80));
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  // Navigation tab: "all" | "saved" | "applied" | "internships" | "graduate"
  const [activeTab, setActiveTab] = useState<"all" | "saved" | "applied" | "internships" | "graduate">("all");

  // In-App Job Viewer Modal state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "reader">("overview");

  // Filter states
  const [search, setSearch] = useState("");
  const [fieldFilter, setFieldFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [payFilter, setPayFilter] = useState("All");

  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = new Set(getStorage<string[]>("unihub_saved_jobs", []));
      setSavedJobIds(saved);
      const applied = new Set(getStorage<string[]>("unihub_applied_jobs", []));
      setAppliedJobIds(applied);
    }
  }, [user]);

  if (!user) return null;

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = new Set(savedJobIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSavedJobIds(next);
    setStorage("unihub_saved_jobs", Array.from(next));
  };

  const toggleApplied = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = new Set(appliedJobIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setAppliedJobIds(next);
    setStorage("unihub_applied_jobs", Array.from(next));
  };

  const clearFilters = () => {
    setSearch("");
    setJobTypeFilter("All");
    setFieldFilter("All");
    setCountryFilter("All");
    setTypeFilter("All");
    setPayFilter("All");
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Derive country list from pool
  const countries = ["All", ...Array.from(new Set(allJobs.map(j => j.country))).sort()];

  const filteredJobs = allJobs.filter(j => {
    // Tab filter first
    if (activeTab === "saved" && !savedJobIds.has(j.id)) return false;
    if (activeTab === "applied" && !appliedJobIds.has(j.id)) return false;
    if (activeTab === "internships" && j.jobCategory !== "Internship") return false;
    if (activeTab === "graduate" && j.jobCategory !== "Graduate Job") return false;

    // Search query
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchCompany = j.company.toLowerCase().includes(q);
      const matchDesc = j.description.toLowerCase().includes(q);
      const matchDegrees = j.relevantDegrees?.some(d => d.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchDesc && !matchDegrees) return false;
    }

    if (fieldFilter !== "All" && j.field !== fieldFilter) return false;
    if (countryFilter !== "All" && j.country !== countryFilter) return false;
    if (typeFilter !== "All" && j.type !== typeFilter) return false;
    if (jobTypeFilter !== "All" && j.jobCategory !== jobTypeFilter) return false;
    if (payFilter !== "All" && j.pay !== payFilter) return false;

    return true;
  });

  const savedCount = savedJobIds.size;
  const appliedCount = appliedJobIds.size;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs & Internships Portal</h1>
          <p className="text-muted-foreground mt-1.5">
            Verified global listings matched to your degree. Apply in-app or view direct portal details.
          </p>
        </div>
        {/* Daily refresh indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3.5 py-2 shrink-0 shadow-sm">
          <RefreshCw className="w-3.5 h-3.5 text-primary" />
          <span>
            <span className="font-semibold text-foreground">Updated Daily</span>
            {" · "} {getTodayLabel()}
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("all")}
            className="text-xs h-9 gap-1.5 font-medium"
          >
            <Briefcase className="w-3.5 h-3.5" /> All Opportunities ({allJobs.length})
          </Button>
          <Button
            variant={activeTab === "saved" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("saved")}
            className="text-xs h-9 gap-1.5 font-medium relative"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" /> Saved Roles
            {savedCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 bg-amber-500/15 text-amber-600 border-amber-500/30">
                {savedCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "applied" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("applied")}
            className="text-xs h-9 gap-1.5 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Applied ({appliedCount})
          </Button>
          <Button
            variant={activeTab === "internships" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("internships")}
            className="text-xs h-9 gap-1.5 font-medium"
          >
            🎓 Internships
          </Button>
          <Button
            variant={activeTab === "graduate" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("graduate")}
            className="text-xs h-9 gap-1.5 font-medium"
          >
            💼 Graduate Schemes
          </Button>
        </div>
      </div>

      {/* Search & Filter Console */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by role title, company, degree, or skill..."
            className="pl-10 bg-background h-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase text-muted-foreground mb-1 block">Category</label>
            <Select value={jobTypeFilter} onChange={e => setJobTypeFilter(e.target.value)}>
              {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase text-muted-foreground mb-1 block">Industry</label>
            <Select value={fieldFilter} onChange={e => setFieldFilter(e.target.value)}>
              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase text-muted-foreground mb-1 block">Country</label>
            <Select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase text-muted-foreground mb-1 block">Work Setting</label>
            <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="All">Any Setting</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </Select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase text-muted-foreground mb-1 block">Pay Status</label>
            <Select value={payFilter} onChange={e => setPayFilter(e.target.value)}>
              <option value="All">All Pay Status</option>
              <option value="Paid">Paid Only</option>
              <option value="Unpaid">Unpaid / Volunteer</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
          <span>
            Showing <strong className="text-foreground">{filteredJobs.length}</strong> of {allJobs.length} opportunities
          </span>
          {(search || fieldFilter !== "All" || countryFilter !== "All" || typeFilter !== "All" || jobTypeFilter !== "All" || payFilter !== "All") && (
            <button onClick={clearFilters} className="text-primary hover:underline font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3" /> Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Job Listings Grid */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job, idx) => {
            const isSaved = savedJobIds.has(job.id);
            const isApplied = appliedJobIds.has(job.id);
            const applyUrl = getApplyUrl(job);

            return (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: Math.min(idx * 0.02, 0.2) }}
              >
                <Card
                  className={`transition-all bg-card border-border hover:border-primary/40 cursor-pointer group shadow-sm ${
                    isSaved ? "border-amber-500/30 bg-amber-500/[0.015]" : ""
                  }`}
                  onClick={() => {
                    setSelectedJob(job);
                    setModalTab("overview");
                  }}
                >
                  <CardContent className="p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start">

                    {/* Company Initial Badge */}
                    <div className="hidden md:flex w-12 h-12 rounded-xl bg-sidebar items-center justify-center border border-border shrink-0 text-lg font-bold text-foreground/80 shadow-xs group-hover:border-primary/40 group-hover:text-primary transition-colors">
                      {job.company.charAt(0)}
                    </div>

                    <div className="flex-1 space-y-3 min-w-0 w-full">
                      {/* Top Row: Title, Company, Category, Buttons */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            {job.jobCategory && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 shrink-0 text-xs font-semibold">
                                {job.jobCategory}
                              </Badge>
                            )}
                            {isApplied && (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Applied
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground">
                            <span className="flex items-center text-foreground font-medium">
                              <Building2 className="w-3.5 h-3.5 mr-1 text-primary opacity-80" />{job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground" />{job.location}, {job.country}
                            </span>
                            <span className="flex items-center">
                              <Globe className="w-3.5 h-3.5 mr-1 text-muted-foreground" />{job.type}
                            </span>
                            <a
                              href={applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs text-primary font-mono hover:underline font-medium hover:text-primary/80 transition-colors truncate max-w-[240px]"
                              title={`Direct link: ${applyUrl}`}
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{applyUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>
                            </a>
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-start">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => toggleSave(job.id, e)}
                            className={`h-8 text-xs gap-1.5 font-medium ${
                              isSaved ? "text-amber-600 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20" : "text-muted-foreground"
                            }`}
                            title={isSaved ? "Saved to your list" : "Save this job"}
                          >
                            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                            {isSaved ? "Saved" : "Save"}
                          </Button>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                              setModalTab("overview");
                            }}
                            className="h-8 text-xs gap-1 font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </Button>

                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(applyUrl, "_blank", "noopener,noreferrer");
                            }}
                            className="h-8 text-xs gap-1.5 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Apply <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Snippet Description */}
                      <p className="text-xs md:text-sm text-foreground/80 leading-relaxed line-clamp-2">
                        {job.description}
                      </p>

                      {/* Badges & Meta row */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <Badge variant="secondary" className="bg-sidebar border border-border/60 text-[11px] font-medium">
                          {job.field}
                        </Badge>
                        <Badge variant="secondary" className="bg-sidebar border border-border/60 text-[11px] font-medium">
                          {job.experienceLevel} Level
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-[11px] font-medium ${
                            job.pay === "Paid"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                              : "bg-sidebar border border-border/60"
                          }`}
                        >
                          {job.pay === "Paid" && <DollarSign className="w-3 h-3 mr-0.5" />}
                          {job.pay}
                        </Badge>

                        {job.relevantDegrees && job.relevantDegrees.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-sidebar px-2 py-0.5 rounded border border-border/50">
                            <GraduationCap className="w-3 h-3 text-primary shrink-0" />
                            <span className="truncate max-w-[240px]">{job.relevantDegrees.join(", ")}</span>
                          </div>
                        )}

                        <span className="text-[11px] text-muted-foreground ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.max(0, Math.floor((Date.now() - new Date(job.postedDate).getTime()) / 86400000))}d ago
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredJobs.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-sidebar/20 border-border/60 space-y-4">
            <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <div>
              <h3 className="font-bold text-lg text-foreground">No opportunities match your filters</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                {activeTab === "saved"
                  ? "You haven't saved any jobs yet. Click the 'Save' button on any role listing to add it to your collection!"
                  : activeTab === "applied"
                  ? "You haven't marked any applications as applied yet."
                  : `Try adjusting your search query or filters. Today's pool contains ${allJobs.length} active opportunities.`}
              </p>
            </div>
            {activeTab !== "all" ? (
              <Button variant="outline" size="sm" onClick={() => setActiveTab("all")}>
                View All {allJobs.length} Opportunities
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* In-App Job Portal / Application Reader Modal */}
      <Dialog open={!!selectedJob} onOpenChange={open => { if (!open) setSelectedJob(null); }}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
          {selectedJob && (
            <>
              {/* Modal Header Bar */}
              <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-sidebar/40">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{selectedJob.company}</span>
                      {selectedJob.jobCategory && (
                        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                          {selectedJob.jobCategory}
                        </Badge>
                      )}
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                      {selectedJob.title}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-3 pt-0.5">
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{selectedJob.location}, {selectedJob.country}</span>
                      <span>•</span>
                      <span className="flex items-center"><Globe className="w-3 h-3 mr-1" />{selectedJob.type}</span>
                      <span>•</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">{selectedJob.pay}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSave(selectedJob.id)}
                      className={`text-xs gap-1.5 h-8 font-medium ${
                        savedJobIds.has(selectedJob.id)
                          ? "text-amber-600 border-amber-500/40 bg-amber-500/10"
                          : "text-muted-foreground"
                      }`}
                    >
                      {savedJobIds.has(selectedJob.id) ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                      {savedJobIds.has(selectedJob.id) ? "Saved" : "Save Role"}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => window.open(getApplyUrl(selectedJob), "_blank", "noopener,noreferrer")}
                      className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      Apply Now <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Sub-tab switcher inside modal */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={modalTab === "overview" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setModalTab("overview")}
                      className="text-xs h-7 gap-1.5 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" /> Role Specification & Requirements
                    </Button>
                    <Button
                      variant={modalTab === "reader" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setModalTab("reader")}
                      className="text-xs h-7 gap-1.5 font-medium"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-500" /> Application Portal Reader
                    </Button>
                  </div>

                  <Button
                    variant={appliedJobIds.has(selectedJob.id) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleApplied(selectedJob.id)}
                    className="text-xs h-7 gap-1.5"
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${appliedJobIds.has(selectedJob.id) ? "text-emerald-500" : "text-muted-foreground"}`} />
                    {appliedJobIds.has(selectedJob.id) ? "Applied" : "Mark as Applied"}
                  </Button>
                </div>
              </DialogHeader>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
                {modalTab === "overview" ? (
                  <div className="space-y-6">

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-card border border-border p-4 rounded-xl shadow-2xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Industry / Field</span>
                        <span className="text-xs font-semibold text-foreground">{selectedJob.field}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Experience Level</span>
                        <span className="text-xs font-semibold text-foreground">{selectedJob.experienceLevel} Level</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Work Setting</span>
                        <span className="text-xs font-semibold text-foreground">{selectedJob.type}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Compensation</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{selectedJob.pay}</span>
                      </div>
                    </div>

                    {/* Eligible Degrees */}
                    {selectedJob.relevantDegrees && selectedJob.relevantDegrees.length > 0 && (
                      <div className="bg-card border border-border p-4 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-primary" /> Preferred & Eligible Fields of Study
                        </h4>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {selectedJob.relevantDegrees.map((deg, i) => (
                            <Badge key={i} variant="secondary" className="bg-sidebar border border-border/80 text-xs px-2.5 py-1">
                              {deg}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="bg-card border border-border p-5 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                        Role Overview & Key Responsibilities
                      </h4>
                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                        {selectedJob.description}
                      </p>
                    </div>

                    {/* Direct Portal External Link Box */}
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-primary block">Official Application Portal URL</span>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                          {getApplyUrl(selectedJob)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1 flex-1 sm:flex-none"
                          onClick={() => handleCopyLink(getApplyUrl(selectedJob))}
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
                          {copiedLink ? "Copied Link" : "Copy Link"}
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs gap-1.5 flex-1 sm:flex-none"
                          onClick={() => window.open(getApplyUrl(selectedJob), "_blank", "noopener,noreferrer")}
                        >
                          Open External Portal <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Application Reader View */
                  <div className="space-y-4">
                    <div className="p-4 bg-card border border-border rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-500" /> Direct Application Portal Frame
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1.5 h-7"
                          onClick={() => window.open(getApplyUrl(selectedJob), "_blank", "noopener,noreferrer")}
                        >
                          Open in New Browser Tab <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Target Portal Link: <span className="font-mono text-foreground">{getApplyUrl(selectedJob)}</span>
                      </p>
                    </div>

                    {/* Frame Container */}
                    <div className="w-full h-[400px] border border-border rounded-xl bg-white dark:bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                      <div className="max-w-md space-y-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-foreground">{selectedJob.company} Careers Portal</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Click below to open the official application form directly for <strong>{selectedJob.title}</strong>.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="gap-2 text-xs"
                          onClick={() => window.open(getApplyUrl(selectedJob), "_blank", "noopener,noreferrer")}
                        >
                          Launch {selectedJob.company} Application Portal <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
