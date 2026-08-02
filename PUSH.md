# How to Push to GitHub

The remote is already configured. Just run these commands in the **Replit Shell** (`>_`).

## Push to omexglobal (main repo)

```bash
git push origin main
```

When prompted:
- **Username:** your GitHub username
- **Password:** a Personal Access Token (NOT your password)
  → Create one at https://github.com/settings/tokens
  → New token (classic) → check `repo` → Generate

## Commits that will be pushed

| Commit | Description |
|--------|-------------|
| `3b3e4e7` | feat: profile picture upload in settings |
| `2db90f9` | fix: add db schema push to Vercel build command |
| `af0e866` | docs: update replit.md |
| `61a92ff` | fix: Vercel deployment, output directory, and auth reliability |

## Git remotes

| Name | URL |
|------|-----|
| `origin` | https://github.com/nexoralearning/omexglobal.git |
| `onexglobal` | https://github.com/nexoralearning/omexglobal.git |

---

# Vercel Setup

## 1. Import the repo

Go to https://vercel.com/new → Import `nexoralearning/omexglobal`

Vercel auto-detects `vercel.json` — no framework to pick.

## 2. Required environment variables

Set these in **Vercel → Project → Settings → Environment Variables** before deploying:

| Variable | Example / Notes |
|----------|-----------------|
| `DATABASE_URL` | `postgres://user:pass@host/dbname` — get from Neon, Supabase, or Railway |
| `SESSION_SECRET` | Long random string — run `openssl rand -base64 32` to generate |

> ⚠️ The build will run `drizzle-kit push` to create the `users` table automatically.
> If `DATABASE_URL` is not set, that step is skipped (the API will error at runtime until you set it).

## 3. Vercel build settings (auto-configured via vercel.json)

| Setting | Value |
|---------|-------|
| Install command | `pnpm install --no-frozen-lockfile` |
| Build command | `pnpm --filter @workspace/api-server run build && pnpm --filter @workspace/unihub run build` |
| Output directory | `artifacts/unihub/dist` |
| Node.js version | 22.x |

## 4. API routes

All `/api/*` requests are handled by `api/[...slug].ts` — a Vercel serverless function
that imports the pre-built Express bundle (`artifacts/api-server/dist/app.mjs`).

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Login |
| `/api/auth/me` | GET | Get current user (requires `Authorization: Bearer <token>`) |
| `/api/auth/profile` | PATCH | Update profile + avatar (requires auth) |

## 5. After first deploy

If the `users` table doesn't exist, run this once from your local machine or
any environment that has `DATABASE_URL` set:

```bash
pnpm --filter @workspace/db run push
```
