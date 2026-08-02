import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getStorage, setStorage } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  UserPlus, UserCheck, UserX, Users, Search,
  GraduationCap, MapPin, MessageSquare, UserMinus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
interface StudentProfile {
  id: string;
  name: string;
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
const STUDENT_POOL: StudentProfile[] = [
  { id: 's1',  name: 'Aisha Ramjuttun',   university: 'University of Mauritius',       country: 'Mauritius',     degree: 'Computer Science',          year: 'Year 2', bio: 'Passionate about AI and mobile apps. Looking for project collaborators.',           initials: 'AR', avatarColor: 'bg-violet-500/20 text-violet-500' },
  { id: 's2',  name: 'Ethan Clarke',       university: 'University of Edinburgh',       country: 'UK',            degree: 'Mathematics',               year: 'Year 3', bio: 'Into number theory and competitive maths. Happy to help with calculus problems.',    initials: 'EC', avatarColor: 'bg-blue-500/20 text-blue-500' },
  { id: 's3',  name: 'Priya Nair',         university: 'IIT Bombay',                   country: 'India',         degree: 'Electrical Engineering',     year: 'Year 4', bio: 'Final-year EE student. Interested in renewable energy and signal processing.',      initials: 'PN', avatarColor: 'bg-pink-500/20 text-pink-500' },
  { id: 's4',  name: 'Lucas Ferreira',     university: 'Universidade de São Paulo',    country: 'Brazil',        degree: 'Economics',                  year: 'Year 2', bio: 'Economics student with a love for data visualisation and public policy.',           initials: 'LF', avatarColor: 'bg-amber-500/20 text-amber-500' },
  { id: 's5',  name: 'Amara Diallo',       university: 'University of Ghana',          country: 'Ghana',         degree: 'Law',                        year: 'Year 3', bio: 'Aspiring human rights lawyer. Interested in international law and advocacy.',       initials: 'AD', avatarColor: 'bg-emerald-500/20 text-emerald-500' },
  { id: 's6',  name: 'Yuki Tanaka',        university: 'University of Tokyo',          country: 'Japan',         degree: 'Computer Science',          year: 'Year 1', bio: 'First-year CS student interested in game development and machine learning.',        initials: 'YT', avatarColor: 'bg-cyan-500/20 text-cyan-500' },
  { id: 's7',  name: 'Sofía Martínez',     university: 'Universidad Autónoma de Madrid', country: 'Spain',       degree: 'Psychology',                year: 'Year 3', bio: 'Cognitive psych enthusiast. Looking for study partners for research methods.',     initials: 'SM', avatarColor: 'bg-rose-500/20 text-rose-500' },
  { id: 's8',  name: 'Kwame Asante',       university: 'University of Cape Town',      country: 'South Africa',  degree: 'Business Administration',   year: 'Year 2', bio: 'Entrepreneur at heart. Building a student startup on the side.',                   initials: 'KA', avatarColor: 'bg-orange-500/20 text-orange-500' },
  { id: 's9',  name: 'Ingrid Lindström',   university: 'Stockholm University',         country: 'Sweden',        degree: 'Environmental Science',     year: 'Year 4', bio: 'Climate advocate. Writing thesis on Nordic sustainable energy policy.',           initials: 'IL', avatarColor: 'bg-teal-500/20 text-teal-500' },
  { id: 's10', name: 'Mohammed Al-Rashid', university: 'American University of Dubai', country: 'UAE',           degree: 'Finance',                   year: 'Year 3', bio: 'Finance student focusing on Islamic banking and FinTech innovation.',              initials: 'MA', avatarColor: 'bg-indigo-500/20 text-indigo-500' },
  { id: 's11', name: 'Chioma Obi',         university: 'University of Lagos',          country: 'Nigeria',       degree: 'Medicine',                  year: 'Year 5', bio: 'Medical student passionate about public health in Sub-Saharan Africa.',           initials: 'CO', avatarColor: 'bg-fuchsia-500/20 text-fuchsia-500' },
  { id: 's12', name: 'Daniel Park',        university: 'Seoul National University',    country: 'South Korea',   degree: 'Computer Engineering',      year: 'Year 2', bio: 'Into embedded systems and IoT. Love debugging hardware.',                         initials: 'DP', avatarColor: 'bg-sky-500/20 text-sky-500' },
  { id: 's13', name: 'Fatima Benali',      university: 'Mohammed V University',        country: 'Morocco',       degree: 'Architecture',              year: 'Year 3', bio: 'Architecture student blending traditional Moroccan design with modern approaches.', initials: 'FB', avatarColor: 'bg-lime-500/20 text-lime-500' },
  { id: 's14', name: 'Oliver Müller',      university: 'TU Munich',                   country: 'Germany',       degree: 'Mechanical Engineering',    year: 'Year 3', bio: 'Automotive engineering student. Working on an EV conversion project.',            initials: 'OM', avatarColor: 'bg-yellow-500/20 text-yellow-600' },
  { id: 's15', name: 'Amelia Johnson',     university: 'University of Melbourne',      country: 'Australia',     degree: 'Biology',                   year: 'Year 2', bio: 'Marine biology is my passion. Currently assisting in reef conservation research.',  initials: 'AJ', avatarColor: 'bg-green-500/20 text-green-500' },
  { id: 's16', name: 'Ravi Sharma',        university: 'University of Delhi',          country: 'India',         degree: 'Political Science',         year: 'Year 3', bio: 'Interested in South Asian geopolitics and comparative governance.',               initials: 'RS', avatarColor: 'bg-red-500/20 text-red-500' },
  { id: 's17', name: 'Chloe Dubois',       university: 'Sciences Po Paris',            country: 'France',        degree: 'International Relations',   year: 'Year 4', bio: 'Multilingual student (FR/EN/ES). Interested in EU policy and diplomacy.',         initials: 'CD', avatarColor: 'bg-purple-500/20 text-purple-500' },
  { id: 's18', name: 'Tariq Mubarak',      university: 'University of Nairobi',        country: 'Kenya',         degree: 'Computer Science',          year: 'Year 2', bio: 'Building apps to solve local problems. Open-source contributor.',                 initials: 'TM', avatarColor: 'bg-emerald-600/20 text-emerald-600' },
  { id: 's19', name: 'Hannah Schmidt',     university: 'University of Vienna',         country: 'Austria',       degree: 'Psychology',                year: 'Year 3', bio: 'Clinical psych track. Interested in cross-cultural mental health research.',      initials: 'HS', avatarColor: 'bg-pink-600/20 text-pink-600' },
  { id: 's20', name: 'Jae-won Lee',        university: 'KAIST',                        country: 'South Korea',   degree: 'Data Science',              year: 'Year 2', bio: 'Loves Kaggle competitions and NLP. Looking for ML study partners.',               initials: 'JL', avatarColor: 'bg-blue-600/20 text-blue-600' },
  { id: 's21', name: 'Naledi Dlamini',     university: 'University of Pretoria',       country: 'South Africa',  degree: 'Accounting',                year: 'Year 3', bio: 'Studying towards CPA. Interested in forensic accounting and auditing.',           initials: 'ND', avatarColor: 'bg-amber-600/20 text-amber-600' },
  { id: 's22', name: 'Arjun Menon',        university: 'NUS',                          country: 'Singapore',     degree: 'Computer Science',          year: 'Year 3', bio: 'Backend developer. Building SaaS products in free time. Always up for hackathons.', initials: 'AM', avatarColor: 'bg-violet-600/20 text-violet-600' },
  { id: 's23', name: 'Zara Ahmed',         university: 'University of Toronto',        country: 'Canada',        degree: 'Neuroscience',              year: 'Year 4', bio: 'Researching Alzheimer\'s biomarkers. Hoping to pursue MD-PhD.',                  initials: 'ZA', avatarColor: 'bg-cyan-600/20 text-cyan-600' },
  { id: 's24', name: 'Mateus Costa',       university: 'PUC-Rio',                      country: 'Brazil',        degree: 'Design',                    year: 'Year 2', bio: 'UX designer in training. Obsessed with accessibility and inclusive design.',      initials: 'MC', avatarColor: 'bg-rose-600/20 text-rose-600' },
  { id: 's25', name: 'Selin Yıldız',       university: 'Boğaziçi University',          country: 'Turkey',        degree: 'Business Administration',   year: 'Year 3', bio: 'Interested in fintech and emerging markets. Also a competitive debater.',        initials: 'SY', avatarColor: 'bg-orange-600/20 text-orange-600' },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function Friends() {
  const user = useRequireAuth();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("friends");

  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (!user) return;
    setFriendIds(new Set(getStorage<string[]>("unihub_friend_ids", [])));
    setSentIds(new Set(getStorage<string[]>("unihub_friend_requests_sent", [])));
    setReceivedRequests(getStorage<FriendRequest[]>("unihub_friend_requests_received", []));
  }, [user]);

  if (!user) return null;

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

  // ── Derived data ─────────────────────────────────────────────────────────────
  const friends = STUDENT_POOL.filter(p => friendIds.has(p.id));
  const pending = STUDENT_POOL.filter(p => sentIds.has(p.id) && !friendIds.has(p.id));
  const incomingProfiles = receivedRequests
    .map(r => STUDENT_POOL.find(p => p.id === r.profileId))
    .filter(Boolean) as StudentProfile[];

  const discoverPool = STUDENT_POOL.filter(p =>
    !friendIds.has(p.id) &&
    (search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
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
              <h3 className="font-semibold text-base leading-tight">{profile.name}</h3>
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
    <div className="text-center py-20 border-2 border-dashed rounded-xl bg-sidebar/30 border-border/60">
      <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
      <h3 className="font-semibold text-xl text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">{desc}</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
        <p className="text-muted-foreground mt-2">Connect with students from universities around the world.</p>
      </div>

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
            <Empty icon={Users} title="No friends yet" desc='Head to "Find Students" to connect with fellow students from your field or university.' />
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
                      <Button size="sm" variant="outline" className="h-8 gap-1.5">
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
              placeholder="Search by name, university, degree, or country…"
              className="pl-9 bg-card"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {discoverPool.length === 0 ? (
            <Empty icon={Search} title="No students found" desc="Try a different search term." />
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
