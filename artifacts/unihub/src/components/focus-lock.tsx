/**
 * focus-lock.tsx
 * Global focus-lock overlay. Mount this once inside App (outside the router).
 * When a focus session is active it renders a fullscreen lockscreen that:
 *  - Shows the countdown prominently
 *  - Blocks all other app UI (only the timer is visible)
 *  - Warns on tab-switch / browser close
 *  - Requires deliberate confirmation to end early
 */
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getFocusSession, getFocusRemaining, stopFocus, formatMs, isFocusActive,
  FocusSession,
} from '@/lib/focus-timer';

export function FocusLock() {
  const [session, setSession] = useState<FocusSession | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  // ── Sync state from storage ───────────────────────────────────────────────
  const sync = useCallback(() => {
    if (isFocusActive()) {
      setSession(getFocusSession());
      setRemaining(getFocusRemaining());
      setDone(false);
    } else {
      const hadSession = !!getFocusSession();
      if (hadSession) {
        // Natural completion — record session to history
        setDone(true);
        stopFocus(true);
        setTimeout(() => setDone(false), 4000);
      }
      setSession(null);
      setRemaining(0);
    }
  }, []);

  useEffect(() => {
    sync();
    const interval = setInterval(sync, 500);
    window.addEventListener('unihub_focus_changed', sync);
    return () => {
      clearInterval(interval);
      window.removeEventListener('unihub_focus_changed', sync);
    };
  }, [sync]);

  // ── Warn on tab switch or close ───────────────────────────────────────────
  useEffect(() => {
    if (!session) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Your focus session is still running! Are you sure you want to leave?';
    };
    const onVisibility = () => {
      if (document.hidden) {
        // Flash the title bar as a nudge
        document.title = '⚠️ Focus Mode Active – come back!';
        setTimeout(() => { document.title = 'ONEX | Focus Mode'; }, 3000);
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('visibilitychange', onVisibility);
    document.title = 'ONEX | Focus Mode';
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('visibilitychange', onVisibility);
      document.title = 'ONEX';
    };
  }, [session]);

  const progress = session
    ? 1 - remaining / session.durationMs
    : 0;

  const circumference = 2 * Math.PI * 110; // r=110

  const handleEndEarly = () => {
    stopFocus();
    setShowConfirm(false);
  };

  return (
    <>
      {/* ── Completion flash ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-xl"
          >
            <div className="text-center space-y-4 p-10">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Session Complete 🎉</h1>
              <p className="text-muted-foreground text-lg">You locked in. Great work.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active lock screen ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {session && (
          <motion.div
            key="focus-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9000] flex flex-col items-center justify-center bg-background"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
              {/* Label */}
              <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-[0.2em]">
                <Timer className="w-4 h-4" />
                {session.label}
              </div>

              {/* Circular countdown */}
              <div className="relative w-64 h-64">
                {/* Track */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
                  <circle
                    cx="120" cy="120" r="110"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="6"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="120" cy="120" r="110"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    style={{
                      filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.7))',
                      transition: 'stroke-dashoffset 0.5s ease',
                    }}
                  />
                </svg>
                {/* Time display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold tabular-nums tracking-tight">
                    {formatMs(remaining)}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">remaining</span>
                </div>
              </div>

              {/* Message */}
              <p className="text-muted-foreground text-sm max-w-xs">
                You're locked in. Notifications silenced. Stay focused — ONEX is right here when you need it.
              </p>

              {/* End early */}
              {!showConfirm ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setShowConfirm(true)}
                >
                  <X className="w-3.5 h-3.5 mr-1.5" /> End Session Early
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-destructive/30 bg-destructive/5"
                >
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <p className="text-sm font-medium">End session early?</p>
                  <p className="text-xs text-muted-foreground">Your progress won't be saved.</p>
                  <div className="flex gap-3">
                    <Button size="sm" variant="destructive" onClick={handleEndEarly}>Yes, end it</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)}>Keep going</Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
