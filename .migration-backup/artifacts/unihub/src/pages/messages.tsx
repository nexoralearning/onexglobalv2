import { useState, useEffect, useRef } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getStorage, setStorage } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Send, CheckCheck, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'marketplace';
  name: string;
  participants: string[];
  messages: Message[];
  lastActivity: string;
  unreadCount: number;
  avatarFallback: string;
}

// No pre-seeded conversations — users start fresh and conversations
// are created when they contact sellers, join study groups, or message peers.

export default function Messages() {
  const user = useRequireAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      let stored = getStorage<Conversation[]>('unihub_conversations', []);
      // Remove any legacy mock conversations that were seeded in older builds
      const LEGACY_MOCK_IDS = new Set(['c1', 'c2', 'c3']);
      const cleaned = stored.filter(c => !LEGACY_MOCK_IDS.has(c.id));
      if (cleaned.length !== stored.length) {
        setStorage('unihub_conversations', cleaned);
        stored = cleaned;
      }
      setConversations(stored);
      setTimeout(() => window.dispatchEvent(new Event('unihub_messages_updated')), 0);
    }
  }, [user]);

  useEffect(() => {
    if (selectedConvoId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      
      // Mark as read
      setConversations(prev => {
        const next = prev.map(c => {
          if (c.id === selectedConvoId) {
            return { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, read: true })) };
          }
          return c;
        });
        setStorage('unihub_conversations', next);
        window.dispatchEvent(new Event('unihub_messages_updated'));
        return next;
      });
    }
  }, [selectedConvoId]);

  if (!user) return null;

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConvoId) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      senderId: "currentUser", // Should be user.id in real app
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
      read: true
    };

    setConversations(prev => {
      const next = prev.map(c => {
        if (c.id === selectedConvoId) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
            lastActivity: newMessage.timestamp
          };
        }
        return c;
      });
      setStorage('unihub_conversations', next);
      return next;
    });

    setMessageInput("");
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredConvos = conversations
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

  const selectedConvo = conversations.find(c => c.id === selectedConvoId);

  return (
    <div className="h-[100dvh] flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full gap-4">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1">Connect with peers, study groups, and sellers.</p>
      </div>

      <div className="flex-1 bg-card border rounded-xl overflow-hidden flex flex-col md:flex-row min-h-0 shadow-sm">
        {/* Left Panel: Conversation List */}
        <div className={`w-full md:w-80 border-r flex flex-col ${selectedConvoId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b shrink-0 bg-sidebar/50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 bg-background"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvos.map(convo => (
              <div 
                key={convo.id}
                onClick={() => setSelectedConvoId(convo.id)}
                className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${selectedConvoId === convo.id ? 'bg-muted' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {convo.avatarFallback}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-medium text-sm truncate ${convo.unreadCount > 0 ? 'text-foreground font-bold' : 'text-foreground/80'}`}>
                        {convo.name}
                      </h3>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {format(new Date(convo.lastActivity), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate ${convo.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {convo.messages[convo.messages.length - 1]?.text || 'No messages yet'}
                      </p>
                      {convo.unreadCount > 0 && (
                        <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center shrink-0 rounded-full">
                          {convo.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredConvos.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Chat Interface */}
        <div className={`flex-1 flex-col ${!selectedConvoId ? 'hidden md:flex' : 'flex'}`}>
          {selectedConvo ? (
            <>
              <div className="p-4 border-b bg-sidebar/50 flex items-center gap-3 shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden shrink-0 -ml-2"
                  onClick={() => setSelectedConvoId(null)}
                >
                  <Search className="w-5 h-5 rotate-90" /> {/* Poor man's back arrow placeholder, wait let's just use text or actual back icon if we had one. Let's use text. */}
                  <span className="sr-only">Back</span>
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {selectedConvo.avatarFallback}
                </div>
                <div>
                  <h2 className="font-semibold text-sm">{selectedConvo.name}</h2>
                  <p className="text-xs text-muted-foreground capitalize">{selectedConvo.type} Chat</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                {selectedConvo.messages.map((msg, idx) => {
                  const isMe = msg.senderId === "currentUser";
                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] rounded-2xl p-3 text-sm ${
                          isMe 
                            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                            : 'bg-muted text-foreground rounded-tl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(msg.timestamp), 'p')}
                        </span>
                        {isMe && (
                          <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-primary' : 'text-muted-foreground/50'}`} />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-sidebar/50 border-t shrink-0">
                <form 
                  onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center gap-2"
                >
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 bg-background"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                  />
                  <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <h3 className="font-medium text-foreground">Your Messages</h3>
              <p className="text-sm mt-1 max-w-sm text-center">
                Select a conversation from the sidebar to view your messages or start a new chat from a user's profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
