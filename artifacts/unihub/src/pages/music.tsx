import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Music, Radio, Link as LinkIcon, Plus, Trash2, 
  Play, ExternalLink, Headphones, Sparkles, Volume2, Check, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getStorage, setStorage } from "@/lib/storage";
import { useMusic, MusicPlatform, TrackItem, DEFAULT_STUDY_TRACK } from "@/lib/music-context";

export interface SavedTrack {
  id: string;
  title: string;
  platform: MusicPlatform;
  embedUrl: string;
  rawUrl: string;
  addedAt: string;
}

// ── Clean & Verified Presets ───────────────────────────────────────────────
const SPOTIFY_PRESETS: TrackItem[] = [
  DEFAULT_STUDY_TRACK,
  {
    id: "sp-deep-focus",
    title: "Deep Focus Ambient",
    artistOrCurator: "Spotify Official",
    platform: "spotify",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadARdKQ?utm_source=generator",
    rawUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadARdKQ",
    tags: ["Ambient", "Post-Rock", "Instrumental"],
  },
  {
    id: "sp-piano",
    title: "Peaceful Piano Focus",
    artistOrCurator: "Spotify Official",
    platform: "spotify",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator",
    rawUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
    tags: ["Piano", "Calm", "Solo"],
  },
  {
    id: "sp-classical",
    title: "Instrumental Study",
    artistOrCurator: "Spotify Official",
    platform: "spotify",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX8NTB34pM2xO?utm_source=generator",
    rawUrl: "https://open.spotify.com/playlist/37i9dQZF1DX8NTB34pM2xO",
    tags: ["Classical", "Symphonic", "Work"],
  },
  {
    id: "sp-jazz",
    title: "Jazz Vibes & Lounge",
    artistOrCurator: "Spotify Official",
    platform: "spotify",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXbITWG1ZJKYt?utm_source=generator",
    rawUrl: "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt",
    tags: ["Jazz", "Smooth", "Coffee Shop"],
  },
];

const SOUNDCLOUD_PRESETS: TrackItem[] = [
  {
    id: "sc-lofi-girl",
    title: "Lofi Girl 24/7 Study Radio",
    artistOrCurator: "Lofi Girl",
    platform: "soundcloud",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1149591463&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    rawUrl: "https://soundcloud.com/lofigirl/lofi-hip-hop-radio-beats-to-relax-study-to",
    tags: ["Chillhop", "24/7", "Study"],
  },
  {
    id: "sc-ambient-rain",
    title: "Deep Ambient Study & Soft Rain",
    artistOrCurator: "SoundCloud Chill",
    platform: "soundcloud",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/293526315&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    rawUrl: "https://soundcloud.com",
    tags: ["Rain", "Atmospheric", "Soothing"],
  },
  {
    id: "sc-synth-study",
    title: "Synthwave & Cyberpunk Chill",
    artistOrCurator: "Retro Wave",
    platform: "soundcloud",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/332158882&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    rawUrl: "https://soundcloud.com",
    tags: ["Synthwave", "Retro", "Flow State"],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function parseInputUrl(url: string): { platform: MusicPlatform; embedUrl: string; rawUrl: string; title: string } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Spotify
  if (trimmed.includes("spotify.com")) {
    const match = trimmed.match(/spotify\.com\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?(playlist|track|album|artist)\/([a-zA-Z0-9]+)/i);
    if (match) {
      const type = match[1];
      const id = match[2];
      return {
        platform: "spotify",
        embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`,
        rawUrl: `https://open.spotify.com/${type}/${id}`,
        title: `Custom Spotify ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      };
    }
    if (trimmed.includes("spotify.com/embed/")) {
      return {
        platform: "spotify",
        embedUrl: trimmed,
        rawUrl: trimmed.replace("/embed/", "/"),
        title: "Custom Spotify Stream",
      };
    }
  }

  // SoundCloud
  if (trimmed.includes("soundcloud.com")) {
    let embedUrl = trimmed;
    if (!trimmed.includes("w.soundcloud.com/player")) {
      embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
    }
    return {
      platform: "soundcloud",
      embedUrl,
      rawUrl: trimmed,
      title: "Custom SoundCloud Audio Track",
    };
  }

  return null;
}

export default function MusicPage() {
  const { currentTrack, playTrack, isExpanded, setIsExpanded } = useMusic();
  const [activeTab, setActiveTab] = useState<MusicPlatform | "saved">("spotify");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [copied, setCopied] = useState(false);

  // Set default active track if none currently selected
  const activeTrack = currentTrack || SPOTIFY_PRESETS[0];

  useEffect(() => {
    const loaded = getStorage<SavedTrack[]>("unihub_saved_music", []);
    setSavedTracks(loaded);
  }, []);

  const handleEmbedCustomUrl = () => {
    setUrlError(null);
    const parsed = parseInputUrl(customUrlInput);
    if (!parsed) {
      setUrlError("Invalid URL. Please enter a valid Spotify or SoundCloud link.");
      return;
    }

    const newTrack: TrackItem = {
      id: "custom-" + Date.now(),
      title: parsed.title,
      artistOrCurator: "User Link",
      platform: parsed.platform,
      embedUrl: parsed.embedUrl,
      rawUrl: parsed.rawUrl,
      tags: ["Custom", parsed.platform.toUpperCase()],
    };

    playTrack(newTrack);
    setActiveTab(parsed.platform);
    setCustomUrlInput("");
  };

  const handleSaveTrack = (track: TrackItem) => {
    const existing = savedTracks.find((s) => s.rawUrl === track.rawUrl || s.embedUrl === track.embedUrl);
    if (existing) return;

    const newSaved: SavedTrack = {
      id: "saved-" + Date.now(),
      title: track.title,
      platform: track.platform,
      embedUrl: track.embedUrl,
      rawUrl: track.rawUrl,
      addedAt: new Date().toLocaleDateString(),
    };

    const updated = [newSaved, ...savedTracks];
    setSavedTracks(updated);
    setStorage("unihub_saved_music", updated);
  };

  const handleRemoveSaved = (id: string) => {
    const updated = savedTracks.filter((s) => s.id !== id);
    setSavedTracks(updated);
    setStorage("unihub_saved_music", updated);
  };

  const handleCopyLink = () => {
    if (activeTrack?.rawUrl) {
      navigator.clipboard.writeText(activeTrack.rawUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const platformBadgeColor = (p: MusicPlatform) => {
    switch (p) {
      case "spotify":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "soundcloud":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <Headphones className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Music & Radio Hub</h1>
            <p className="text-muted-foreground text-sm">
              Stream focus beats, ambient sounds, or link your favorite Spotify & SoundCloud playlists.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Persistent Note Alert */}
      <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
          <span><strong>Continuous Playback:</strong> Music keeps playing uninterrupted while you navigate anywhere inside ONEX Global!</span>
        </span>
      </div>

      {/* URL Embedder Bar */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-md">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <LinkIcon className="w-4 h-4 text-primary" />
            <span>Link your own music</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Paste Spotify or SoundCloud link (e.g. https://open.spotify.com/playlist/...)"
              value={customUrlInput}
              onChange={(e) => {
                setCustomUrlInput(e.target.value);
                setUrlError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleEmbedCustomUrl()}
              className="bg-background/80"
            />
            <Button onClick={handleEmbedCustomUrl} className="shrink-0 font-semibold gap-2">
              <Plus className="w-4 h-4" /> Embed &amp; Play
            </Button>
          </div>
          {urlError && <p className="text-xs text-destructive font-medium">{urlError}</p>}
        </CardContent>
      </Card>

      {/* Main Grid: Active Player + Station Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-primary/20 bg-card shadow-xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Volume2 className="w-5 h-5 text-primary shrink-0 animate-pulse" />
                  <div className="truncate">
                    <CardTitle className="text-base font-bold truncate">{activeTrack.title}</CardTitle>
                    <CardDescription className="text-xs truncate">{activeTrack.artistOrCurator}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={`capitalize text-xs ${platformBadgeColor(activeTrack.platform)}`}>
                    {activeTrack.platform}
                  </Badge>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleCopyLink} title="Copy track link">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 h-8"
                    onClick={() => handleSaveTrack(activeTrack)}
                  >
                    <Plus className="w-3.5 h-3.5" /> Save
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 bg-gradient-to-b from-card to-black/40 space-y-6">
              {/* Animated Waveform / Equalizer Visualizer */}
              <div className="p-8 rounded-2xl bg-black/60 border border-primary/20 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />

                {/* Animated Equalizer Bars */}
                <div className="flex items-end justify-center gap-1.5 h-12">
                  <span className="w-2 bg-primary rounded-full animate-[bounce_1s_infinite_100ms] h-8" />
                  <span className="w-2 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_300ms] h-12" />
                  <span className="w-2 bg-primary rounded-full animate-[bounce_1s_infinite_200ms] h-6" />
                  <span className="w-2 bg-amber-400 rounded-full animate-[bounce_1s_infinite_400ms] h-10" />
                  <span className="w-2 bg-primary rounded-full animate-[bounce_1s_infinite_150ms] h-7" />
                </div>

                <div className="space-y-1 relative z-10">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1.5 text-xs py-1 px-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Background Audio Stream
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground pt-2">{activeTrack.title}</h3>
                  <p className="text-xs text-muted-foreground">{activeTrack.artistOrCurator}</p>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 relative z-10">
                  <Button
                    onClick={() => playTrack(activeTrack)}
                    className="gap-2 font-semibold shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" /> Play / Switch Station
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="gap-2 border-primary/30"
                  >
                    <Headphones className="w-4 h-4 text-primary" /> {isExpanded ? "Collapse Widget" : "Expand Floating Player"}
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-primary font-medium">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Continuous Playback:</strong> Navigate to Dashboard, Timer, or Notes — music stays playing in the floating player!</span>
                </span>
                {activeTrack.rawUrl && (
                  <a
                    href={activeTrack.rawUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-foreground shrink-0 font-bold"
                  >
                    Open Link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Station Selector & Saved Tracks (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as MusicPlatform | "saved")} className="w-full">
            <TabsList className="grid grid-cols-3 w-full bg-muted/60 p-1">
              <TabsTrigger value="spotify" className="text-xs font-semibold gap-1">
                <Music className="w-3.5 h-3.5 text-emerald-400" /> Spotify
              </TabsTrigger>
              <TabsTrigger value="soundcloud" className="text-xs font-semibold gap-1">
                <Radio className="w-3.5 h-3.5 text-orange-400" /> SoundCloud
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs font-semibold gap-1">
                Saved ({savedTracks.length})
              </TabsTrigger>
            </TabsList>

            {/* Spotify Tab */}
            <TabsContent value="spotify" className="space-y-3 mt-4">
              {SPOTIFY_PRESETS.map((track) => {
                const isActive = activeTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.15)]"
                        : "border-border/60 bg-card hover:border-border hover:bg-card/80"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                        <Music className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold truncate">{track.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{track.artistOrCurator}</span>
                          <div className="flex gap-1">
                            {track.tags?.slice(0, 2).map((t) => (
                              <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant={isActive ? "default" : "secondary"} size="icon" className="h-8 w-8 shrink-0">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </Button>
                  </div>
                );
              })}
            </TabsContent>

            {/* SoundCloud Tab */}
            <TabsContent value="soundcloud" className="space-y-3 mt-4">
              {SOUNDCLOUD_PRESETS.map((track) => {
                const isActive = activeTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "border-orange-500/50 bg-orange-500/10 shadow-[0_0_16px_rgba(249,115,22,0.15)]"
                        : "border-border/60 bg-card hover:border-border hover:bg-card/80"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold truncate">{track.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{track.artistOrCurator}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant={isActive ? "default" : "secondary"} size="icon" className="h-8 w-8 shrink-0">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </Button>
                  </div>
                );
              })}
            </TabsContent>

            {/* Saved Tab */}
            <TabsContent value="saved" className="space-y-3 mt-4">
              {savedTracks.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-xl space-y-2">
                  <Music className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium">No saved music links yet</p>
                  <p className="text-xs text-muted-foreground">
                    Click "+ Save" on any track or embed a custom URL above to save it here.
                  </p>
                </div>
              ) : (
                savedTracks.map((saved) => (
                  <div
                    key={saved.id}
                    className="p-3.5 rounded-xl border border-border/60 bg-card flex items-center justify-between gap-3"
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      onClick={() => {
                        playTrack({
                          id: saved.id,
                          title: saved.title,
                          artistOrCurator: "Saved Link",
                          platform: saved.platform,
                          embedUrl: saved.embedUrl,
                          rawUrl: saved.rawUrl,
                          tags: ["Saved"],
                        });
                      }}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold truncate">{saved.title}</h4>
                        <span className="text-xs text-muted-foreground capitalize">{saved.platform} · Added {saved.addedAt}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleRemoveSaved(saved.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

