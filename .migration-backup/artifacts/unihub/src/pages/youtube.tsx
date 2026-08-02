import { useState } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { fetchYouTubeVideos, YouTubeVideo } from "@/lib/youtube";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PlayCircle, Search, Clock, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const SUBJECT_COLORS: Record<string, string> = {
  "Computer Science": "bg-blue-500/10 text-blue-500",
  "Mathematics": "bg-violet-500/10 text-violet-500",
  "Physics": "bg-cyan-500/10 text-cyan-500",
  "Chemistry": "bg-emerald-500/10 text-emerald-500",
  "Biology": "bg-green-500/10 text-green-500",
  "Economics": "bg-amber-500/10 text-amber-600",
  "Business": "bg-orange-500/10 text-orange-500",
  "Law": "bg-red-500/10 text-red-500",
  "Psychology": "bg-pink-500/10 text-pink-500",
  "Engineering": "bg-slate-500/10 text-slate-400",
  "History": "bg-stone-500/10 text-stone-400",
};

export default function YouTubeResources() {
  const user = useRequireAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  if (!user) return null;

  const allVideos = fetchYouTubeVideos(searchQuery);
  const filteredVideos = allVideos.filter(v => {
    if (subjectFilter !== "All" && v.subject !== subjectFilter) return false;
    if (levelFilter !== "All" && v.degreeLevel !== levelFilter) return false;
    return true;
  });

  const subjects = ["All", ...Array.from(new Set(allVideos.map(v => v.subject))).sort()];
  const levels = ["All", "Undergraduate", "Postgraduate"];

  const openVideo = (video: YouTubeVideo) => {
    window.open(video.watchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">YouTube Library</h1>
        <p className="text-muted-foreground mt-2">
          Curated video lectures from Harvard, MIT, 3Blue1Brown, CrashCourse, and more — click any card to watch on YouTube.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, subject or channel…"
            className="pl-9 bg-card"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-52">
          <Select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
            {subjects.map(s => <option key={s} value={s}>{s === "All" ? "All Subjects" : s}</option>)}
          </Select>
        </div>
        <div className="w-full sm:w-44">
          <Select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            {levels.map(l => <option key={l} value={l}>{l === "All" ? "All Levels" : l}</option>)}
          </Select>
        </div>
      </div>

      {filteredVideos.length > 0 && (
        <p className="text-xs text-muted-foreground -mt-4">
          {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVideos.map((video, idx) => {
          const subjectColor = SUBJECT_COLORS[video.subject] ?? "bg-muted text-muted-foreground";
          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.025, 0.3) }}
            >
              <Card
                className="hover-elevate cursor-pointer group h-full flex flex-col overflow-hidden bg-card border-border transition-all hover:border-primary/30"
                onClick={() => openVideo(video)}
                role="link"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && openVideo(video)}
                aria-label={`Watch ${video.title} on YouTube`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-sidebar">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={e => {
                      // Fallback: colored placeholder with subject initial
                      const el = e.currentTarget;
                      el.style.display = "none";
                      el.parentElement?.classList.add("flex", "items-center", "justify-center");
                    }}
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                      <PlayCircle className="w-7 h-7 text-white fill-white" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-2.5 h-2.5" /> {video.duration}
                  </div>
                  {/* YouTube logo */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white rounded px-1.5 py-0.5 flex items-center gap-1 text-[10px] font-bold backdrop-blur-sm">
                    <Youtube className="w-3 h-3 text-red-500" /> YouTube
                  </div>
                </div>

                {/* Info */}
                <CardContent className="p-4 flex-1 flex flex-col gap-2">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Youtube className="w-3 h-3 shrink-0" />
                    <span className="truncate">{video.channelName}</span>
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    <Badge className={`text-[10px] px-1.5 py-0 h-4 border-0 font-medium ${subjectColor}`}>
                      {video.subject}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border/60">
                      {video.degreeLevel}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border/60">
                      {video.country}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-border bg-sidebar/30">
          <Youtube className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
          <h3 className="font-semibold text-lg">No videos found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
