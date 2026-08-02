import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, BookOpen, Youtube, FileText, 
  FileStack, Users, CalendarCheck, Briefcase, 
  Store, Settings, LogOut, Menu, X, Moon, Sun, MessageSquare, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, logout } from "@/lib/auth";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { getStorage } from "@/lib/storage";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const user = getCurrentUser();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const convos = getStorage<any[]>('unihub_conversations', []);
      const unreadCount = convos.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      setUnreadMessages(unreadCount);
    };
    
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('unihub_messages_updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('unihub_messages_updated', handleStorageChange);
    };
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BookOpen, label: "Learning Hub", href: "/learning" },
    { icon: Youtube, label: "YouTube Resources", href: "/youtube" },
    { icon: FileText, label: "Notes", href: "/notes" },
    { icon: FileStack, label: "Past Papers", href: "/past-papers" },
    { icon: Users, label: "Study Groups", href: "/study-groups" },
    { icon: CalendarCheck, label: "Assignments", href: "/assignments" },
    { icon: Briefcase, label: "Jobs & Internships", href: "/jobs" },
    { icon: Store, label: "Marketplace", href: "/marketplace" },
    { icon: MessageSquare, label: "Messages", href: "/messages", badge: unreadMessages > 0 ? unreadMessages : undefined },
    { icon: UserPlus, label: "Friends", href: "/friends" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center px-6 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-sidebar-foreground">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          Nexora
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className="block mb-1">
              <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                  ${isActive 
                    ? "bg-sidebar-primary/10 text-sidebar-primary" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50"}`} />
                  {item.label}
                </div>
                {item.badge !== undefined && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mt-8 mb-4 px-2">
          Preferences
        </div>
        <Link href="/settings" className="block">
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
      </div>

      <div className="p-4 border-t border-sidebar-border space-y-4 shrink-0">
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
        <div className="flex items-center justify-between bg-sidebar-accent/50 p-3 rounded-xl border border-sidebar-border">
          <div className="flex items-center gap-3 truncate">
            <Avatar className="w-9 h-9 border border-sidebar-border/50">
              <AvatarImage src={user?.avatarUrl} />
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
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-primary text-primary-foreground p-1 rounded-md">
            <BookOpen className="w-5 h-5" />
          </div>
          Nexora
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
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
