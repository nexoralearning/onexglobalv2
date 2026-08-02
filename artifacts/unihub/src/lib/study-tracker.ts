/**
 * study-tracker.ts — persists completed study sessions to localStorage.
 * Wraps focus-timer to record history after each session ends.
 */

export interface StudySession {
  id: string;
  label: string;
  durationMs: number;
  completedAt: number; // Date.now()
  userId?: string;
  userName?: string;
}

const HISTORY_KEY = 'unihub_study_history';
const MAX_SESSIONS = 200;

export function getStudyHistory(): StudySession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as StudySession[]) : [];
  } catch {
    return [];
  }
}

export function recordSession(session: Omit<StudySession, 'id'>): StudySession {
  const record: StudySession = {
    ...session,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  const history = [record, ...getStudyHistory()].slice(0, MAX_SESSIONS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  window.dispatchEvent(new CustomEvent('unihub_study_updated'));
  return record;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new CustomEvent('unihub_study_updated'));
}

// ── Aggregators ────────────────────────────────────────────────────────────

function startOfDay(d = new Date()): number {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s.getTime();
}

function startOfWeek(d = new Date()): number {
  const s = new Date(d);
  const day = s.getDay(); // 0=Sun
  s.setDate(s.getDate() - day);
  s.setHours(0, 0, 0, 0);
  return s.getTime();
}

export function getTodayMs(history = getStudyHistory()): number {
  const dawn = startOfDay();
  return history
    .filter(s => s.completedAt >= dawn)
    .reduce((acc, s) => acc + s.durationMs, 0);
}

export function getWeekMs(history = getStudyHistory()): number {
  const dawn = startOfWeek();
  return history
    .filter(s => s.completedAt >= dawn)
    .reduce((acc, s) => acc + s.durationMs, 0);
}

export function getTotalMs(history = getStudyHistory()): number {
  return history.reduce((acc, s) => acc + s.durationMs, 0);
}

export function formatStudyTime(ms: number): string {
  const totalMins = Math.floor(ms / 60000);
  if (totalMins < 60) return `${totalMins}m`;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// ── Leaderboard ────────────────────────────────────────────────────────────
// Each student's data is stored locally. When they visit the leaderboard
// their entry is registered and ranked against all entries on this device.
// In a multi-device setup this would sync via the backend.

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarInitials: string;
  university: string;
  degree: string;
  todayMs: number;
  weekMs: number;
  totalMs: number;
  streak: number; // consecutive study days
  isCurrentUser?: boolean;
}

const BOARD_KEY = 'unihub_leaderboard_entries';
const DISABLED_ACCOUNTS_KEY = 'unihub_disabled_accounts';

const DEFAULT_DISABLED_ACCOUNTS = [
  'alex johnson',
  'ballchandgamer',
  'devx ghost',
];

export function getDisabledAccounts(): string[] {
  try {
    const raw = localStorage.getItem(DISABLED_ACCOUNTS_KEY);
    const stored = raw ? (JSON.parse(raw) as string[]) : [];
    const set = new Set([...DEFAULT_DISABLED_ACCOUNTS, ...stored.map(s => s.toLowerCase().trim())]);
    return Array.from(set);
  } catch {
    return DEFAULT_DISABLED_ACCOUNTS;
  }
}

export function isAccountDisabled(name?: string | null): boolean {
  if (!name) return true;
  const lower = name.toLowerCase().trim();
  return getDisabledAccounts().includes(lower);
}

export function disableAccount(name: string): void {
  if (!name) return;
  const lower = name.toLowerCase().trim();
  const list = getDisabledAccounts();
  if (!list.includes(lower)) {
    list.push(lower);
    localStorage.setItem(DISABLED_ACCOUNTS_KEY, JSON.stringify(list));
  }

  // Remove from board entries
  const entries = getBoardEntries();
  Object.keys(entries).forEach(key => {
    if (key.toLowerCase().trim() === lower) {
      delete entries[key];
    }
  });
  localStorage.setItem(BOARD_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent('unihub_study_updated'));
}

export function clearLeaderboard(): void {
  localStorage.setItem(BOARD_KEY, JSON.stringify({}));
  window.dispatchEvent(new CustomEvent('unihub_study_updated'));
}

export interface StoredEntry {
  name: string;
  university: string;
  degree: string;
  todayMs: number;
  weekMs: number;
  totalMs: number;
  streak: number;
  updatedAt: number;
}

function getBoardEntries(): Record<string, StoredEntry> {
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Upsert the current user's real stats into the shared leaderboard store. */
export function registerOnLeaderboard(user: { name: string; university: string; degree: string }): void {
  if (!user || !user.name || isAccountDisabled(user.name)) {
    if (user?.name) {
      const entries = getBoardEntries();
      const lower = user.name.toLowerCase().trim();
      let changed = false;
      Object.keys(entries).forEach(k => {
        if (k.toLowerCase().trim() === lower) {
          delete entries[k];
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(BOARD_KEY, JSON.stringify(entries));
      }
    }
    return;
  }

  const entries = getBoardEntries();
  const todayMs = getTodayMs();
  const weekMs  = getWeekMs();
  const totalMs = getTotalMs();

  // Compute streak: count consecutive days with at least one session
  const history = getStudyHistory();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    const hasSession = history.some(s => s.completedAt >= d.getTime() && s.completedAt < nextDay.getTime());
    if (hasSession) streak++;
    else if (i > 0) break; // gap found — stop counting
  }

  entries[user.name] = { name: user.name, university: user.university, degree: user.degree, todayMs, weekMs, totalMs, streak, updatedAt: Date.now() };
  localStorage.setItem(BOARD_KEY, JSON.stringify(entries));
}

export function getLeaderboard(
  period: 'today' | 'week' | 'total',
  currentUser: { name: string; university: string; degree: string }
): LeaderboardEntry[] {
  // Always refresh the current user's entry before rendering if not disabled
  if (currentUser && !isAccountDisabled(currentUser.name)) {
    registerOnLeaderboard(currentUser);
  }

  const entriesMap = getBoardEntries();
  const disabledList = getDisabledAccounts();
  
  // Clean up any blacklisted/disabled entries from local storage
  let changed = false;
  Object.keys(entriesMap).forEach(key => {
    if (disabledList.includes(key.toLowerCase().trim())) {
      delete entriesMap[key];
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem(BOARD_KEY, JSON.stringify(entriesMap));
  }

  const entries = Object.values(entriesMap).filter(
    entry => entry && entry.name && !disabledList.includes(entry.name.toLowerCase().trim())
  );

  const key: 'todayMs' | 'weekMs' | 'totalMs' =
    period === 'today' ? 'todayMs' : period === 'week' ? 'weekMs' : 'totalMs';

  return entries
    .sort((a, b) => b[key] - a[key])
    .map((entry, i) => ({
      rank: i + 1,
      name: entry.name,
      avatarInitials: entry.name.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2),
      university: entry.university,
      degree: entry.degree,
      todayMs: entry.todayMs,
      weekMs: entry.weekMs,
      totalMs: entry.totalMs,
      streak: entry.streak,
      isCurrentUser: entry.name === currentUser.name,
    }));
}
