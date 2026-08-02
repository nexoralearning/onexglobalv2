/**
 * focus-timer.ts — persistence layer for the Focus Lock session.
 * Uses localStorage so the timer survives page refreshes.
 */

import { recordSession } from './study-tracker';

const KEY = 'unihub_focus_session';

export interface FocusSession {
  startedAt: number;   // Date.now() when the session began
  durationMs: number;  // total duration in ms
  label: string;       // e.g. "Deep Work", "Revision"
}

export function startFocus(durationMs: number, label = 'Focus Session'): void {
  const session: FocusSession = { startedAt: Date.now(), durationMs, label };
  localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('unihub_focus_changed'));
}

export function stopFocus(completed = false): void {
  if (completed) {
    // Record the session to study history before clearing
    const session = getFocusSession();
    if (session) {
      const elapsed = Date.now() - session.startedAt;
      const actualMs = Math.min(elapsed, session.durationMs);
      if (actualMs > 60000) { // only record if at least 1 min
        recordSession({
          label: session.label,
          durationMs: actualMs,
          completedAt: Date.now(),
        });
      }
    }
  }
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent('unihub_focus_changed'));
}

export function getFocusSession(): FocusSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FocusSession) : null;
  } catch {
    return null;
  }
}

/** Returns milliseconds remaining. 0 means expired. */
export function getFocusRemaining(): number {
  const s = getFocusSession();
  if (!s) return 0;
  const elapsed = Date.now() - s.startedAt;
  return Math.max(0, s.durationMs - elapsed);
}

export function isFocusActive(): boolean {
  const remaining = getFocusRemaining();
  if (remaining === 0 && getFocusSession()) {
    // Auto-clean expired session
    stopFocus();
    return false;
  }
  return remaining > 0;
}

export function formatMs(ms: number): string {
  const totalSecs = Math.ceil(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
