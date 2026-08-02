import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, getUsers } from "@/lib/auth";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      login(email);
      setLocation("/");
    } else {
      setError("Invalid email or password. (For testing, create an account first)");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <BookOpen className="w-5 h-5" />
          </div>
          Nexora
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                placeholder="student@uni.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold">
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup">
              <span className="text-primary font-semibold hover:underline cursor-pointer">Sign up</span>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Visual pattern */}
      <div className="hidden lg:flex flex-1 relative bg-sidebar items-center justify-center overflow-hidden border-l border-border">
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
        <div className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl opacity-30 -top-40 -right-40" />
        <div className="absolute w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl opacity-30 bottom-0 left-0" />
        <div className="relative z-10 max-w-md text-center p-8 backdrop-blur-md bg-background/30 rounded-2xl border border-white/10 shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Focus on what matters.</h3>
          <p className="text-muted-foreground leading-relaxed">
            "Nexora replaced my messy combination of notion boards, calendar apps, and endless browser bookmarks."
          </p>
        </div>
      </div>
    </div>
  );
}
