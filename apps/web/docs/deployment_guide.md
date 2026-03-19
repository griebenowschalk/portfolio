# Deployment guide (apps/web)

Reference for deploying the frontend. Env details: see `example_env.md`.

---

## Before deploying

- Backend API must be deployed and reachable. Set `NEXT_PUBLIC_API_URL` to that API’s base URL (no trailing slash).
- This app depends on `@portfolio/shared` via `file:../../packages/shared`. The **full monorepo** must be in the deploy context (clone the whole repo; you can set “root directory” to `apps/web`). On install, npm will resolve the shared package from `../../packages/shared` and run its `prepare` script to build `dist/`. No extra build step needed for shared.
- Ensure the API’s `FRONTEND_URL` (CORS) is set to the URL where this frontend will be served.

---

## Railway

- New service from GitHub.
- Set **Root Directory** to the **repo root** (so workspace + shared package install works).
- Build command: `npm run build:web`
- Start command: `npm run start:web`
- Add env var: `NEXT_PUBLIC_API_URL` = your deployed API URL (e.g. `https://your-api.railway.app`).
- Optional: add a custom domain in project settings.

---

## Vercel

- New project from GitHub; set root directory to this app (e.g. `apps/web`). The repo is cloned in full so `file:../../packages/shared` resolves.
- Add environment variable: `NEXT_PUBLIC_API_URL` = your deployed API URL.
- Deploy (push to linked branch). Build and start commands are inferred from `package.json`.
- Optional: add a custom domain in project settings.

---

## Netlify

- New site from Git; configure Netlify with the monorepo:
  - **Base directory:** `.`
  - **Package directory:** `apps/web`
- Netlify will use `apps/web/netlify.toml` for the build (command + publish).
- Add env var: `NEXT_PUBLIC_API_URL` = your deployed API URL.

---

## Docker (production-style)

- Use a Dockerfile that runs `npm run build` and `npm start` (or use an official Next.js image).
- Pass `NEXT_PUBLIC_API_URL` at build time (required for Next.js public env).
- Ensure the container can reach the API at runtime.

---

## After going live

- Open the site and confirm Projects, Skills, and Experience sections load data from the API.
- If you see “Unable to load …”, check CORS (`FRONTEND_URL` on the API), network tab for failed requests, and that `NEXT_PUBLIC_API_URL` is correct.
