import { useState, useEffect } from "react";
import {
  TeamMember,
  subscribeTeamMembers,
  createTeamMember,
  deleteTeamMember,
} from "@/lib/firestore-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Users, UserPlus, Trash2, Loader2, UserCheck } from "lucide-react";

interface TeamMembersSectionProps {
  userId: string;
}

export function TeamMembersSection({ userId }: TeamMembersSectionProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const unsubscribe = subscribeTeamMembers(
      userId,
      (data) => {
        setMembers(data);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [userId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) {
      setError("Member name is required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await createTeamMember(userId, { name: memberName, role: memberRole });
      setMemberName("");
      setMemberRole("");
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to add member. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteTeamMember(userId, id);
    } catch (err) {
      console.error("Delete team member error:", err);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="border rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Team Members
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            Manage your project collaborators, study group peers, and co-researchers.
          </CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setError("");
            setMemberName("");
            setMemberRole("");
            setIsModalOpen(true);
          }}
          className="gap-1.5 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8 border rounded-xl bg-muted/20">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground bg-muted/10 space-y-2">
            <UserCheck className="w-8 h-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">No team members added yet</p>
            <p className="text-xs text-muted-foreground">Add teammates or study partners to track group roles.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs"
              onClick={() => {
                setError("");
                setMemberName("");
                setMemberRole("");
                setIsModalOpen(true);
              }}
            >
              Add First Member
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="group flex items-center justify-between p-3.5 border rounded-xl bg-card hover:bg-muted/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <Avatar className="h-9 w-9 border bg-primary/10 text-primary font-bold text-xs shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h5 className="text-sm font-semibold truncate">{member.name}</h5>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                        {member.role || "Member"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => handleDeleteMember(member.id)}
                  title="Remove member"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Member Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Register a study group partner or project collaborator.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4 pt-2">
            {error && (
              <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="member-name">Member Name</Label>
              <Input
                id="member-name"
                placeholder="e.g. Sarah Jenkins"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                disabled={saving}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="member-role">Role (Optional)</Label>
              <Input
                id="member-role"
                placeholder="e.g. Lead Researcher, Frontend Developer, Editor"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
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
              <Button type="submit" disabled={saving || !memberName.trim()}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
