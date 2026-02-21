# Environment variables reference (apps/web)

Use `.env.development` or `.env.local` for local development. Do not commit env files. In production, set variables in your host dashboard (Vercel, Netlify, etc.).

Templates: `.env.development.example`, `.env.local.example`.

---

## Required (production)

| Variable            | Description          | Constraint / note                                                                                                         |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| NEXT_PUBLIC_API_URL | Backend API base URL | No trailing slash. Dev: `http://localhost:5002`. Production: your deployed API URL (e.g. `https://your-api.railway.app`). |

---

## Optional

| Variable | Description      | Default                                                                                                   |
| -------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| NODE_ENV | Environment mode | Set by framework. `development` when running `next dev`, `production` when building/running `next start`. |

---

## Loading order

Next.js loads env files in this order (later overrides earlier):

1. `.env`
2. `.env.local` (not committed)
3. `.env.development` / `.env.production` (depending on `next dev` vs `next build` + `next start`)
4. `.env.development.local` / `.env.production.local`

For local dev: copy `.env.development.example` to `.env.development` or `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:5002`.

For production: set `NEXT_PUBLIC_API_URL` in your host’s environment (Vercel, Netlify, etc.). Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
