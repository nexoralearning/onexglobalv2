import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, BookOpen, Youtube, FileText, 
  FileStack, Users, CalendarCheck, Briefcase, 
  Store, Settings, LogOut, Menu, X, Moon, Sun, MessageSquare, UserPlus,
  CreditCard, Lock, Zap, Crown, Timer, Trophy, Headphones, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { getStorage } from "@/lib/storage";
import { getCurrentPlan, canAccess, type Plan } from "@/lib/plan";
import { isFocusActive, getFocusRemaining, formatMs } from "@/lib/focus-timer";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [plan, setPlan] = useState<Plan>(getCurrentPlan());
  const [focusActive, setFocusActive] = useState(false);
  const [focusRemaining, setFocusRemaining] = useState(0);
  const user = useRequireAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const convos = getStorage<Array<{ unreadCount?: number }>>('unihub_conversations', []);
      const unreadCount = convos.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      setUnreadMessages(unreadCount);
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('unihub_messages_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('unihub_messages_updated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handler = () => setPlan(getCurrentPlan());
    window.addEventListener('onex_plan_changed', handler);
    return () => window.removeEventListener('onex_plan_changed', handler);
  }, []);

  // ── Focus timer state ──────────────────────────────────────────────────
  useEffect(() => {
    const sync = () => {
      setFocusActive(isFocusActive());
      setFocusRemaining(getFocusRemaining());
    };
    sync();
    const id = setInterval(sync, 1000);
    window.addEventListener('unihub_focus_changed', sync);
    return () => { clearInterval(id); window.removeEventListener('unihub_focus_changed', sync); };
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard",         href: "/" },
    { icon: CalendarCheck,   label: "Assignments",        href: "/assignments" },
    { icon: FileText,        label: "Notes",              href: "/notes" },
    { icon: BookOpen,        label: "Learning Hub",       href: "/learning" },
    { icon: Youtube,         label: "YouTube Resources",  href: "/youtube" },
    { icon: FileStack,       label: "Past Papers",        href: "/past-papers" },
    { icon: Users,           label: "Study Groups",       href: "/study-groups" },
    { icon: Briefcase,       label: "Jobs & Internships", href: "/jobs" },
    { icon: FileText,        label: "CV Builder",         href: "/cv-builder" },
    { icon: Store,           label: "Marketplace",        href: "/marketplace" },
    { icon: MessageSquare,   label: "Messages",           href: "/messages", badge: (!focusActive && unreadMessages > 0) ? unreadMessages : undefined },
    { icon: UserPlus,        label: "Friends",            href: "/friends" },
  ];

  const planLabel = plan === "premium" ? "Premium" : plan === "basic" ? "Basic" : "Free";
  const PlanIcon  = plan === "premium" ? Crown : plan === "basic" ? Zap : Lock;
  const planColor = plan === "premium"
    ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
    : plan === "basic"
    ? "text-primary bg-primary/10 border-primary/20"
    : "text-muted-foreground bg-muted border-border";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center px-6 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-sidebar-foreground">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            ONEX
          </div>
          <span className="text-xs text-sidebar-foreground/50 tracking-widest uppercase ml-9">global</span>
        </div>
      </div>

      {/* Focus timer strip */}
      {focusActive && (
        <Link href="/timer" className="block">
          <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/25 cursor-pointer hover:bg-primary/15 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Focus Lock</span>
              </div>
              <span className="text-sm font-mono font-bold text-primary">{formatMs(focusRemaining)}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>

        {navItems.map((item) => {
          const isActive  = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const locked    = !canAccess(item.href, plan);
          return (
            <Link key={item.href} href={item.href} className="block mb-1">
              <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                  ${isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : locked
                    ? "text-sidebar-foreground/35 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/50"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : locked ? "text-sidebar-foreground/25" : "text-sidebar-foreground/50"}`} />
                  {item.label}
                </div>
                <div className="flex items-center gap-1.5">
                  {locked && <Lock className="w-3 h-3 text-sidebar-foreground/30" />}
                  {!locked && item.badge !== undefined && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Preferences */}
        <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mt-6 mb-3 px-2">
          Tools
        </div>

        {/* Focus Timer nav item */}
        {(() => {
          const locked = !canAccess("/timer", plan);
          return (
            <Link href="/timer" className="block mb-1">
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                  ${location === "/timer"
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : locked
                    ? "text-sidebar-foreground/35 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/50"
                    : focusActive
                    ? "text-primary bg-primary/5 hover:bg-primary/10"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Timer className={`w-5 h-5 ${location === "/timer" ? "text-sidebar-primary" : focusActive ? "text-primary" : locked ? "text-sidebar-foreground/25" : "text-sidebar-foreground/50"}`} />
                  Focus Timer
                </div>
                {locked ? (
                  <Lock className="w-3 h-3 text-sidebar-foreground/30" />
                ) : focusActive ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 animate-pulse">
                    LIVE
                  </span>
                ) : null}
              </div>
            </Link>
          );
        })()}

        {/* Student Tracker / Leaderboard */}
        {(() => {
          const locked = !canAccess("/leaderboard", plan);
          return (
            <Link href="/leaderboard" className="block mb-1">
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                  ${location === "/leaderboard"
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : locked
                    ? "text-sidebar-foreground/35 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/50"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Trophy className={`w-5 h-5 ${location === "/leaderboard" ? "text-sidebar-primary" : locked ? "text-sidebar-foreground/25" : "text-sidebar-foreground/50"}`} />
                  Student Tracker
                </div>
                {locked && <Lock className="w-3 h-3 text-sidebar-foreground/30" />}
              </div>
            </Link>
          );
        })()}

        {/* Study Music Hub */}
        {(() => {
          const locked = !canAccess("/music", plan);
          return (
            <Link href="/music" className="block mb-1">
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                  ${location === "/music"
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : locked
                    ? "text-sidebar-foreground/35 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/50"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Headphones className={`w-5 h-5 ${location === "/music" ? "text-sidebar-primary" : locked ? "text-sidebar-foreground/25" : "text-sidebar-foreground/50"}`} />
                  Study Music Hub
                </div>
                {locked && <Lock className="w-3 h-3 text-sidebar-foreground/30" />}
              </div>
            </Link>
          );
        })()}

        <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mt-4 mb-3 px-2">
          Preferences
        </div>
        <Link href="/settings" className="block mb-1">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer
              ${location === "/settings"
                ? "bg-sidebar-primary/10 text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }
            `}
          >
            <Settings className={`w-5 h-5 ${location === "/settings" ? "text-sidebar-primary" : "text-sidebar-foreground/50"}`} />
            Settings
          </div>
        </Link>

        {/* Pricing / upgrade */}
        <Link href="/pricing" className="block mb-1">
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer
              ${location === "/pricing"
                ? "bg-sidebar-primary/10 text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${location === "/pricing" ? "text-sidebar-primary" : "text-sidebar-foreground/50"}`} />
              Plans &amp; Billing
            </div>
            {plan !== "premium" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/20">
                Upgrade
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3 shrink-0">
        {/* Plan badge */}
        <Link href="/pricing">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${planColor}`}>
            <PlanIcon className="w-3.5 h-3.5" />
            {planLabel} Plan
            {plan === "free" && <span className="ml-auto text-muted-foreground font-normal">Upgrade →</span>}
          </div>
        </Link>

        {/* Theme toggle */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-sidebar-foreground/70">Theme</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-full"
          >
            {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>

        {/* User */}
        <div className="flex items-center justify-between bg-sidebar-accent/50 p-3 rounded-xl border border-sidebar-border">
          <div className="flex items-center gap-3 truncate">
            <Avatar className="w-9 h-9 border border-sidebar-border/50">
              <AvatarImage src={user?.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.substring(0, 2).toUpperCase() || "ST"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold truncate text-sidebar-foreground">{user?.name || "Student"}</span>
              <span className="text-xs text-sidebar-foreground/60 truncate">{user?.university || "University"}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 shrink-0">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background z-20 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              <BookOpen className="w-5 h-5" />
            </div>
            ONEX
          </div>
          <span className="text-xs text-foreground/50 tracking-widest uppercase ml-8">global</span>
        </div>
        <div className="flex items-center gap-2">
          {focusActive && (
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
              {formatMs(focusRemaining)}
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm z-40 md:hidden bg-sidebar"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 lg:w-72 flex-shrink-0 h-[100dvh] sticky top-0">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
