import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { fetchYouTubeVideos, YouTubeVideo, parseYouTubeInput } from "@/lib/youtube";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlayCircle, Search, Clock, Youtube, ExternalLink, Link2, Sparkles, Bookmark, BookmarkCheck, Trash2, ListVideo } from "lucide-react";
import { motion } from "framer-motion";

const PLAYLIST_STORAGE_KEY = "unihub_saved_playlist_v1";

const SUBJECT_COLORS: Record<string, string> = {
  "Motivation":            "bg-yellow-500/10 text-yellow-500",
  "Computer Science":      "bg-blue-500/10 text-blue-500",
  "Cybersecurity":         "bg-red-500/10 text-red-500",
  "Mathematics":           "bg-violet-500/10 text-violet-500",
  "Physics":               "bg-cyan-500/10 text-cyan-500",
  "Chemistry":             "bg-emerald-500/10 text-emerald-500",
  "Biology":               "bg-green-500/10 text-green-500",
  "Medicine":              "bg-rose-500/10 text-rose-500",
  "Nursing":               "bg-pink-400/10 text-pink-400",
  "Economics":             "bg-amber-500/10 text-amber-500",
  "Business":              "bg-orange-500/10 text-orange-500",
  "Accounting":            "bg-lime-500/10 text-lime-500",
  "Data Science":          "bg-indigo-500/10 text-indigo-400",
  "Law":                   "bg-red-500/10 text-red-500",
  "Psychology":            "bg-fuchsia-500/10 text-fuchsia-400",
  "Engineering":           "bg-slate-500/10 text-slate-400",
  "History":               "bg-stone-500/10 text-stone-400",
  "Philosophy":            "bg-purple-500/10 text-purple-400",
  "Architecture":          "bg-teal-500/10 text-teal-400",
  "Environmental Science": "bg-green-600/10 text-green-400",
  "English":               "bg-sky-500/10 text-sky-400",
};

const POPULAR_CHANNELS = [
  { name: "3Blue1Brown", query: "3Blue1Brown" },
  { name: "Prof Leonard", query: "Professor Leonard" },
  { name: "Org Chem Tutor", query: "Organic Chemistry Tutor" },
  { name: "Khan Academy", query: "Khan Academy" },
  { name: "CS50", query: "CS50" },
  { name: "freeCodeCamp", query: "freeCodeCamp" },
  { name: "Mosh", query: "Mosh" },
  { name: "Bro Code", query: "Bro Code" },
  { name: "Fireship", query: "Fireship" },
  { name: "NetworkChuck", query: "NetworkChuck" },
  { name: "John Hammond", query: "John Hammond" },
  { name: "David Bombal", query: "David Bombal" },
  { name: "LiveOverflow", query: "LiveOverflow" },
  { name: "Efficient Engineer", query: "Efficient Engineer" },
  { name: "Practical Eng", query: "Practical Engineering" },
  { name: "Eng Explained", query: "Engineering Explained" },
  { name: "MIT OCW", query: "MIT OpenCourseWare" },
  { name: "Michel van Biezen", query: "Michel van Biezen" },
  { name: "Flipping Physics", query: "Flipping Physics" },
  { name: "Prof Dave", query: "Professor Dave Explains" },
  { name: "Tyler DeWitt", query: "Tyler DeWitt" },
  { name: "Ninja Nerd", query: "Ninja Nerd" },
  { name: "Osmosis", query: "Osmosis" },
  { name: "Armando Hasudungan", query: "Armando Hasudungan" },
  { name: "CrashCourse", query: "CrashCourse" },
  { name: "Jacob Clifford", query: "Jacob Clifford" },
  { name: "Marginal Rev", query: "Marginal Revolution" },
  { name: "Harvard Biz Review", query: "Harvard Business Review" },
  { name: "Stanford GSB", query: "Stanford Graduate School" },
  { name: "YaleCourses", query: "YaleCourses" },
  { name: "LegalEagle", query: "LegalEagle" },
  { name: "Law Simplified", query: "Law Simplified" },
  { name: "StatQuest", query: "StatQuest" },
  { name: "Brandon Foltz", query: "Brandon Foltz" },
];

export default function YouTubeResources() {
  const user = useRequireAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [viewTab, setViewTab] = useState<"all" | "saved">("all");
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [urlError, setUrlError] = useState("");
  const [channelNotice, setChannelNotice] = useState("");

  // Saved Playlist in localStorage
  const [savedPlaylist, setSavedPlaylist] = useState<YouTubeVideo[]>(() => {
    try {
      const stored = localStorage.getItem(PLAYLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(savedPlaylist));
    } catch {
      // ignore storage write errors
    }
  }, [savedPlaylist]);

  if (!user) return null;

  const isVideoSaved = (youtubeId: string) => {
    return savedPlaylist.some(item => item.youtubeId === youtubeId);
  };

  const toggleSaveVideo = (video: YouTubeVideo) => {
    if (isVideoSaved(video.youtubeId)) {
      setSavedPlaylist(prev => prev.filter(item => item.youtubeId !== video.youtubeId));
    } else {
      setSavedPlaylist(prev => [video, ...prev]);
    }
  };

  const handlePlayCustomUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUrlError("");
    setChannelNotice("");

    const parsed = parseYouTubeInput(customUrlInput);

    if (parsed.type === "channel") {
      const channelName = parsed.channelName || "CS50";
      setSearchQuery(channelName);
      setChannelNotice(`Showing video collection for YouTube Channel: ${channelName} (UCcabW7890RKJzL968QWEykA)`);
      return;
    }

    if (parsed.type === "video" && parsed.id) {
      const customVideo: YouTubeVideo = {
        id: `custom-${parsed.id}`,
        youtubeId: parsed.id,
        title: `Custom Saved Video (${parsed.id})`,
        channelName: "YouTube Custom Video",
        thumbnail: `https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg`,
        watchUrl: `https://www.youtube.com/watch?v=${parsed.id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${parsed.id}?autoplay=1&rel=0`,
        duration: "Custom",
        subject: "Custom Video",
        country: "Global",
        degreeLevel: "All Levels",
      };
      setActiveVideo(customVideo);
      return;
    }

    setUrlError("Invalid YouTube link, channel URL, or video ID. Please enter a valid YouTube video or channel link.");
  };

  const handleSaveCustomUrl = () => {
    setUrlError("");
    setChannelNotice("");
    const parsed = parseYouTubeInput(customUrlInput);

    if (parsed.type === "video" && parsed.id) {
      const customVideo: YouTubeVideo = {
        id: `custom-${parsed.id}`,
        youtubeId: parsed.id,
        title: `Custom Video (${parsed.id})`,
        channelName: "User Saved Link",
        thumbnail: `https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg`,
        watchUrl: `https://www.youtube.com/watch?v=${parsed.id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${parsed.id}?autoplay=1&rel=0`,
        duration: "Custom",
        subject: "Custom Saved",
        country: "Global",
        degreeLevel: "All Levels",
      };
      if (!isVideoSaved(parsed.id)) {
        toggleSaveVideo(customVideo);
        setChannelNotice(`Successfully saved video to your UniHub Playlist!`);
      } else {
        setChannelNotice(`Video is already in your UniHub Playlist.`);
      }
      return;
    }

    setUrlError("Please enter a valid YouTube video URL to save to your playlist.");
  };

  const allCuratedVideos = fetchYouTubeVideos(searchQuery);

  // If viewTab === "saved", source is savedPlaylist filtered by query/filters
  const sourceList = viewTab === "saved" ? savedPlaylist : allCuratedVideos;

  const filteredVideos = sourceList.filter(v => {
    if (viewTab === "saved" && searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = v.title.toLowerCase().includes(q) || v.subject.toLowerCase().includes(q) || v.channelName.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (subjectFilter !== "All" && v.subject !== subjectFilter) return false;
    if (levelFilter !== "All" && v.degreeLevel !== levelFilter) return false;
    return true;
  });

  const subjects = ["All", ...Array.from(new Set(allCuratedVideos.map(v => v.subject))).sort()];
  const levels = ["All", "Undergraduate", "Postgraduate"];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">YouTube Educational Hub</h1>
          <p className="text-muted-foreground mt-1">
            Access curated lecture streams from MIT, Harvard, CS50, 3Blue1Brown & freeCodeCamp — or paste and save any YouTube video to your personal playlist!
          </p>
        </div>

        {/* View Switcher: All Videos vs Saved Playlist */}
        <div className="flex items-center gap-2 bg-sidebar border border-border p-1 rounded-lg shrink-0">
          <Button
            variant={viewTab === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewTab("all")}
            className="text-xs h-8 gap-1.5"
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            Curated Library
          </Button>
          <Button
            variant={viewTab === "saved" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewTab("saved")}
            className="text-xs h-8 gap-1.5 relative"
          >
            <ListVideo className="w-3.5 h-3.5 text-primary" />
            My Playlist
            {savedPlaylist.length > 0 && (
              <Badge className="ml-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0 rounded-full h-4">
                {savedPlaylist.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Paste any YouTube URL bar */}
      <Card className="bg-card border-primary/20 shadow-sm p-4">
        <form onSubmit={handlePlayCustomUrl} className="space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-500" /> Watch Any YouTube Video or Save to Playlist:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Paste YouTube video or channel link (e.g. https://www.youtube.com/channel/UCcabW7890RKJzL968QWEykA)..."
                className="pl-9 bg-sidebar/50"
                value={customUrlInput}
                onChange={e => {
                  setCustomUrlInput(e.target.value);
                  if (urlError) setUrlError("");
                  if (channelNotice) setChannelNotice("");
                }}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white gap-1.5 text-xs">
                <PlayCircle className="w-4 h-4" /> Load & Watch
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveCustomUrl}
                className="gap-1.5 text-xs border-primary/40 hover:bg-primary/10"
              >
                <Bookmark className="w-4 h-4 text-primary" /> Save to Playlist
              </Button>
            </div>
          </div>
          {channelNotice && <p className="text-xs text-green-500 font-medium flex items-center gap-1">✓ {channelNotice}</p>}
          {urlError && <p className="text-xs text-red-500 font-medium">{urlError}</p>}
        </form>
      </Card>

      {/* Quick Channel Filters */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Top Educational Channels:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CHANNELS.map(ch => (
            <Button
              key={ch.name}
              variant="outline"
              size="sm"
              className={`text-xs h-7 gap-1.5 ${searchQuery.toLowerCase().includes(ch.name.toLowerCase()) ? "border-primary bg-primary/10" : ""}`}
              onClick={() => {
                setViewTab("all");
                setSearchQuery(ch.name);
              }}
            >
              <Youtube className="w-3 h-3 text-red-500" /> {ch.name}
            </Button>
          ))}
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-muted-foreground"
              onClick={() => setSearchQuery("")}
            >
              Clear filter
            </Button>
          )}
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={viewTab === "saved" ? "Search inside your saved playlist..." : "Search by title, subject or channel (e.g. Calculus, CS50, Physics)..."}
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

      {/* Count & Section Info */}
      <div className="flex items-center justify-between -mt-4">
        <p className="text-xs text-muted-foreground">
          {viewTab === "saved"
            ? `Showing ${filteredVideos.length} video${filteredVideos.length !== 1 ? "s" : ""} in your saved playlist`
            : `Showing ${filteredVideos.length} academic video${filteredVideos.length !== 1 ? "s" : ""}`
          }
        </p>
        {viewTab === "saved" && savedPlaylist.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSavedPlaylist([])}
            className="text-xs h-7 text-red-400 hover:text-red-500 hover:bg-red-500/10 gap-1"
          >
            <Trash2 className="w-3 h-3" /> Clear Playlist
          </Button>
        )}
      </div>

      {/* Video Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVideos.map((video, idx) => {
          const subjectColor = SUBJECT_COLORS[video.subject] ?? "bg-muted text-muted-foreground";
          const saved = isVideoSaved(video.youtubeId);
          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.25) }}
            >
              <Card
                className={`hover-elevate group h-full flex flex-col overflow-hidden bg-card border-border transition-all hover:border-primary/40 ${saved ? "ring-1 ring-primary/40" : ""}`}
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-video overflow-hidden bg-sidebar cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={e => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                      el.parentElement?.classList.add("flex", "items-center", "justify-center");
                    }}
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-xl">
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

                  {/* Bookmark Save Button on Thumbnail Top-Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveVideo(video);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
                      saved
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-black/60 text-white hover:bg-black/80 hover:text-primary"
                    }`}
                    title={saved ? "Remove from My Playlist" : "Save to My Playlist"}
                  >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Info */}
                <CardContent className="p-4 flex-1 flex flex-col gap-2">
                  <h3
                    className="font-semibold text-sm line-clamp-2 cursor-pointer group-hover:text-primary transition-colors leading-snug"
                    onClick={() => setActiveVideo(video)}
                  >
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center justify-between gap-1.5">
                    <span className="flex items-center gap-1 truncate">
                      <Youtube className="w-3 h-3 shrink-0 text-red-500" />
                      <span className="truncate">{video.channelName}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(video.watchUrl, "_blank", "noopener,noreferrer");
                      }}
                      className="text-muted-foreground hover:text-red-500 text-[11px] flex items-center gap-0.5 shrink-0 underline"
                      title="Open directly on YouTube"
                    >
                      <ExternalLink className="w-3 h-3" /> YT
                    </button>
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-1.5 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className={`text-[10px] px-1.5 py-0 h-4 border-0 font-medium ${subjectColor}`}>
                        {video.subject}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border/60">
                        {video.degreeLevel}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-6 w-6 shrink-0 ${saved ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                      onClick={() => toggleSaveVideo(video)}
                      title={saved ? "Saved in Playlist" : "Save to Playlist"}
                    >
                      {saved ? <BookmarkCheck className="w-4 h-4 fill-primary/20" /> : <Bookmark className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-xl border-border bg-sidebar/30 space-y-3">
          <Youtube className="w-10 h-10 text-muted-foreground mx-auto opacity-30" />
          {viewTab === "saved" ? (
            <>
              <h3 className="font-semibold text-lg">Your Saved Playlist is Empty</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Bookmark any video from the curated collection or paste a custom YouTube link above to save videos directly to your personal in-app playlist!
              </p>
              <Button
                className="bg-primary text-primary-foreground gap-2 text-xs"
                onClick={() => setViewTab("all")}
              >
                Browse Curated Library
              </Button>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-lg">No matching videos found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                You can search directly on YouTube or paste any video link into the "Watch Any YouTube Video" bar above!
              </p>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white gap-2"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery || "university lecture")}`, "_blank")}
              >
                <ExternalLink className="w-4 h-4" /> Search "{searchQuery || "lectures"}" on YouTube
              </Button>
            </>
          )}
        </div>
      )}

      {/* In-App Video Player Dialog */}
      <Dialog open={!!activeVideo} onOpenChange={open => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
          {activeVideo && (
            <div>
              <DialogHeader className="p-4 sm:p-6 pb-2">
                <div className="flex items-center justify-between gap-3">
                  <DialogTitle className="text-lg font-bold line-clamp-1 flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-500 shrink-0" />
                    {activeVideo.title}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <span>{activeVideo.channelName}</span> • <span>{activeVideo.subject}</span> • <span>{activeVideo.duration}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Responsive Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              {/* Bottom bar with Playlist Save option */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border bg-sidebar/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[11px]">Level: {activeVideo.degreeLevel}</Badge>
                    <Badge variant="outline" className="text-[11px]">Region: {activeVideo.country}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    If YouTube restricts playback inside embedded frames, click "Open in YouTube" to watch directly.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isVideoSaved(activeVideo.youtubeId) ? "default" : "outline"}
                    onClick={() => toggleSaveVideo(activeVideo)}
                    className="gap-1.5 text-xs shrink-0"
                  >
                    {isVideoSaved(activeVideo.youtubeId) ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-primary-foreground" />
                        Saved in Playlist
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5 text-primary" />
                        Save to Playlist
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.open(activeVideo.watchUrl, "_blank", "noopener,noreferrer")}
                    className="gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in YouTube
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

