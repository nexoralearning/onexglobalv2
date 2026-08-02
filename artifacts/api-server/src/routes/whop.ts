import { Router } from "express";
import { whopFetch } from "../lib/whopClient";
import { logger } from "../lib/logger";

const router: Router = Router();

const COMPANY_ID         = process.env.WHOP_COMPANY_ID         ?? "";
const BASIC_PLAN         = process.env.WHOP_BASIC_PLAN_ID      ?? "";
const PREMIUM_PLAN       = process.env.WHOP_PREMIUM_PLAN_ID    ?? "";
const BASIC_PRODUCT_ID   = process.env.WHOP_BASIC_PRODUCT_ID   ?? "";
const PREMIUM_PRODUCT_ID = process.env.WHOP_PREMIUM_PRODUCT_ID ?? "";

// ── POST /api/whop/checkout ───────────────────────────────────────────────────
// Retrieves the plan's hosted checkout URL and appends the redirect.

router.post("/whop/checkout", async (req, res) => {
  const { plan, redirect_url } = req.body as { plan?: string; redirect_url?: string };

  if (!plan || !["basic", "premium"].includes(plan)) {
    res.status(400).json({ error: "plan must be 'basic' or 'premium'" });
    return;
  }

  const plan_id = plan === "basic" ? BASIC_PLAN : PREMIUM_PLAN;

  if (!plan_id) {
    res.status(503).json({ error: "Whop plan IDs not configured" });
    return;
  }

  try {
    const planData = await whopFetch("GET", `/api/v1/plans/${plan_id}`) as {
      purchase_url?: string;
    };

    if (!planData.purchase_url) {
      throw new Error("No purchase_url returned from Whop");
    }

    // Append redirect so Whop sends the user back after checkout
    const fallbackRedirect = `${req.headers.origin ?? ""}/pricing?success=true&plan=${plan}`;
    const finalRedirect = redirect_url ?? fallbackRedirect;
    const purchaseUrl = `${planData.purchase_url}?redirect_uri=${encodeURIComponent(finalRedirect)}`;

    res.json({ purchase_url: purchaseUrl });
  } catch (err) {
    logger.error(err, "Whop checkout error");
    res.status(500).json({ error: "Failed to create checkout. Please try again." });
  }
});

// ── GET /api/whop/plans ───────────────────────────────────────────────────────
// Returns the current plan metadata so the frontend never hardcodes prices.

router.get("/whop/plans", (_req, res) => {
  res.json({
    basic: {
      id: BASIC_PLAN,
      name: "Basic",
      price: 6,
      period: "month",
    },
    premium: {
      id: PREMIUM_PLAN,
      name: "Premium",
      price: 20,
      period: "month",
    },
  });
});

// ── POST /api/whop/verify ─────────────────────────────────────────────────────
// After Whop redirects back, verify server-side that an active membership exists.

router.post("/whop/verify", async (req, res) => {
  const { plan } = req.body as { plan?: string };

  if (!plan || !["basic", "premium"].includes(plan)) {
    res.status(400).json({ verified: false, error: "Invalid plan" });
    return;
  }

  const productId = plan === "basic" ? BASIC_PRODUCT_ID : PREMIUM_PRODUCT_ID;

  if (!productId || !COMPANY_ID) {
    res.status(503).json({ verified: false, error: "Whop product IDs not configured" });
    return;
  }

  try {
    const result = await whopFetch(
      "GET",
      `/api/v1/memberships?product_ids[]=${productId}&statuses[]=active&company_id=${COMPANY_ID}`,
    ) as { data?: unknown[] };

    const memberships = result.data ?? [];
    const verified = memberships.length > 0;

    logger.info({ plan, productId, verified, count: memberships.length }, "Whop verify");
    res.json({ verified, plan });
  } catch (err) {
    logger.error(err, "Whop verify error");
    // Fail closed — never grant access on error
    res.status(500).json({ verified: false, error: "Could not verify purchase. Please try again." });
  }
});

export default router;
