import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Assignment } from "@/lib/mock-data";
import { getStorage, setStorage } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon, CheckCircle2, Circle, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Assignments() {
  const user = useRequireAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState("All");

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Assignment['priority']>("Medium");

  useEffect(() => {
    if (user) {
      let stored = getStorage<Assignment[]>('unihub_assignments', []);
      // Auto-mark overdue
      let changed = false;
      const now = new Date();
      stored = stored.map(a => {
        if (a.status === 'Pending' && new Date(a.dueDate) < now) {
          changed = true;
          return { ...a, status: 'Overdue' };
        }
        return a;
      });
      if (changed) setStorage('unihub_assignments', stored);
      setAssignments(stored);
    }
  }, [user]);

  if (!user) return null;

  const saveAssignments = (data: Assignment[]) => {
    setAssignments(data);
    setStorage('unihub_assignments', data);
  };

  const handleSave = () => {
    if (!title || !dueDate) return;

    if (editingId) {
      saveAssignments(assignments.map(a => 
        a.id === editingId ? { ...a, title, subject, dueDate, description, priority } : a
      ));
    } else {
      const newAssign: Assignment = {
        id: Math.random().toString(36).substring(7),
        title,
        subject: subject || "General",
        university: user.university,
        dueDate: new Date(dueDate).toISOString(),
        description,
        status: new Date(dueDate) < new Date() ? 'Overdue' : 'Pending',
        priority,
        createdAt: new Date().toISOString(),
      };
      saveAssignments([...assignments, newAssign]);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSubject("");
    setDueDate("");
    setDescription("");
    setPriority("Medium");
  };

  const openEdit = (a: Assignment) => {
    setEditingId(a.id);
    setTitle(a.title);
    setSubject(a.subject);
    setDueDate(new Date(a.dueDate).toISOString().slice(0,16)); // simple yyyy-mm-ddThh:mm
    setDescription(a.description);
    setPriority(a.priority);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    saveAssignments(assignments.filter(a => a.id !== id));
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    let updated = assignments.map(a => 
      a.id === id ? { ...a, status: newStatus as Assignment['status'] } : a
    );
    // Re-check overdue
    const now = new Date();
    updated = updated.map(a => {
      if (a.status === 'Pending' && new Date(a.dueDate) < now) return { ...a, status: 'Overdue' };
      return a;
    });
    saveAssignments(updated);
  };

  const filtered = assignments.filter(a => activeTab === "All" || a.status === activeTab)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const progress = assignments.length > 0 
    ? Math.round((assignments.filter(a => a.status === 'Completed').length / assignments.length) * 100) 
    : 0;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground mt-2">
            Track deadlines, projects, and homework tasks.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1 items-end mr-4">
            <div className="text-sm font-medium">Progress ({progress}%)</div>
            <div className="w-32 h-2 bg-sidebar rounded-full overflow-hidden border">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={open => { setIsDialogOpen(open); if(!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Task" : "New Task"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Final Project Report" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="CS 401" />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={priority} onChange={e => setPriority(e.target.value as Assignment['priority'])}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Due Date & Time</Label>
                  <Input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Notes, rubrics, links..." />
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave}>{editingId ? "Save Changes" : "Create Task"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-sidebar">
          <TabsTrigger value="All">All Tasks</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Completed">Completed</TabsTrigger>
          <TabsTrigger value="Overdue">Overdue</TabsTrigger>
        </TabsList>

        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(assignment => {
              const isOverdue = assignment.status === 'Overdue';
              const isCompleted = assignment.status === 'Completed';
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                >
                  <Card className={`group transition-all ${isCompleted ? 'opacity-60 bg-sidebar/50' : 'bg-card hover-elevate'}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <button 
                        onClick={() => toggleStatus(assignment.id, assignment.status)}
                        className={`shrink-0 transition-colors ${isCompleted ? 'text-green-500' : isOverdue ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isOverdue ? <AlertCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold truncate ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {assignment.title}
                          </h3>
                          {assignment.priority === 'High' && !isCompleted && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase font-bold">High Priority</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium px-2 py-0.5 bg-sidebar rounded border">{assignment.subject}</span>
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(assignment.dueDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(assignment)}>
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(assignment.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed rounded-xl bg-sidebar text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">No tasks found</p>
              <p>You're all caught up for now!</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
