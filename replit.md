# NexoraLearning — nexora-v2 (UniHub)

A global student platform (UniHub) with authentication, dashboard, notes, assignments, jobs, marketplace, study groups, and more.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/unihub run dev` — run the frontend (Vite, port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-server run build` — build the API server (produces dist/index.mjs + dist/app.mjs)
- `pnpm --filter @workspace/unihub run build` — build the frontend (outputs to artifacts/unihub/dist)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only, needs DATABASE_URL)

## Required Environment Variables

### Vercel (set in Project Settings → Environment Variables)
- `DATABASE_URL` — PostgreSQL connection string (e.g. from Neon, Supabase, or Railway)
- `SESSION_SECRET` — Long random string for signing JWTs (e.g. `openssl rand -base64 32`)

### Local dev
- Create `.env` in `artifacts/api-server/` with:
  ```
  DATABASE_URL=postgres://...
  SESSION_SECRET=your-secret-here
  PORT=8080
  ```

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite 7, TailwindCSS 4, Wouter (routing), TanStack Query
- API: Express 5, JWT Bearer tokens, bcryptjs password hashing
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod v4, drizzle-zod
- Build: esbuild (CJS/ESM bundle)

## Where things live

- `artifacts/unihub/` — React frontend (SPA)
- `artifacts/api-server/` — Express API server
  - `src/routes/auth.ts` — Register, login, /me, profile update
  - `src/middlewares/auth.ts` — JWT `requireAuth` middleware
  - `dist/app.mjs` — Pre-built bundle imported by Vercel serverless function
- `lib/db/` — Drizzle ORM schema + client (`usersTable`)
- `lib/api-zod/` — Zod validation schemas (Orval-generated)
- `api/[...slug].ts` — Vercel catch-all serverless function (imports dist/app.mjs)

## Vercel Deployment

- `vercel.json` controls build/output configuration
- Build command: `pnpm --filter @workspace/api-server run build && pnpm --filter @workspace/unihub run build`
- Output directory: `artifacts/unihub/dist`
- API routes: handled by `api/[...slug].ts` (Vercel serverless, imports pre-built Express bundle)
- SPA routing: `/((?!api/).*) → /index.html` rewrite

## Architecture decisions

- **Pre-built API bundle for Vercel**: `dist/app.mjs` is produced by esbuild during build so the Vercel function doesn't need to resolve pnpm workspace symlinks at compile time.
- **JWT in localStorage**: `onex_auth_token` + `onex_auth_user` keys. Token is sent as `Authorization: Bearer <token>`.
- **bcrypt cost factor 12**: Strong enough for production; `bcryptjs` (pure JS) is used to avoid native module bundling issues.
- **outDir = dist (not dist/public)**: Vercel's outputDirectory expects `artifacts/unihub/dist`; the nested `dist/public` path was causing "No Output Directory" errors.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-server run build` before deploying — it generates `dist/app.mjs` which the Vercel function imports.
- `DATABASE_URL` must be set in Vercel env vars or the API will throw on first request.
- `SESSION_SECRET` should be a long random string in production.
- Do NOT use `dist/public` as the Vite outDir — it breaks Vercel's output detection.
