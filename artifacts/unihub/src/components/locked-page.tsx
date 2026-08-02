import { Link } from "wouter";
import { Lock, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Plan } from "@/lib/plan";

interface LockedPageProps {
  required: Plan;
}

export function LockedPage({ required }: LockedPageProps) {
  const isPremium = required === "premium";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className={`p-4 rounded-full mb-6 ${isPremium ? "bg-amber-400/10" : "bg-primary/10"}`}>
        {isPremium ? (
          <Crown className="w-10 h-10 text-amber-400" />
        ) : (
          <Zap className="w-10 h-10 text-primary" />
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {isPremium ? "Premium Feature" : "Basic Feature"}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-2">
        This page requires the {isPremium ? "Premium" : "Basic"} plan
      </h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        {isPremium
          ? "Upgrade to Premium ($20/month) to unlock all ONEX features including Notes, Past Papers, Study Groups, Jobs & Internships, Marketplace, Messaging, and Study Music."
          : "Upgrade to Basic ($6/month) to unlock the Focus Timer and Student Tracker."}
      </p>

      <Link href="/pricing">
        <Button className={isPremium ? "bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold" : ""}>
          {isPremium ? "Upgrade to Premium" : "Upgrade to Basic"} →
        </Button>
      </Link>
    </div>
  );
}
