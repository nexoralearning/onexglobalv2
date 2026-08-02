import { useState, useEffect, useRef } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { StudyGroup, GroupMessage } from "@/lib/mock-data";
import { getStorage, setStorage } from "@/lib/storage";
import { pickImage, moderateImage } from "@/lib/image-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, MessagesSquare, Hash, Activity, Send, Plus, Search, Camera, ImageIcon, X, AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function StudyGroups() {
  const user = useRequireAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [activeTab, setActiveTab] = useState("subject");
  const [search, setSearch] = useState("");

  // Create Group
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<StudyGroup['type']>("Subject");
  const [newSubject, setNewSubject] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Chat
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const stored = getStorage<StudyGroup[]>('unihub_study_groups', []);
      setGroups(stored);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedGroup?.messages?.length]);

  if (!user) return null;

  const saveGroups = (updated: StudyGroup[]) => {
    setGroups(updated);
    setStorage('unihub_study_groups', updated);
  };

  const handleCreateGroup = () => {
    if (!newName.trim() || !newSubject.trim()) return;
    const group: StudyGroup = {
      id: `g_${Math.random().toString(36).substr(2, 9)}`,
      name: newName,
      subject: newSubject,
      university: user.university,
      degree: newType === 'Degree' ? newSubject : undefined,
      memberCount: 1,
      activityStatus: 'Active',
      description: newDesc || 'A new study group.',
      tags: [newSubject.split(' ')[0], newType],
      type: newType,
      joined: true,
      createdBy: user.name,
      messages: [],
    };
    saveGroups([group, ...groups]);
    setIsCreateOpen(false);
    setNewName(""); setNewSubject(""); setNewDesc(""); setNewType("Subject");
  };

  const toggleJoin = (groupId: string) => {
    saveGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, joined: !g.joined, memberCount: g.memberCount + (g.joined ? -1 : 1) }
        : g
    ));
  };

  const pickChatImage = async (capture = false) => {
    setSendError(null);
    setImgLoading(true);
    try {
      const dataUrl = await pickImage(capture);
      if (!dataUrl) return;
      const result = await moderateImage(dataUrl);
      if (!result.safe) {
        setSendError(`Image blocked: ${result.reason ?? 'inappropriate content'}`);
        return;
      }
      setPendingImage(dataUrl);
    } finally {
      setImgLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!chatInput.trim() && !pendingImage) || !selectedGroup) return;
    setSendError(null);
    setSending(true);

    try {
      const newMsg: GroupMessage = {
        sender: user.name,
        text: chatInput.trim(),
        time: new Date().toISOString(),
        ...(pendingImage ? { image: pendingImage } : {}),
      };

      const updatedGroups = groups.map(g => {
        if (g.id !== selectedGroup.id) return g;
        return { ...g, messages: [...(g.messages ?? []), newMsg] };
      });

      saveGroups(updatedGroups);
      setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id) ?? null);
      setChatInput("");
      setPendingImage(null);
    } finally {
      setSending(false);
    }
  };

  const filteredGroups = groups.filter(g => {
    const matchesTab = g.type.toLowerCase() === activeTab;
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.subject.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'Very Active': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Active':      return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:            return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={lightbox} alt="Shared image"
              className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20" onClick={() => setLightbox(null)}>
              <X className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Groups</h1>
          <p className="text-muted-foreground mt-2">
            Connect with peers, share knowledge, and study together.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm"><Plus className="w-4 h-4 mr-2" />Create Group</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>Create a Study Group</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Group Name</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Intro to Logic Prep" />
              </div>
              <div className="space-y-2">
                <Label>Group Type</Label>
                <Select value={newType} onChange={e => setNewType(e.target.value as any)}>
                  <option value="Subject">Specific Subject / Module</option>
                  <option value="Degree">Entire Degree Program</option>
                  <option value="University">University Wide</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{newType === 'Degree' ? 'Degree Name' : 'Subject / Topic'}</Label>
                <Input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="e.g. Computer Science" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What is this group for?" />
              </div>
              <Button className="w-full" onClick={handleCreateGroup}>Create Group</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups by name or subject..."
            className="pl-9 bg-card"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-sidebar">
            <TabsTrigger value="subject" className="px-6">Subject Groups</TabsTrigger>
            <TabsTrigger value="degree" className="px-6">Degree Groups</TabsTrigger>
            <TabsTrigger value="university" className="px-6">University Groups</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {filteredGroups.map((group, idx) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: Math.min(idx * 0.05, 0.3) }}
            >
              <Card className="hover-elevate flex flex-col group border-border h-full bg-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary/10" />
                <CardContent className="p-6 flex-1 flex flex-col pt-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={getActivityColor(group.activityStatus)}>
                      <Activity className="w-3 h-3 mr-1" />{group.activityStatus}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors leading-tight">{group.name}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3 font-medium">
                    <span className="flex items-center text-foreground/80">
                      <Users className="w-3.5 h-3.5 mr-1" />{group.memberCount.toLocaleString()} members
                    </span>
                    <span className="mx-1 opacity-30">•</span>
                    <span className="truncate">{group.university}</span>
                  </div>

                  <p className="text-sm mb-6 flex-1 text-foreground/80 leading-relaxed line-clamp-3">{group.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {group.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-sidebar border border-border/50 font-medium">
                        <Hash className="w-3 h-3 mr-0.5 opacity-40" />{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
                    <Button
                      variant={group.joined ? "outline" : "default"}
                      className={`flex-1 ${group.joined ? 'bg-sidebar/50 border-border/80' : 'shadow-sm'}`}
                      onClick={() => toggleJoin(group.id)}
                    >
                      {group.joined ? "Leave Group" : "Join Group"}
                    </Button>
                    {group.joined && (
                      <Button variant="secondary" className="px-4 shadow-sm" onClick={() => { setSelectedGroup(group); setSendError(null); }}>
                        <MessagesSquare className="w-4 h-4 mr-2" /> Chat
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed rounded-xl bg-sidebar/30 border-border/60">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="font-semibold text-xl">No groups found</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Try a different search or create the first group for this category!</p>
          <Button variant="outline" className="mt-6" onClick={() => setIsCreateOpen(true)}>Create New Group</Button>
        </div>
      )}

      {/* Chat Dialog */}
      <Dialog open={!!selectedGroup} onOpenChange={open => { if (!open) { setSelectedGroup(null); setPendingImage(null); setSendError(null); } }}>
        <DialogContent className="sm:max-w-[600px] h-[700px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
          {selectedGroup && (
            <>
              <DialogHeader className="p-4 border-b border-border bg-sidebar/80 m-0 shrink-0 shadow-sm z-10">
                <div className="flex justify-between items-start mr-6">
                  <div>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                      <MessagesSquare className="w-5 h-5 text-primary" />
                      {selectedGroup.name}
                    </DialogTitle>
                    <div className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-2">
                      <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {selectedGroup.memberCount} members</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className={getActivityColor(selectedGroup.activityStatus).split(' ')[0]}>{selectedGroup.activityStatus}</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-card/30 space-y-4 relative">
                {(selectedGroup.messages ?? []).length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground px-8">
                    <MessagesSquare className="w-10 h-10 opacity-20 mb-3" />
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                )}
                {(selectedGroup.messages ?? []).map((msg, idx) => {
                  const isMe = msg.sender === user.name;
                  return (
                    <div key={idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isMe ? 'bg-primary/20 text-primary' : 'bg-green-500/20 text-green-500'}`}>
                        {msg.sender.substring(0, 2).toUpperCase()}
                      </div>
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <span className="font-semibold text-xs text-foreground/80">{isMe ? 'You' : msg.sender}</span>
                          <span className="text-[10px] text-muted-foreground">{format(new Date(msg.time), 'p')}</span>
                        </div>

                        {/* Flagged banner */}
                        {msg.flagged && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 mb-1">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            Flagged: {msg.flagReason}
                          </div>
                        )}

                        {/* Image */}
                        {msg.image && !msg.flagged && (
                          <img
                            src={msg.image}
                            alt="Shared"
                            className="rounded-xl max-w-[240px] max-h-[200px] object-cover cursor-pointer hover:opacity-90 transition-opacity mb-1 border border-border shadow-sm"
                            onClick={() => setLightbox(msg.image!)}
                          />
                        )}

                        {/* Text bubble */}
                        {msg.text && (
                          <div className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-tr-sm'
                              : 'bg-sidebar border rounded-tl-sm text-foreground/90'
                          }`}>
                            {msg.text}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-border bg-sidebar/50 shrink-0 space-y-2">
                {/* Pending image preview */}
                {pendingImage && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border shadow-sm">
                    <img src={pendingImage} alt="Pending" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPendingImage(null)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Error */}
                {sendError && (
                  <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {sendError}
                  </div>
                )}

                <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                  {/* Camera */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => pickChatImage(true)}
                    disabled={imgLoading}
                    title="Take photo"
                  >
                    {imgLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5" />}
                  </Button>

                  {/* Upload */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => pickChatImage(false)}
                    disabled={imgLoading}
                    title="Upload image"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>

                  <Input
                    placeholder="Type a message…"
                    className="flex-1 bg-background h-11"
                    value={chatInput}
                    onChange={e => { setChatInput(e.target.value); setSendError(null); }}
                  />

                  <Button
                    type="submit"
                    size="icon"
                    disabled={(!chatInput.trim() && !pendingImage) || sending}
                    className="h-11 w-11 shrink-0 rounded-xl shadow-sm"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
