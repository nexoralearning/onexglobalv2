/**
 * Vercel catch-all handler for /api/* routes.
 * Uses dynamic import so Vercel's bundler does not try to statically
 * resolve the .mjs file at build time (which was causing silent 404s).
 */
let _app;

export default async function handler(req, res) {
  try {
    if (!_app) {
      const mod = await import('../artifacts/api-server/dist/app.mjs');
      _app = mod.default;
    }
    _app(req, res);
  } catch (err) {
    console.error('[api/handler] Failed to load or run Express app:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server failed to initialize', details: String(err) });
    }
  }
}
