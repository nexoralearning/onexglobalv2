/**
 * Whop API client — proxies all requests through the Replit connectors proxy,
 * which injects the correct API key and handles token refresh automatically.
 *
 * For standalone deploys (Vercel etc.) set WHOP_API_KEY in the environment.
 */

const HOSTNAME = process.env.REPLIT_CONNECTORS_HOSTNAME;
const REPL_TOKEN = process.env.REPL_IDENTITY
  ? `repl ${process.env.REPL_IDENTITY}`
  : process.env.WEB_REPL_RENEWAL
    ? `depl ${process.env.WEB_REPL_RENEWAL}`
    : null;

const DIRECT_KEY = process.env.WHOP_API_KEY;

export async function whopFetch(
  method: string,
  path: string,
  body?: unknown,
): Promise<unknown> {
  if (HOSTNAME && REPL_TOKEN) {
    // ── Replit connectors proxy ──────────────────────────────────────────────
    const url = `https://${HOSTNAME}/api/v2/proxy${path}`;
    const resp = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Replit-Token": REPL_TOKEN,
        "Connector-Name": "whop",
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw Object.assign(
        new Error(`Whop API ${resp.status}: ${JSON.stringify(data)}`),
        { status: resp.status, data },
      );
    }
    return data;
  }

  if (DIRECT_KEY) {
    // ── Direct API key (non-Replit deploys) ──────────────────────────────────
    const resp = await fetch(`https://api.whop.com${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${DIRECT_KEY}`,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw Object.assign(
        new Error(`Whop API ${resp.status}: ${JSON.stringify(data)}`),
        { status: resp.status, data },
      );
    }
    return data;
  }

  throw new Error(
    "Whop credentials not found. " +
      "On Replit: connect Whop via the Integrations tab. " +
      "On Vercel/other: set the WHOP_API_KEY environment variable.",
  );
}
