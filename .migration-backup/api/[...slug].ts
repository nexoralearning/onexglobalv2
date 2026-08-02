/**
 * Vercel catch-all serverless function for all /api/* routes.
 * File-based routing ensures Vercel calls this for every /api/* request
 * and preserves the original req.url so Express routing works correctly.
 */
import app from '../artifacts/api-server/src/app.js';

export default app;
