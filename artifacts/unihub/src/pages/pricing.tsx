import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Check, Zap, Crown, BookOpen, Sparkles, Lock, X, Tag, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { getCurrentPlan, setPlan, type Plan } from "@/lib/plan";

// ── Whop plan IDs — update WHOP_PREMIUM_PLAN_ID once you create the Premium plan in Whop
const WHOP_PLAN_IDS: Record<string, string> = {
  basic:   "plan_ORGioCWYgnsKj",
  premium: "plan_LOsScZrbdgHyJ",
};

// ── Plan definitions ─────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free" as Plan,
    name: "Free",
    price: 0,
    period: null,
    icon: BookOpen,
    badge: null,
    description: "Get started with the dashboard.",
    color: "border-border",
    headerColor: "bg-sidebar",
    features: [
      { label: "Dashboard overview", included: true },
      { label: "Focus Timer & Focus Lock", included: false },
      { label: "Student Tracker & Assignments", included: false },
      { label: "Notes & Learning Hub", included: false },
      { label: "Past Papers Archive", included: false },
      { label: "Study Groups & Community", included: false },
      { label: "Jobs, Internships & CV Builder", included: false },
      { label: "Student Marketplace", included: false },
      { label: "Direct Messaging & Friends", included: false },
      { label: "Study Music Hub", included: false },
    ],
  },
  {
    id: "basic" as Plan,
    name: "Basic",
    price: 6,
    period: "month",
    icon: Zap,
    badge: null,
    description: "Focus Timer & Student Tracker included.",
    color: "border-primary/40",
    headerColor: "bg-primary/5",
    features: [
      { label: "Dashboard overview", included: true },
      { label: "Focus Timer & Focus Lock", included: true },
      { label: "Student Tracker & Assignments", included: true },
      { label: "Notes & Learning Hub", included: false },
      { label: "Past Papers Archive", included: false },
      { label: "Study Groups & Community", included: false },
      { label: "Jobs, Internships & CV Builder", included: false },
      { label: "Student Marketplace", included: false },
      { label: "Direct Messaging & Friends", included: false },
      { label: "Study Music Hub", included: false },
    ],
  },
  {
    id: "premium" as Plan,
    name: "Premium",
    price: 20,
    period: "month",
    icon: Crown,
    badge: "Best Value",
    description: "The full ONEX experience — complete access to all features.",
    color: "border-amber-400/50",
    headerColor: "bg-amber-400/5",
    features: [
      { label: "Dashboard overview", included: true },
      { label: "Focus Timer & Focus Lock", included: true },
      { label: "Student Tracker & Assignments", included: true },
      { label: "Notes & Learning Hub", included: true },
      { label: "Past Papers Archive", included: true },
      { label: "Study Groups & Community", included: true },
      { label: "Jobs, Internships & CV Builder", included: true },
      { label: "Student Marketplace", included: true },
      { label: "Direct Messaging & Friends", included: true },
      { label: "Study Music Hub", included: true },
    ],
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [currentPlan, setCurrentPlan] = useState<Plan>(getCurrentPlan());
  const [successMsg, setSuccessMsg]   = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [promoCode, setPromoCode]       = useState("");
  const [premiumCodeInput, setPremiumCodeInput] = useState("");
  const [promoError, setPromoError]     = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState(false);


  // Handle redirect back from Whop checkout (?success=true&plan=basic)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const plan    = params.get("plan") as Plan | null;

    if (success === "true" && (plan === "basic" || plan === "premium")) {
      setPlan(plan);
      setCurrentPlan(plan);
      setSuccessMsg(`You're now on the ${plan === "premium" ? "Premium" : "Basic"} plan 🎉`);
      window.history.replaceState({}, "", "/pricing");
    }
  }, []);

  // Listen for plan changes from other tabs / auth updates
  useEffect(() => {
    const handler = () => setCurrentPlan(getCurrentPlan());
    window.addEventListener("onex_plan_changed", handler);
    return () => window.removeEventListener("onex_plan_changed", handler);
  }, []);

  // Listen for Whop iframe postMessage completion events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        const eventType = String(data.type || data.event || data.action || "").toLowerCase();
        if (
          eventType.includes("complete") ||
          eventType.includes("success") ||
          data.status === "completed"
        ) {
          if (checkoutPlan) {
            setPlan(checkoutPlan);
            setCurrentPlan(checkoutPlan);
            setSuccessMsg(`You're now on the ${checkoutPlan === "premium" ? "Premium" : "Basic"} plan 🎉`);
            setCheckoutOpen(false);
          }
        }
      } catch {
        // Ignored non-json messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [checkoutPlan]);

  const handleApplyCode = (codeToTest: string) => {
    if (codeToTest.trim().toLowerCase() === "onexglobal99") {
      setPlan("premium");
      setCurrentPlan("premium");
      setPromoApplied(true);
      setPromoError(null);
      setSuccessMsg("Premier unlocked with code 🎉 You now have full access!");
      setPremiumCodeInput("");
      setPromoCode("");
    } else {
      setPromoError("Invalid code. Please check and try again.");
    }
  };

  const handleSubscribe = (plan: Plan) => {
    if (plan === "free") return;
    if (currentPlan === plan) { setLocation("/"); return; }
    setCheckoutPlan(plan);
    setCheckoutOpen(true);
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item      = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            ONEX Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Choose your plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more — cancel any time.
          </p>
        </motion.div>

        {/* Success banner */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-4 text-sm font-medium text-center"
          >
            {successMsg}
          </motion.div>
        )}

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {PLANS.map((plan) => {
            const Icon      = plan.icon;
            const isCurrent = currentPlan === plan.id;
            const isUpgrade = plan.id !== "free" &&
              (currentPlan === "free" || (currentPlan === "basic" && plan.id === "premium"));

            return (
              <motion.div
                key={plan.id}
                variants={item}
                className={`relative rounded-2xl border ${plan.color} bg-card overflow-hidden flex flex-col`}
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-400 text-amber-950 font-semibold text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className={`${plan.headerColor} px-6 py-6 border-b border-border`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${plan.id === "premium" ? "bg-amber-400/20" : plan.id === "basic" ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`w-5 h-5 ${plan.id === "premium" ? "text-amber-400" : plan.id === "basic" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-end gap-1 mb-2">
                    {plan.price === 0 ? (
                      <span className="text-3xl font-bold">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground text-sm mb-1">/ {plan.period}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="px-6 py-5 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <div
                      key={f.label}
                      className={`flex items-center gap-3 text-sm ${f.included ? "text-foreground" : "text-muted-foreground/50"}`}
                    >
                      {f.included ? (
                        <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 shrink-0" />
                      )}
                      {f.label}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-6 pb-6 space-y-3">
                  {plan.id === "free" ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={currentPlan === "free"}
                      onClick={() => setLocation("/")}
                    >
                      {currentPlan === "free" ? "Current plan" : "Downgrade to Free"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        className={`w-full ${plan.id === "premium" ? "bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold" : ""}`}
                        disabled={isCurrent}
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        {isCurrent ? "Current plan ✓" : isUpgrade ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`}
                      </Button>

                      {plan.id === "premium" && !isCurrent && (
                        <div className="pt-3 border-t border-amber-400/20 space-y-2">
                          <p className="text-xs text-amber-300/90 text-center font-medium flex items-center justify-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            Or unlock Premier with code
                          </p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter code"
                              value={premiumCodeInput}
                              onChange={(e) => { setPremiumCodeInput(e.target.value); setPromoError(null); }}
                              onKeyDown={(e) => e.key === "Enter" && handleApplyCode(premiumCodeInput)}
                              className="h-8 text-xs bg-background/60 border-amber-400/30 focus-visible:ring-amber-400"
                            />
                            <Button
                              size="sm"
                              className="h-8 text-xs px-3 shrink-0 bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold"
                              onClick={() => handleApplyCode(premiumCodeInput)}
                              disabled={!premiumCodeInput.trim()}
                            >
                              Unlock
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground">
          Secure checkout via Whop · Cancel any time · Prices in USD
        </p>

        {/* Promo code */}
        {!promoApplied && currentPlan !== "premium" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm mx-auto space-y-2"
          >
            <p className="text-center text-xs font-medium text-muted-foreground flex items-center justify-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Have a code?
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code (e.g. onexglobal99)"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoError(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCode(promoCode)}
                className="h-9 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={() => handleApplyCode(promoCode)}
                disabled={!promoCode.trim()}
              >
                Apply
              </Button>
            </div>
            {promoError && (
              <p className="text-xs text-red-400 text-center">{promoError}</p>
            )}
          </motion.div>
        )}
      </div>

      {/* Whop embedded checkout — full-screen overlay */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="w-[95vw] max-w-5xl h-[90vh] p-0 overflow-hidden gap-0 flex flex-col">
          {/* Thin close bar */}
          <DialogHeader className="flex flex-row items-center justify-between px-5 py-3 border-b border-border shrink-0">
            <DialogTitle className="text-sm font-semibold text-muted-foreground">
              Upgrade to {checkoutPlan === "premium" ? "Premium" : "Basic"}
            </DialogTitle>
            <button
              onClick={() => setCheckoutOpen(false)}
              className="rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </DialogHeader>

          {/* Checkout fills remaining height */}
          <div className="flex-1 overflow-auto">
            {checkoutOpen && checkoutPlan && WHOP_PLAN_IDS[checkoutPlan] && (
              <WhopCheckoutEmbed
                key={checkoutPlan}
                planId={WHOP_PLAN_IDS[checkoutPlan]}
                themeOptions={{ backgroundColor: "#0b0b12", accentColor: "#7c5cff", borderRadius: 14 }}
                setupFutureUsage="off_session"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
