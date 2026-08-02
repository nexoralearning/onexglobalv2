import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { initializeMockData, Assignment, Job } from "@/lib/mock-data";
import { getStorage } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  CalendarCheck, Clock, CheckCircle2, AlertCircle, 
  ArrowRight, BookOpen, Briefcase, FileText, Trophy, Flame, TrendingUp 
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getTodayMs,
  getWeekMs,
  formatStudyTime,
  getLeaderboard,
} from "@/lib/study-tracker";
import { ensureUserDoc } from "@/lib/firestore-service";
import { fetchInternships } from "@/lib/jobs";
import { MyFilesSection } from "@/components/dashboard-sections/my-files-section";
import { MyNotesSection } from "@/components/dashboard-sections/my-notes-section";
import { TeamMembersSection } from "@/components/dashboard-sections/team-members-section";

export default function Dashboard() {
  const user = useRequireAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [todayMs, setTodayMs] = useState(0);
  const [weekMs, setWeekMs] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      ensureUserDoc(user.id, user.email, user.name);
      initializeMockData(user.university);
      const allAssignments = getStorage<Assignment[]>('unihub_assignments', []);
      setAssignments(allAssignments);
      setJobs(fetchInternships({ field: user.degree }).slice(0, 2));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const refresh = () => {
      setTodayMs(getTodayMs());
      setWeekMs(getWeekMs());
      const board = getLeaderboard('week', { name: user.name, university: user.university, degree: user.degree });
      const me = board.find(e => e.isCurrentUser);
      setMyRank(me?.rank ?? null);
    };
    refresh();
    window.addEventListener('unihub_study_updated', refresh);
    return () => window.removeEventListener('unihub_study_updated', refresh);
  }, [user]);

  if (!user) return null;

  const pendingCount = assignments.filter(a => a.status === 'Pending').length;
  const completedCount = assignments.filter(a => a.status === 'Completed').length;
  const overdueCount = assignments.filter(a => a.status === 'Overdue').length;

  const upcomingAssignments = [...assignments]
    .filter(a => a.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">
            {user.degree} Student at {user.university} • Year {user.year}
          </p>
        </div>
        <div className="text-sm font-medium px-4 py-2 bg-sidebar rounded-full border">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      {/* Study time strip */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="col-span-2 sm:col-span-1 border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-primary">{formatStudyTime(todayMs) || '0m'}</div>
                <div className="text-xs text-muted-foreground">Studied today</div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted shrink-0">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xl font-bold">{formatStudyTime(weekMs) || '0m'}</div>
                <div className="text-xs text-muted-foreground">This week</div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 sm:col-span-2 border-amber-400/20">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-400/10 shrink-0">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {myRank ? `#${myRank}` : '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">Weekly rank</div>
                </div>
              </div>
              <Link href="/leaderboard">
                <Button variant="outline" size="sm" className="text-xs border-amber-400/30 text-amber-400 hover:bg-amber-400/10">
                  View <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-4">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Assignments */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="col-span-2 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Upcoming Deadlines</h2>
            <Link href="/assignments">
              <span className="text-sm text-primary hover:underline cursor-pointer flex items-center">
                View all <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingAssignments.length > 0 ? upcomingAssignments.map((assignment) => {
              const date = new Date(assignment.dueDate);
              const isOverdue = date < new Date() && assignment.status !== 'Completed';
              
              return (
                <div key={assignment.id} className="flex items-center p-4 border rounded-xl bg-card hover-elevate transition-all">
                  <div className={`p-3 rounded-lg mr-4 ${isOverdue ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{assignment.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{assignment.subject}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-sm font-medium ${isOverdue ? 'text-red-500' : ''}`}>
                      {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <Badge variant={isOverdue ? 'destructive' : assignment.priority === 'High' ? 'default' : 'secondary'} className="mt-1">
                      {isOverdue ? 'Overdue' : assignment.priority}
                    </Badge>
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground bg-sidebar">
                No upcoming deadlines. Great job!
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions & Recommendations */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recommended for you</CardTitle>
              <CardDescription>Based on your {user.degree} studies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="group cursor-pointer">
                  <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">{job.title}</h4>
                  <p className="text-xs text-muted-foreground">{job.company} • {job.location}</p>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/jobs">
                  <Button variant="outline" className="w-full text-xs" size="sm">Browse Internships</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Study Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Discover new tutorials, YouTube lectures, and guides for {user.university} students.
              </p>
              <Link href="/learning">
                <Button className="w-full">Explore Hub</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 3 Firestore Workspace Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8 pt-4"
      >
        <MyFilesSection userId={user.id} />
        <MyNotesSection userId={user.id} />
        <TeamMembersSection userId={user.id} />
      </motion.div>
    </div>
  );
}
