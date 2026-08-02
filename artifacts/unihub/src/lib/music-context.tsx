import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, VolumeX, Maximize2, Minimize2, X, Headphones, 
  ExternalLink, Music, Radio, Play, Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export type MusicPlatform = "spotify" | "soundcloud";

export interface TrackItem {
  id: string;
  title: string;
  artistOrCurator: string;
  platform: MusicPlatform;
  embedUrl: string;
  rawUrl: string;
  tags?: string[];
}

export const DEFAULT_STUDY_TRACK: TrackItem = {
  id: "sp-lofi",
  title: "Lofi Beats for Studying",
  artistOrCurator: "Spotify Official",
  platform: "spotify",
  embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb1s3V39r?utm_source=generator",
  rawUrl: "https://open.spotify.com/playlist/37i9dQZF1DX8Ueb1s3V39r",
  tags: ["Lofi", "Relaxing", "Focus"],
};

interface MusicContextType {
  currentTrack: TrackItem | null;
  isPlaying: boolean;
  isExpanded: boolean;
  playTrack: (track: TrackItem) => void;
  stopTrack: () => void;
  togglePlay: () => void;
  setIsExpanded: (expanded: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<TrackItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const playTrack = (track: TrackItem) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const stopTrack = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isExpanded,
        playTrack,
        stopTrack,
        togglePlay,
        setIsExpanded,
      }}
    >
      {children}
      <GlobalFloatingPlayer />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}

function GlobalFloatingPlayer() {
  const { currentTrack, isPlaying, isExpanded, stopTrack, setIsExpanded } = useMusic();
  const [location, setLocation] = useLocation();

  if (!currentTrack) return null;

  const getPlatformIcon = (p: MusicPlatform) => {
    switch (p) {
      case "spotify":
        return <Music className="w-4 h-4 text-emerald-400" />;
      case "soundcloud":
        return <Radio className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-primary/30 bg-card/95 backdrop-blur-md ${
        isExpanded ? "w-80 sm:w-96" : "w-72 sm:w-80"
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3 bg-muted/40 border-b border-border/40">
        <div 
          className="flex items-center gap-2.5 min-w-0 cursor-pointer" 
          onClick={() => setLocation("/music")}
        >
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 relative">
            <Headphones className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold truncate hover:text-primary transition-colors">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] text-muted-foreground truncate">
              {currentTrack.artistOrCurator}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse Player" : "Expand Player"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={stopTrack}
            title="Stop Music"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Embedded Audio Iframe Container - Single Persistent Audio Instance */}
      <div className={`transition-all duration-300 ${isExpanded ? "p-3 bg-black/70" : "h-24 overflow-hidden relative opacity-95"}`}>
        <iframe
          src={currentTrack.embedUrl}
          width="100%"
          height={isExpanded ? "182" : "152"}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="w-full rounded-xl"
          title={currentTrack.title}
        />
      </div>

      {/* Footer Navigation Bar */}
      <div className="px-3 py-2 bg-background/80 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30">
        <span className="flex items-center gap-1.5 font-medium">
          {getPlatformIcon(currentTrack.platform)}
          <span className="capitalize">{currentTrack.platform} Live</span>
        </span>

        <button
          onClick={() => setLocation("/music")}
          className="text-primary hover:underline font-semibold flex items-center gap-1"
        >
          Music Hub <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

