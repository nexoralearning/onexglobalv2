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
import {
  Briefcase, MapPin, Building2, ExternalLink,
  BookmarkPlus, BookmarkCheck, DollarSign,
  GraduationCap, RefreshCw, Search
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

export default function Jobs() {
  const user = useRequireAuth();

  // Daily job pool — deterministic for today, different tomorrow
  const [allJobs] = useState<Job[]>(() => getDailyJobs(70));
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [fieldFilter, setFieldFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");

  useEffect(() => {
    if (user) {
      const saved = new Set(getStorage<string[]>("unihub_saved_jobs", []));
      setSavedJobIds(saved);
    }
  }, [user]);

  if (!user) return null;

  const toggleSave = (id: string) => {
    const next = new Set(savedJobIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSavedJobIds(next);
    setStorage("unihub_saved_jobs", Array.from(next));
  };

  const clearFilters = () => {
    setSearch("");
    setJobTypeFilter("All");
    setFieldFilter("All");
    setCountryFilter("All");
    setTypeFilter("All");
  };

  // Derive country list from today's pool
  const countries = ["All", ...Array.from(new Set(allJobs.map(j => j.country))).sort()];

  const filteredJobs = allJobs.filter(j => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) &&
        !j.company.toLowerCase().includes(search.toLowerCase()) &&
        !j.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (fieldFilter !== "All" && j.field !== fieldFilter) return false;
    if (countryFilter !== "All" && j.country !== countryFilter) return false;
    if (typeFilter !== "All" && j.type !== typeFilter) return false;
    if (jobTypeFilter !== "All" && j.jobCategory !== jobTypeFilter) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs & Internships</h1>
          <p className="text-muted-foreground mt-2">
            Discover opportunities perfectly matched to your field of study.
          </p>
        </div>
        {/* Daily refresh badge */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border rounded-lg px-3 py-2 shrink-0 shadow-sm">
          <RefreshCw className="w-3.5 h-3.5 text-primary animate-none" />
          <span>
            <span className="font-semibold text-foreground">Refreshed daily</span>
            {" · "}Updated {getTodayLabel()}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, or keyword…"
            className="pl-9 bg-background"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Filter row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Job Type</label>
            <Select value={jobTypeFilter} onChange={e => setJobTypeFilter(e.target.value)}>
              {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Industry</label>
            <Select value={fieldFilter} onChange={e => setFieldFilter(e.target.value)}>
              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Country</label>
            <Select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Work Setting</label>
            <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="All">Any Setting</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>{filteredJobs.length} of {allJobs.length} listings shown today</span>
          {(search || fieldFilter !== "All" || countryFilter !== "All" || typeFilter !== "All" || jobTypeFilter !== "All") && (
            <button onClick={clearFilters} className="text-primary hover:underline font-medium">Clear filters</button>
          )}
        </div>
      </div>

      {/* Listings */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job, idx) => {
            const isSaved = savedJobIds.has(job.id);
            return (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: Math.min(idx * 0.03, 0.25) }}
              >
                <Card className="hover-elevate transition-all bg-card border-border group">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6">

                    {/* Company logo placeholder */}
                    <div className="hidden md:flex w-14 h-14 rounded-xl bg-sidebar items-center justify-center border shrink-0 text-xl font-bold text-muted-foreground shadow-sm group-hover:border-primary/30 transition-colors">
                      {job.company.substring(0, 1)}
                    </div>

                    <div className="flex-1 space-y-3 min-w-0">
                      {/* Title row */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                            {job.jobCategory && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 shrink-0 text-xs">
                                {job.jobCategory}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center text-foreground font-medium">
                              <Building2 className="w-3.5 h-3.5 mr-1.5 opacity-60" />{job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-60" />{job.location}, {job.country}
                            </span>
                            <span className="flex items-center">
                              <Briefcase className="w-3.5 h-3.5 mr-1.5 opacity-60" />{job.type}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleSave(job.id)}
                            className={`h-9 w-9 ${isSaved ? "text-primary border-primary/40 bg-primary/5" : "text-muted-foreground"}`}
                          >
                            {isSaved
                              ? <BookmarkCheck className="w-4 h-4 fill-primary/20" />
                              : <BookmarkPlus className="w-4 h-4" />}
                          </Button>
                          <Button size="sm" className="shrink-0">
                            Apply <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2 max-w-4xl">
                        {job.description}
                      </p>

                      {/* Tags row */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant="secondary" className="bg-sidebar border border-border/50 text-xs font-medium">
                          {job.field}
                        </Badge>
                        <Badge variant="secondary" className="bg-sidebar border border-border/50 text-xs font-medium">
                          {job.experienceLevel} Level
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs font-medium ${job.pay === "Paid"
                            ? "bg-green-500/10 text-green-600 border border-green-500/20"
                            : "bg-sidebar border border-border/50"}`}
                        >
                          {job.pay === "Paid" && <DollarSign className="w-3 h-3 mr-0.5" />}
                          {job.pay}
                        </Badge>
                        {job.relevantDegrees && job.relevantDegrees.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-sidebar/50 px-2 py-1 rounded-md border border-border/30">
                            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[220px]">{job.relevantDegrees.join(", ")}</span>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto self-center">
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
          <div className="text-center py-24 border-2 border-dashed rounded-xl bg-sidebar/30 border-border/60">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="font-semibold text-xl text-foreground">No opportunities found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Try adjusting your filters or search term — today's pool has {allJobs.length} listings.
            </p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
