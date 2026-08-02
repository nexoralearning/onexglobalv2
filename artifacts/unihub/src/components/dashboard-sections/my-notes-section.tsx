import { useState, useEffect } from "react";
import {
  Note,
  subscribeNotes,
  createNote,
  deleteNote,
} from "@/lib/firestore-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { NotebookPen, Plus, Trash2, Loader2, StickyNote } from "lucide-react";

interface MyNotesSectionProps {
  userId: string;
}

export function MyNotesSection({ userId }: MyNotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const unsubscribe = subscribeNotes(
      userId,
      (data) => {
        setNotes(data);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [userId]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Note title is required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await createNote(userId, { title, content });
      setTitle("");
      setContent("");
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(userId, id);
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  return (
    <Card className="border rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5 text-amber-500" />
            My Notes
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            Quickly capture study ideas, meeting summaries, and research points.
          </CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setError("");
            setTitle("");
            setContent("");
            setIsModalOpen(true);
          }}
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8 border rounded-xl bg-muted/20">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length === 0 ? (
          <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground bg-muted/10 space-y-2">
            <StickyNote className="w-8 h-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">No notes written yet</p>
            <p className="text-xs text-muted-foreground">Keep your thoughts organized by creating your first note.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs"
              onClick={() => {
                setError("");
                setTitle("");
                setContent("");
                setIsModalOpen(true);
              }}
            >
              Create Note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative flex flex-col justify-between p-4 border rounded-xl bg-card hover:shadow-md transition-all space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-semibold text-base leading-snug line-clamp-1">{note.title}</h5>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => handleDeleteNote(note.id)}
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {note.content ? (
                    <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  ) : (
                    <p className="text-xs italic text-muted-foreground/60">No content</p>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground/80 font-medium pt-2 border-t border-border/50">
                  {new Date(note.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* New Note Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Add a quick note or detailed breakdown to your personal dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateNote} className="space-y-4 pt-2">
            {error && (
              <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                placeholder="e.g. Machine Learning Key Concepts"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-content">Content (Optional)</Label>
              <Textarea
                id="note-content"
                placeholder="Write your study notes, reminders, or code snippets here..."
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={saving}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !title.trim()}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Note"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
