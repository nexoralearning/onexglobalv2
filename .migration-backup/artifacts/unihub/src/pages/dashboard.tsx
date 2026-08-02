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
  ArrowRight, BookOpen, Briefcase, FileText 
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const user = useRequireAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (user) {
      initializeMockData(user.university);
      const allAssignments = getStorage<Assignment[]>('unihub_assignments', []);
      setAssignments(allAssignments);
      
      // Load some jobs for recommendations
      import("@/lib/jobs").then(({ fetchInternships }) => {
        setJobs(fetchInternships({ field: user.degree }).slice(0, 2));
      });
    }
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
    </div>
  );
}
