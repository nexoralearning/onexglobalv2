/**
 * timer.tsx — Focus Timer setup page.
 * User picks a duration + label, hits "Lock In", and the FocusLock overlay takes over.
 */
import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Timer, Play, ShieldCheck, Bell, BellOff, Clock, Zap, Flame, Moon, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { startFocus, stopFocus, isFocusActive, getFocusSession, getFocusRemaining, formatMs } from '@/lib/focus-timer';
import { useMusic, DEFAULT_STUDY_TRACK } from '@/lib/music-context';

const PRESETS = [
  { label: 'Pomodoro',  mins: 25,  icon: Clock,  desc: 'Classic focus sprint' },
  { label: 'Deep Work', mins: 52,  icon: Zap,    desc: 'Peak concentration block' },
  { label: '1 Hour',    mins: 60,  icon: Flame,  desc: 'Full power hour' },
  { label: '2 Hours',   mins: 120, icon: Moon,   desc: 'Long study session' },
];

const SESSION_NAMES = [
  'Deep Work', 'Revision', 'Essay Writing', 'Problem Sets',
  'Exam Prep', 'Coding', 'Research', 'Reading',
];

export default function FocusTimer() {
  const user = useRequireAuth();
  const { currentTrack, playTrack, setIsExpanded } = useMusic();
  const [selectedMins, setSelectedMins] = useState(25);
  const [customMins, setCustomMins] = useState('');
  const [label, setLabel] = useState('Deep Work');
  const [customLabel, setCustomLabel] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [remaining, setRemaining] = useState(0);

  // Auto-open Spotify popup player when user enters Timer page
  useEffect(() => {
    if (!currentTrack) {
      playTrack(DEFAULT_STUDY_TRACK);
    }
    setIsExpanded(true);
  }, []);

  useEffect(() => {
    const sync = () => {
      setIsActive(isFocusActive());
      setRemaining(getFocusRemaining());
    };
    sync();
    const id = setInterval(sync, 500);
    window.addEventListener('unihub_focus_changed', sync);
    return () => { clearInterval(id); window.removeEventListener('unihub_focus_changed', sync); };
  }, []);


  if (!user) return null;

  const effectiveMins = customMins ? Math.max(1, Math.min(480, Number(customMins))) : selectedMins;
  const effectiveLabel = customLabel.trim() || label;
  const activeSession = getFocusSession();

  const handleStart = () => {
    startFocus(effectiveMins * 60 * 1000, effectiveLabel);
  };

  const handleStop = () => {
    stopFocus();
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Timer className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Focus Timer</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Lock in. Block everything. Just you and ONEX.</p>
          </div>
        </div>
      </motion.div>

      {/* ── Active session banner ─────────────────────────────────────────── */}
      {isActive && activeSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-bold text-lg">{activeSession.label}</p>
              <p className="text-muted-foreground text-sm">
                <span className="text-2xl font-mono font-bold text-primary">{formatMs(remaining)}</span> remaining
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleStop} className="border-destructive/40 text-destructive hover:bg-destructive/10">
              End Session
            </Button>
          </div>
        </motion.div>
      )}

      {!isActive && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">

          {/* What this does */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: BellOff,    title: 'Notifications off', desc: 'All badges & alerts silenced' },
                  { icon: ShieldCheck,title: 'App locked',        desc: 'Full-screen focus — no distractions' },
                  { icon: Bell,       title: 'Auto-unlock',       desc: 'Everything restored when done' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duration presets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Duration</CardTitle>
              <CardDescription>Choose a preset or set a custom time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESETS.map(p => {
                  const Icon = p.icon;
                  const active = !customMins && selectedMins === p.mins;
                  return (
                    <button
                      key={p.label}
                      onClick={() => { setSelectedMins(p.mins); setCustomMins(''); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center ${
                        active
                          ? 'border-primary bg-primary/10 text-primary shadow-[0_0_16px_hsl(var(--primary)/0.2)]'
                          : 'border-border bg-card hover:border-primary/40 text-foreground'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold text-sm">{p.label}</span>
                      <span className="text-xs text-muted-foreground">{p.mins}m · {p.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or custom</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex items-center gap-2 max-w-xs">
                <Input
                  type="number"
                  placeholder="e.g. 45"
                  min={1} max={480}
                  value={customMins}
                  onChange={e => setCustomMins(e.target.value)}
                  className="bg-card"
                />
                <span className="text-sm text-muted-foreground shrink-0">minutes</span>
              </div>
            </CardContent>
          </Card>

          {/* Session label */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Session Name</CardTitle>
              <CardDescription>What are you working on?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {SESSION_NAMES.map(n => (
                  <Badge
                    key={n}
                    variant={label === n && !customLabel ? 'default' : 'outline'}
                    className="cursor-pointer select-none text-xs px-3 py-1.5 rounded-full"
                    onClick={() => { setLabel(n); setCustomLabel(''); }}
                  >
                    {n}
                  </Badge>
                ))}
              </div>
              <div className="space-y-1.5 max-w-xs">
                <Label className="text-xs text-muted-foreground">Or type your own</Label>
                <Input
                  placeholder="e.g. Thesis Draft"
                  value={customLabel}
                  onChange={e => setCustomLabel(e.target.value)}
                  className="bg-card"
                />
              </div>
            </CardContent>
          </Card>

          {/* Start button */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full h-14 text-base font-bold rounded-2xl gap-2 shadow-[0_0_24px_hsl(var(--primary)/0.35)] hover:shadow-[0_0_36px_hsl(var(--primary)/0.5)]"
              onClick={handleStart}
            >
              <Play className="w-5 h-5 fill-current" />
              Lock In — {effectiveMins} min · {effectiveLabel}
            </Button>
          </motion.div>

          <p className="text-center text-xs text-muted-foreground">
            Once started, a full-screen overlay will cover your app. You can still use ONEX — but everything else is gone.
          </p>
        </motion.div>
      )}
    </div>
  );
}
