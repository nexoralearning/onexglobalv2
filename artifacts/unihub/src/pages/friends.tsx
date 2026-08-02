import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getStorage, setStorage } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  UserPlus, UserCheck, UserX, Users, Search,
  GraduationCap, MapPin, MessageSquare, UserMinus, AtSign, Mail, CheckCircle, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
interface StudentProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  university: string;
  country: string;
  degree: string;
  year: string;
  bio: string;
  initials: string;
  avatarColor: string;
}

interface FriendRequest {
  profileId: string;
  sentAt: string;
}

// ── Discovery pool — fellow students from around the world ────────────────────
const DEFAULT_STUDENT_POOL: StudentProfile[] = [
  { id: 's1',  name: 'Aisha Ramjuttun',   username: 'aisha_r',   email: 'aisha@uom.ac.mu',          university: 'University of Mauritius',       country: 'Mauritius',     degree: 'Computer Science',          year: 'Year 2', bio: 'Passionate about AI and mobile apps. Looking for project collaborators.',           initials: 'AR', avatarColor: 'bg-violet-500/20 text-violet-500' },
  { id: 's2',  name: 'Ethan Clarke',       username: 'ethan_c',   email: 'ethan@ed.ac.uk',           university: 'University of Edinburgh',       country: 'UK',            degree: 'Mathematics',               year: 'Year 3', bio: 'Into number theory and competitive maths. Happy to help with calculus problems.',    initials: 'EC', avatarColor: 'bg-blue-500/20 text-blue-500' },
  { id: 's3',  name: 'Priya Nair',         username: 'priya_n',   email: 'priya@iitb.ac.in',         university: 'IIT Bombay',                   country: 'India',         degree: 'Electrical Engineering',     year: 'Year 4', bio: 'Final-year EE student. Interested in renewable energy and signal processing.',      initials: 'PN', avatarColor: 'bg-pink-500/20 text-pink-500' },
  { id: 's4',  name: 'Lucas Ferreira',     username: 'lucas_f',   email: 'lucas@usp.br',             university: 'Universidade de São Paulo',    country: 'Brazil',        degree: 'Economics',                  year: 'Year 2', bio: 'Economics student with a love for data visualisation and public policy.',           initials: 'LF', avatarColor: 'bg-amber-500/20 text-amber-500' },
  { id: 's5',  name: 'Amara Diallo',       username: 'amara_d',   email: 'amara@ug.edu.gh',          university: 'University of Ghana',          country: 'Ghana',         degree: 'Law',                        year: 'Year 3', bio: 'Aspiring human rights lawyer. Interested in international law and advocacy.',       initials: 'AD', avatarColor: 'bg-emerald-500/20 text-emerald-500' },
  { id: 's6',  name: 'Yuki Tanaka',        username: 'yuki_t',    email: 'yuki@u-tokyo.ac.jp',       university: 'University of Tokyo',          country: 'Japan',         degree: 'Computer Science',          year: 'Year 1', bio: 'First-year CS student interested in game development and machine learning.',        initials: 'YT', avatarColor: 'bg-cyan-500/20 text-cyan-500' },
  { id: 's7',  name: 'Sofía Martínez',     username: 'sofia_m',   email: 'sofia@uam.es',             university: 'Universidad Autónoma de Madrid', country: 'Spain',       degree: 'Psychology',                year: 'Year 3', bio: 'Cognitive psych enthusiast. Looking for study partners for research methods.',     initials: 'SM', avatarColor: 'bg-rose-500/20 text-rose-500' },
  { id: 's8',  name: 'Kwame Asante',       username: 'kwame_a',   email: 'kwame@uct.ac.za',          university: 'University of Cape Town',      country: 'South Africa',  degree: 'Business Administration',   year: 'Year 2', bio: 'Entrepreneur at heart. Building a student startup on the side.',                   initials: 'KA', avatarColor: 'bg-orange-500/20 text-orange-500' },
  { id: 's9',  name: 'Ingrid Lindström',   username: 'ingrid_l',  email: 'ingrid@su.se',             university: 'Stockholm University',         country: 'Sweden',        degree: 'Environmental Science',     year: 'Year 4', bio: 'Climate advocate. Writing thesis on Nordic sustainable energy policy.',           initials: 'IL', avatarColor: 'bg-teal-500/20 text-teal-500' },
  { id: 's10', name: 'Mohammed Al-Rashid', username: 'mohammed_a', email: 'mohammed@aud.ac.ae',       university: 'American University of Dubai', country: 'UAE',           degree: 'Finance',                   year: 'Year 3', bio: 'Finance student focusing on Islamic banking and FinTech innovation.',              initials: 'MA', avatarColor: 'bg-indigo-500/20 text-indigo-500' },
  { id: 's11', name: 'Chioma Obi',         username: 'chioma_o',  email: 'chioma@unilag.edu.ng',     university: 'University of Lagos',          country: 'Nigeria',       degree: 'Medicine',                  year: 'Year 5', bio: 'Medical student passionate about public health in Sub-Saharan Africa.',           initials: 'CO', avatarColor: 'bg-fuchsia-500/20 text-fuchsia-500' },
  { id: 's12', name: 'Daniel Park',        username: 'daniel_p',  email: 'daniel@snu.ac.kr',         university: 'Seoul National University',    country: 'South Korea',   degree: 'Computer Engineering',      year: 'Year 2', bio: 'Into embedded systems and IoT. Love debugging hardware.',                         initials: 'DP', avatarColor: 'bg-sky-500/20 text-sky-500' },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function Friends() {
  const user = useRequireAuth();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("friends");

  const [addInput, setAddInput] = useState("");
  const [addFeedback, setAddFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [customStudents, setCustomStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    if (!user) return;
    setFriendIds(new Set(getStorage<string[]>("unihub_friend_ids", [])));
    setSentIds(new Set(getStorage<string[]>("unihub_friend_requests_sent", [])));
    setReceivedRequests(getStorage<FriendRequest[]>("unihub_friend_requests_received", []));
    setCustomStudents(getStorage<StudentProfile[]>("unihub_custom_friends", []));
  }, [user]);

  if (!user) return null;

  const allStudents = [...DEFAULT_STUDENT_POOL, ...customStudents];

  // ── Actions ─────────────────────────────────────────────────────────────────
  const sendRequest = (profileId: string) => {
    const next = new Set(sentIds).add(profileId);
    setSentIds(next);
    setStorage("unihub_friend_requests_sent", Array.from(next));
  };

  const cancelRequest = (profileId: string) => {
    const next = new Set(sentIds);
    next.delete(profileId);
    setSentIds(next);
    setStorage("unihub_friend_requests_sent", Array.from(next));
  };

  const acceptRequest = (req: FriendRequest) => {
    const nextFriends = new Set(friendIds).add(req.profileId);
    const nextReceived = receivedRequests.filter(r => r.profileId !== req.profileId);
    setFriendIds(nextFriends);
    setReceivedRequests(nextReceived);
    setStorage("unihub_friend_ids", Array.from(nextFriends));
    setStorage("unihub_friend_requests_received", nextReceived);
  };

  const declineRequest = (req: FriendRequest) => {
    const next = receivedRequests.filter(r => r.profileId !== req.profileId);
    setReceivedRequests(next);
    setStorage("unihub_friend_requests_received", next);
  };

  const removeFriend = (profileId: string) => {
    const next = new Set(friendIds);
    next.delete(profileId);
    setFriendIds(next);
    setStorage("unihub_friend_ids", Array.from(next));
  };

  // ── Direct Add by Username or Email ──────────────────────────────────────────
  const handleAddByUsernameOrEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const query = addInput.trim().toLowerCase().replace(/^@/, "");
    if (!query) {
      setAddFeedback({ type: "error", text: "Please enter a valid username or email." });
      return;
    }

    // Check if matching student exists in pool
    const match = allStudents.find(
      s => s.username.toLowerCase() === query || s.email.toLowerCase() === query
    );

    if (match) {
      if (friendIds.has(match.id)) {
        setAddFeedback({ type: "error", text: `${match.name} (@${match.username}) is already in your friends list.` });
        return;
      }
      const nextFriends = new Set(friendIds).add(match.id);
      setFriendIds(nextFriends);
      setStorage("unihub_friend_ids", Array.from(nextFriends));
      setAddFeedback({
        type: "success",
        text: `Success! Added ${match.name} (@${match.username}) to your friends!`,
      });
      setAddInput("");
      return;
    }

    // If custom email or username not in default pool, create a new custom student profile and save
    const isEmail = query.includes("@") && query.includes(".");
    const cleanUsername = isEmail ? query.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") : query;
    const cleanEmail = isEmail ? query : `${cleanUsername}@university.edu`;
    const derivedName = cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);
    const initials = (cleanUsername.slice(0, 2) || "ST").toUpperCase();

    const newStudent: StudentProfile = {
      id: `custom_${Date.now()}`,
      name: derivedName,
      username: cleanUsername,
      email: cleanEmail,
      university: "University Student",
      country: "Global",
      degree: "General Studies",
      year: "Year 1",
      bio: "Added via direct username/email connection.",
      initials,
      avatarColor: "bg-emerald-500/20 text-emerald-400",
    };

    const updatedCustom = [newStudent, ...customStudents];
    setCustomStudents(updatedCustom);
    setStorage("unihub_custom_friends", updatedCustom);

    const nextFriends = new Set(friendIds).add(newStudent.id);
    setFriendIds(nextFriends);
    setStorage("unihub_friend_ids", Array.from(nextFriends));

    setAddFeedback({
      type: "success",
      text: `Saved & connected! Added ${derivedName} (@${cleanUsername} - ${cleanEmail}) as a friend.`,
    });
    setAddInput("");
  };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const friends = allStudents.filter(p => friendIds.has(p.id));
  const pending = allStudents.filter(p => sentIds.has(p.id) && !friendIds.has(p.id));
  const incomingProfiles = receivedRequests
    .map(r => allStudents.find(p => p.id === r.profileId))
    .filter(Boolean) as StudentProfile[];

  const discoverPool = allStudents.filter(p =>
    !friendIds.has(p.id) &&
    (search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.university.toLowerCase().includes(search.toLowerCase()) ||
      p.degree.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase()))
  );

  const requestCount = incomingProfiles.length;

  // ── Profile card ─────────────────────────────────────────────────────────────
  const ProfileCard = ({ profile, actions }: { profile: StudentProfile; actions: React.ReactNode }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="bg-card border-border hover-elevate">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarFallback className={`font-bold text-sm ${profile.avatarColor}`}>
                {profile.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-base leading-tight">{profile.name}</h3>
                <Badge variant="outline" className="text-[11px] gap-1 font-mono text-muted-foreground border-border">
                  <AtSign className="w-3 h-3 text-primary" />
                  {profile.username}
                </Badge>
                <Badge variant="secondary" className="text-[11px] gap-1 font-mono text-muted-foreground">
                  <Mail className="w-3 h-3 text-emerald-400" />
                  {profile.email}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />{profile.degree} · {profile.year}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{profile.university}, {profile.country}
                </span>
              </div>
              <p className="text-sm text-foreground/70 mt-2 leading-relaxed line-clamp-2">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mt-3">{actions}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // ── Empty state ───────────────────────────────────────────────────────────────
  const Empty = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
    <div className="text-center py-16 border-2 border-dashed rounded-xl bg-sidebar/30 border-border/60 p-6">
      <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
      <h3 className="font-semibold text-xl text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">{desc}</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
        <p className="text-muted-foreground mt-2">Connect with fellow students using their username, email, or global discovery.</p>
      </div>

      {/* ── Add Friend by Username / Email Box ──────────────────────────────────── */}
      <Card className="bg-sidebar border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            Add Friend by Username or Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddByUsernameOrEmail} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter username (@aisha_r) or email (ethan@ed.ac.uk)..."
                className="pl-9 bg-card"
                value={addInput}
                onChange={e => {
                  setAddInput(e.target.value);
                  if (addFeedback) setAddFeedback(null);
                }}
              />
            </div>
            <Button type="submit" className="gap-1.5 shrink-0">
              <UserPlus className="w-4 h-4" /> Save & Add Friend
            </Button>
          </form>

          {addFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-md text-xs flex items-center gap-2 border ${
                addFeedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{addFeedback.text}</span>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-sidebar">
          <TabsTrigger value="friends" className="px-5">
            My Friends {friends.length > 0 && <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">{friends.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="discover" className="px-5">Find Students</TabsTrigger>
          <TabsTrigger value="requests" className="px-5">
            Requests {requestCount > 0 && <Badge className="ml-2 h-5 px-1.5 text-xs bg-primary text-primary-foreground">{requestCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* ── My Friends ─────────────────────────────────────────────────────── */}
        <TabsContent value="friends" className="mt-6 space-y-4">
          {friends.length === 0 ? (
            <Empty icon={Users} title="No friends saved yet" desc='Use the box above to enter an email/username or head to "Find Students" to connect.' />
          ) : (
            <AnimatePresence>
              {friends.map(p => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  actions={
                    <>
                      <Button size="sm" variant="outline" className="h-8 gap-1.5 text-muted-foreground" onClick={() => removeFriend(p.id)}>
                        <UserMinus className="w-3.5 h-3.5" /> Remove
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => window.location.href = `/messages`}>
                        <MessageSquare className="w-3.5 h-3.5" /> Message
                      </Button>
                    </>
                  }
                />
              ))}
            </AnimatePresence>
          )}

          {/* Sent (pending) requests */}
          {pending.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pending Requests Sent</h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {pending.map(p => (
                    <ProfileCard
                      key={p.id}
                      profile={p}
                      actions={
                        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-muted-foreground" onClick={() => cancelRequest(p.id)}>
                          <UserX className="w-3.5 h-3.5" /> Cancel Request
                        </Button>
                      }
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Find Students ───────────────────────────────────────────────────── */}
        <TabsContent value="discover" className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, @username, email, university, or degree…"
              className="pl-9 bg-card"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {discoverPool.length === 0 ? (
            <Empty icon={Search} title="No students found" desc="Try searching with a username, email address, or university name." />
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">{discoverPool.length} student{discoverPool.length !== 1 ? 's' : ''} found</p>
              <AnimatePresence>
                {discoverPool.map(p => {
                  const sent = sentIds.has(p.id);
                  return (
                    <ProfileCard
                      key={p.id}
                      profile={p}
                      actions={
                        sent ? (
                          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-muted-foreground" onClick={() => cancelRequest(p.id)}>
                            <UserX className="w-3.5 h-3.5" /> Cancel Request
                          </Button>
                        ) : (
                          <Button size="sm" className="h-8 gap-1.5" onClick={() => sendRequest(p.id)}>
                            <UserPlus className="w-3.5 h-3.5" /> Add Friend
                          </Button>
                        )
                      }
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        {/* ── Requests ────────────────────────────────────────────────────────── */}
        <TabsContent value="requests" className="mt-6 space-y-4">
          {incomingProfiles.length === 0 ? (
            <Empty icon={UserPlus} title="No pending requests" desc="When other students add you, their requests will appear here." />
          ) : (
            <AnimatePresence>
              {incomingProfiles.map(p => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  actions={
                    <>
                      <Button size="sm" className="h-8 gap-1.5" onClick={() => acceptRequest({ profileId: p.id, sentAt: new Date().toISOString() })}>
                        <UserCheck className="w-3.5 h-3.5" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 gap-1.5 text-muted-foreground" onClick={() => declineRequest({ profileId: p.id, sentAt: "" })}>
                        <UserX className="w-3.5 h-3.5" /> Decline
                      </Button>
                    </>
                  }
                />
              ))}
            </AnimatePresence>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

