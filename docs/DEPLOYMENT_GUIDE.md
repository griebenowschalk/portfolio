# Deployment Guide

> Full guide for running locally, deploying to production, and keeping everything alive.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Local Development](#local-development)
3. [Infrastructure Setup](#infrastructure-setup)
   - [MongoDB Atlas](#mongodb-atlas)
   - [AWS S3 + CloudFront](#aws-s3--cloudfront)
4. [Deploy API to Railway](#deploy-api-to-railway)
5. [Deploy Web to Vercel](#deploy-web-to-vercel)
6. [Deploy CMS to Netlify](#deploy-cms-to-netlify)
7. [Environment Variable Reference](#environment-variable-reference)
8. [CI/CD](#cicd)
9. [MongoDB Keep-Alive](#mongodb-keep-alive)
10. [Post-Deployment Checklist](#post-deployment-checklist)
11. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
apps/
  api/   Express API (Railway)         :5002  /api/v1/*
  web/   Next.js portfolio (Vercel)    :3000
  cms/   Vite React admin (Netlify)    :5173
packages/
  shared/ TypeScript types shared by api + web
```

**Data flow:** CMS writes via API (JWT) → MongoDB Atlas → API public reads → Web portfolio

**Images:** CMS upload → S3 → CloudFront CDN → displayed in Web

---

## Local Development

### Prerequisites

- Node.js 22+ (`node -v`)
- npm 10+ (`npm -v`)
- A MongoDB Atlas cluster (free M0 is fine)

### One-time setup

```bash
git clone <your-repo-url>
cd portfolio
bash scripts/setup-local.sh
```

The script: checks Node version, copies `.env` example files, installs all workspace deps, builds `@portfolio/shared`.

### Configure environment

Edit `apps/api/.env.development` — the only values you must fill in:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/portfolio
JWT_SECRET=<random-64-char-string>
JWT_REFRESH_SECRET=<different-random-64-char-string>
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Seed the database

```bash
npm run seed:api
```

### Start all three apps

```bash
# All in parallel (one terminal)
npm run dev:all

# Or individually
npm run dev:api    # http://localhost:5002
npm run dev:web    # http://localhost:3000
npm run dev:cms    # http://localhost:5173
```

Swagger API docs: http://localhost:5002/api-docs

---

## Infrastructure Setup

### MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → New Project → New Cluster → **M0 Free**
2. **Database Access** → Add user → Username/Password → role: `readWriteAnyDatabase`
3. **Network Access** → Add IP `0.0.0.0/0` (Railway uses dynamic IPs)
4. **Connect** → Drivers → copy the connection string:
   ```
   mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/portfolio
   ```

> **Free tier pausing:** Atlas M0 pauses after 60 days without activity. The API pings the DB every 24 hours automatically, and a GitHub Actions workflow pings the API every 3 days. See [MongoDB Keep-Alive](#mongodb-keep-alive).

---

### AWS S3 + CloudFront

Only required for image uploads. Skip if you don't need image hosting yet.

#### S3 Bucket

1. **S3** → Create bucket → region: `eu-west-1` → name: `sgriebenow-portfolio-assets`
2. Uncheck "Block all public access"
3. **CORS configuration:**
   ```json
   [{ "AllowedHeaders": ["*"], "AllowedMethods": ["GET","PUT","POST","DELETE"],
      "AllowedOrigins": ["https://your-cms.netlify.app","http://localhost:5173"] }]
   ```

#### CloudFront Distribution

1. **CloudFront** → Create distribution → Origin: your S3 bucket
2. Origin access → Origin access control (OAC) → create new OAC → apply bucket policy
3. Note the **Distribution domain name** (e.g. `d3fkfnugvrux85.cloudfront.net`)

#### IAM User

1. **IAM** → Create user `portfolio-api` → attach inline policy:
   ```json
   { "Version":"2012-10-17","Statement":[{"Effect":"Allow",
     "Action":["s3:PutObject","s3:DeleteObject","s3:GetObject"],
     "Resource":"arn:aws:s3:::sgriebenow-portfolio-assets/*"}] }
   ```
2. Create access key → save `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`

---

## Deploy API to Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Select repo → **Root directory:** `apps/api`
3. **Build command:** `npm install && npm run build`
4. **Start command:** `npm run start`

### Environment variables

Set all of these in the Railway dashboard under Variables:

```env
NODE_ENV=production
PORT=5002
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<64-char-random>
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=<64-char-random-different>
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=https://your-portfolio.vercel.app
CMS_URL=https://your-cms.netlify.app
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=sgriebenow-portfolio-assets
CLOUDFRONT_URL=https://d3fkfnugvrux85.cloudfront.net
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Schalk Griebenow
LOG_LEVEL=info
```

> `FRONTEND_URL` and `CMS_URL` control CORS. During initial setup use `http://localhost:3000` and `http://localhost:5173`, then update to production URLs once deployed.

### Seed the database

Railway dashboard → your service → **Shell** tab:
```bash
npm run seed
```

---

## Deploy Web to Vercel

1. [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. **Root directory:** `apps/web`
3. **Framework preset:** Next.js (auto-detected)

### Environment variables (Vercel → Settings → Environment Variables)

```env
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_CLOUDFRONT_URL=https://d3fkfnugvrux85.cloudfront.net
```

Vercel auto-deploys on every push to `main`.

---

## Deploy CMS to Netlify

1. [netlify.com](https://netlify.com) → New site → Import from GitHub
2. **Base directory:** `apps/cms`
3. **Build command:** `npm run build`
4. **Publish directory:** `apps/cms/dist`

### Environment variables (Netlify → Site settings → Environment variables)

```env
VITE_API_URL=https://your-api.railway.app
```

### SPA routing fix

Create `apps/cms/public/_redirects`:
```
/*  /index.html  200
```

Without this, refreshing any CMS route returns a 404.

---

## Environment Variable Reference

### apps/api

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | No | Default `5002` |
| `MONGODB_URI` | Yes | Full Atlas connection string |
| `JWT_SECRET` | Yes | Min 32 chars |
| `JWT_EXPIRE` | No | Default `7d` |
| `JWT_REFRESH_SECRET` | Yes | Different from `JWT_SECRET` |
| `JWT_REFRESH_EXPIRE` | No | Default `30d` |
| `FRONTEND_URL` | Yes | Web app URL (CORS) |
| `CMS_URL` | Yes | CMS app URL (CORS) |
| `AWS_ACCESS_KEY_ID` | Yes | IAM key |
| `AWS_SECRET_ACCESS_KEY` | Yes | IAM secret |
| `AWS_REGION` | Yes | e.g. `eu-west-1` |
| `AWS_BUCKET_NAME` | Yes | S3 bucket name |
| `CLOUDFRONT_URL` | No | CDN base URL |
| `ADMIN_EMAIL` | Yes | Seed: admin email |
| `ADMIN_PASSWORD` | Yes | Seed: admin password |
| `ADMIN_NAME` | No | Default `Admin User` |
| `LOG_LEVEL` | No | Default `info` |

### apps/web

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | API base URL, no trailing slash |
| `NEXT_PUBLIC_CLOUDFRONT_URL` | No | CloudFront CDN URL |

### apps/cms

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | Yes | API base URL, no trailing slash |

---

## CI/CD

### `ci.yml` — runs on push/PR to `main`

ESLint → Vitest tests + coverage → Next.js production build.

Requires `CODECOV_TOKEN` secret for coverage uploads (remove the Codecov step if unused).

### `keep-alive.yml` — runs every 3 days

See [MongoDB Keep-Alive](#mongodb-keep-alive). Requires `API_URL` repository variable set in GitHub.

---

## MongoDB Keep-Alive

Two layers prevent Atlas free-tier pausing and Railway container sleep:

### Layer 1 — Server-side scheduler (built-in, no config needed)

`apps/api/src/utils/dbKeepAlive.ts` pings MongoDB every **24 hours** automatically once the server connects. It uses `unref()` so it never prevents graceful shutdown.

### Layer 2 — GitHub Actions (`keep-alive.yml`)

Runs every **3 days** and hits four public API endpoints, creating real MongoDB reads across all collections. This also wakes sleeping Railway containers.

**One-time setup:**
1. GitHub repo → Settings → Secrets and variables → **Variables** tab (not Secrets)
2. New repository variable → Name: `API_URL` → Value: `https://your-api.railway.app`

Trigger manually anytime: GitHub → Actions → "MongoDB Keep-Alive" → Run workflow.

---

## Post-Deployment Checklist

- [ ] `https://your-api.railway.app/health` returns `{"status":"healthy"}`
- [ ] Seed run — admin can log in via CMS
- [ ] Projects, Skills, Experience load on the web portfolio
- [ ] Images uploaded via CMS appear via CloudFront on the web
- [ ] `FRONTEND_URL` + `CMS_URL` in Railway match real deployed URLs
- [ ] `NEXT_PUBLIC_API_URL` in Vercel points to Railway
- [ ] `VITE_API_URL` in Netlify points to Railway
- [ ] `API_URL` repository variable set in GitHub
- [ ] Admin password changed from seed default
- [ ] `apps/cms/public/_redirects` file committed

---

## Troubleshooting

**API won't start — "Invalid environment variables"**
Check Railway logs — `apps/api/src/config/env.ts` prints the exact missing variable on boot.

**CORS error in browser**
`FRONTEND_URL` or `CMS_URL` in Railway doesn't match the origin exactly (protocol, no trailing slash). Update Railway env vars and redeploy.

**Images not loading in production**
1. Set `NEXT_PUBLIC_CLOUDFRONT_URL` in Vercel
2. Set `CLOUDFRONT_URL` in Railway (used when API builds image URLs)
3. `next.config.ts` allows `*.cloudfront.net` by default

**MongoDB paused after long inactivity**
Run keep-alive manually: GitHub → Actions → "MongoDB Keep-Alive" → Run workflow.
Or resume from Atlas dashboard: your cluster → Resume.

**CMS returns 404 on page refresh**
Add `apps/cms/public/_redirects` with content `/*  /index.html  200`, commit, and redeploy.

**Shared package type errors after changes**
```bash
npm run build --workspace=packages/shared
```
