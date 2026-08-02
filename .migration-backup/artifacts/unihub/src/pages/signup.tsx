import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveUser, login } from "@/lib/auth";
import { BookOpen, Globe2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    country: "",
    degree: "",
    year: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: Math.random().toString(36).substring(7),
      ...formData,
      year: Number(formData.year)
    };
    saveUser(newUser);
    login(newUser.email);
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-sidebar items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pattern-grid-lg" />
        <div className="relative z-10 p-12 max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary text-primary-foreground p-3 rounded-2xl inline-flex mb-8 shadow-xl shadow-primary/20"
          >
            <BookOpen className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold tracking-tight mb-4 text-foreground"
          >
            Your Global Campus.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Join thousands of international students on Nexora. Track assignments, find resources, and connect globally in one unified workspace.
          </motion.p>
          
          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border">
              <Globe2 className="w-6 h-6 text-primary mb-2" />
              <div className="font-semibold text-sm">Global Resources</div>
              <div className="text-xs text-muted-foreground mt-1">Study materials from universities worldwide.</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border">
              <Sparkles className="w-6 h-6 text-primary mb-2" />
              <div className="font-semibold text-sm">Smart Tracking</div>
              <div className="text-xs text-muted-foreground mt-1">Never miss a deadline or an opportunity.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-muted-foreground mt-2">Enter your details to get started with Nexora</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="student@uni.edu" onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input id="university" name="university" required placeholder="e.g. Oxford" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country of Study</Label>
                <select 
                  id="country" 
                  name="country" 
                  required 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" disabled>Select...</option>
                  <option value="UK">United Kingdom</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="France">France</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree/Major</Label>
                <Input id="degree" name="degree" required placeholder="Computer Science" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <select 
                  id="year" 
                  name="year" 
                  required 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={handleChange}
                  defaultValue="1"
                >
                  {[1, 2, 3, 4, 5, 6].map(y => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold">
              Create Account
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-primary font-semibold hover:underline cursor-pointer">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
