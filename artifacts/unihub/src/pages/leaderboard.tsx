/**
 * leaderboard.tsx — Study time leaderboard with period filters.
 */
import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Flame, TrendingUp, Clock, Star, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getLeaderboard,
  LeaderboardEntry,
  formatStudyTime,
  getTodayMs,
  getWeekMs,
  getTotalMs,
  disableAccount,
  clearLeaderboard,
} from '@/lib/study-tracker';

type Period = 'today' | 'week' | 'total';

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week:  "This Week",
  total: "All Time",
};

const RANK_COLORS = ['text-amber-400', 'text-slate-300', 'text-amber-600'];
const RANK_ICONS  = [Trophy, Medal, Star];

function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-muted-foreground">
        {rank}
      </span>
    );
  }
  const Icon = RANK_ICONS[rank - 1];
  return (
    <span className={`w-8 h-8 flex items-center justify-center ${RANK_COLORS[rank - 1]}`}>
      <Icon className="w-5 h-5" />
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-1 w-full bg-border rounded-full overflow-hidden mt-1">
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function Leaderboard() {
  const user = useRequireAuth();
  const [period, setPeriod] = useState<Period>('week');
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    const refresh = () => {
      setBoard(getLeaderboard(period, { name: user.name, university: user.university, degree: user.degree }));
    };
    refresh();
    window.addEventListener('unihub_study_updated', refresh);
    return () => window.removeEventListener('unihub_study_updated', refresh);
  }, [period, user]);

  if (!user) return null;

  const isDev = user.email?.toLowerCase() === 'onexglobalmain@gmail.com' || user.name.toLowerCase().includes('dev');
  const myEntry = board.find(e => e.isCurrentUser);
  const topValue = board[0]?.[period === 'today' ? 'todayMs' : period === 'week' ? 'weekMs' : 'totalMs'] ?? 1;

  const myMs = period === 'today' ? getTodayMs() : period === 'week' ? getWeekMs() : getTotalMs();

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Leaderboard</h1>
            <p className="text-muted-foreground text-sm mt-0.5">See how your study time compares with peers.</p>
          </div>
        </div>

        {isDev && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => {
                if (confirm("Reset/Clear leaderboard?")) {
                  clearLeaderboard();
                  setBoard(getLeaderboard(period, { name: user.name, university: user.university, degree: user.degree }));
                }
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear Board
            </Button>
          </div>
        )}
      </motion.div>

      {/* Your stats strip */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-3 gap-3">
          {([
            { label: 'Today',     ms: getTodayMs(),  icon: Clock },
            { label: 'This Week', ms: getWeekMs(),   icon: TrendingUp },
            { label: 'All Time',  ms: getTotalMs(),  icon: Flame },
          ] as const).map(({ label, ms, icon: Icon }) => (
            <Card key={label} className="text-center">
              <CardContent className="p-4">
                <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">{formatStudyTime(ms)}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Period filter */}
      <Tabs value={period} onValueChange={v => setPeriod(v as Period)}>
        <TabsList className="w-full">
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <TabsTrigger key={p} value={p} className="flex-1">{PERIOD_LABELS[p]}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Leaderboard */}
      <div className="space-y-2">
        <AnimatePresence mode="wait">
          {board.map((entry, i) => {
            const entryMs = period === 'today' ? entry.todayMs : period === 'week' ? entry.weekMs : entry.totalMs;
            return (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    entry.isCurrentUser
                      ? 'border-primary/40 bg-primary/5 shadow-[0_0_16px_hsl(var(--primary)/0.1)]'
                      : 'border-border bg-card hover:border-border/60'
                  }`}
                >
                  {/* Rank */}
                  <RankBadge rank={entry.rank} />

                  {/* Avatar */}
                  <Avatar className="w-9 h-9 border border-border/50 shrink-0">
                    <AvatarFallback className={`text-xs font-bold ${entry.isCurrentUser ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                      {entry.avatarInitials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold truncate ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                        {entry.name}
                        {entry.isCurrentUser && <span className="ml-1 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">You</span>}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{entry.university} · {entry.degree}</div>
                    <ProgressBar value={entryMs} max={topValue} />
                  </div>

                  {/* Time + streak */}
                  <div className="text-right shrink-0">
                    <div className={`text-base font-bold tabular-nums ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                      {formatStudyTime(entryMs)}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span className="text-xs text-muted-foreground">{entry.streak}d streak</span>
                    </div>
                  </div>

                  {isDev && !entry.isCurrentUser && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      title={`Remove ${entry.name}`}
                      onClick={() => {
                        if (confirm(`Remove ${entry.name} from the leaderboard and disable account?`)) {
                          disableAccount(entry.name);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Your rank summary */}
      {myEntry && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  You're ranked <span className="text-primary">#{myEntry.rank}</span> out of {board.length} students
                  {period !== 'total' && ` ${PERIOD_LABELS[period].toLowerCase()}`}.
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {myMs === 0
                    ? 'Start a Focus Timer session to get on the board!'
                    : `Keep studying to climb higher — you've logged ${formatStudyTime(myMs)} ${PERIOD_LABELS[period].toLowerCase()}.`}
                </p>
              </div>
              {myEntry.rank <= 3 && (
                <Badge className="shrink-0 bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  Top 3! 🏆
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
