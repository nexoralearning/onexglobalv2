/**
 * plan.ts — client-side subscription tier management.
 *
 * Plans:
 *   "free"    – no subscription (default)
 *   "basic"   – $6/month, partial access
 *   "premium" – $20/month, full access
 *
 * The tier is stored in localStorage after the user completes a Whop checkout.
 * Whop remains the source of truth; this is a local UI cache only.
 */

import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export type Plan = "free" | "basic" | "premium";

const PLAN_KEY = "onex_plan";

export function getCurrentPlan(): Plan {
  try {
    const stored = localStorage.getItem(PLAN_KEY) as Plan | null;
    if (stored === "basic" || stored === "premium") return stored;
  } catch {
    // SSR / storage unavailable
  }
  return "free";
}

export function setPlan(plan: Plan): void {
  try {
    localStorage.setItem(PLAN_KEY, plan);
    window.dispatchEvent(new CustomEvent("onex_plan_changed", { detail: plan }));
  } catch {
    // storage unavailable
  }

  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    const userRef = doc(db, "users", uid);
    setDoc(userRef, { plan, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
      console.error("Failed to update user plan in Firestore:", err);
    });
  }
}

export function clearPlan(): void {
  try {
    localStorage.removeItem(PLAN_KEY);
    window.dispatchEvent(new CustomEvent("onex_plan_changed", { detail: "free" }));
  } catch {
    // storage unavailable
  }
}

// ── Feature gating ─────────────────────────────────────────────────────────

/**
 * Pages accessible on each tier (cumulative — premium includes basic + free).
 * Keep in sync with sidebar-layout.tsx nav items.
 */
/**
 * Pages accessible on each tier (cumulative — premium includes basic + free).
 * Basic tier ($6/mo): Focus Timer (/timer), Student Tracker (/leaderboard), Assignments (/assignments), Dashboard (/).
 * Premium tier ($20/mo): Everything else (Learning Hub, YouTube, Notes, Past Papers, Study Groups, Jobs, CV Builder, Marketplace, Messages, Friends, Music Hub).
 */
export const BASIC_PAGES  = ["/", "/timer", "/leaderboard", "/assignments"];
export const PREMIUM_PAGES = [
  "/learning", "/youtube", "/notes", "/past-papers",
  "/study-groups", "/jobs", "/cv-builder", "/marketplace",
  "/messages", "/friends", "/music"
];
export const FREE_PAGES   = ["/pricing", "/login", "/signup", "/settings"];

export function canAccess(path: string, plan: Plan): boolean {
  if (FREE_PAGES.some(p => path.startsWith(p))) return true;
  if (plan === "premium") return true;
  if (plan === "basic")   return BASIC_PAGES.some(p => path === p || path.startsWith(p));
  return false;
}

export function requiredPlanFor(path: string): Plan {
  if (PREMIUM_PAGES.some(p => path.startsWith(p))) return "premium";
  if (BASIC_PAGES.some(p => path.startsWith(p)))   return "basic";
  return "free";
}
