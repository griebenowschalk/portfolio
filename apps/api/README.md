# Portfolio CMS API (apps/api)

Backend API for the portfolio. Copy full implementation from **`docs/CODE_CONTEXT.md`** and follow **`docs/IMPLEMENTATION_GUIDE.md`**.

## Environment variables

Copy `apps/api/.env.example` to `apps/api/.env` and set the following.

### Required (local and deploy)

| Variable | Description | Local example | Deploy example |
|----------|-------------|---------------|-----------------|
| `MONGODB_URI` | MongoDB connection string (must be valid URL) | `mongodb://localhost:27017/portfolio` | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` | `https://sgriebenowdev.online` |
| `AWS_ACCESS_KEY_ID` | AWS IAM key | (same or dev key) | IAM key with S3 + CloudFront access |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret | (same or dev key) | — |
| `AWS_REGION` | AWS region | e.g. `eu-west-1` | — |
| `AWS_BUCKET_NAME` | S3 bucket for uploads | e.g. `my-portfolio-assets` | — |
| `JWT_SECRET` | Access token signing secret | Min 32 chars | **Strong random secret (min 32)** |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | Min 32 chars | **Strong random secret (min 32)** |
| `ADMIN_EMAIL` | Admin login email | any email | Production admin email |
| `ADMIN_PASSWORD` | Admin login password | Min 8 chars | **Strong password** |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `PORT` | `5000` | Server port |
| `JWT_EXPIRE` | `7d` | Access token TTL |
| `JWT_REFRESH_EXPIRE` | `30d` | Refresh token TTL |
| `CLOUDFRONT_URL` | — | Full URL, e.g. `https://d123.cloudfront.net` (for asset URLs) |
| `LOG_LEVEL` | `info` | Log level |

**Local-only:** Use `MONGODB_URI=mongodb://localhost:27017/portfolio` when running MongoDB via Docker or locally. Seed with `MONGODB_URI=mongodb://localhost:27017/portfolio npm run seed` from `apps/api` to avoid seeding Atlas.

**Deploy:** Set `NODE_ENV=production`, `FRONTEND_URL` to your production frontend origin, and use strong unique values for `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `ADMIN_PASSWORD`. Do not commit `.env`; set these in your host’s env or secrets (e.g. Railway, Render, Fly.io).

## Quick start

```bash
# From repo root
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env (see Environment variables above)

npm install
npm run dev:api
```

- API: http://localhost:5002 (or whatever `PORT` is in `.env`, default 5000)
- Health: http://localhost:5002/health
- **API docs (Swagger UI):** http://localhost:5002/api-docs  
- **OpenAPI spec (JSON):** http://localhost:5002/api-docs/openapi.json — use this URL in Postman: **Import → Link** to get an auto-updated collection.

## Scripts (from root)

- `npm run dev:api` – run API in dev
- `npm run build:api` – build API
- `npm run seed:api` – seed local DB (from repo root) or `cd apps/api && npm run seed`

## Docker (dev)

From `apps/api`:

```bash
docker compose up --build
```

- API: http://localhost:5002
- MongoDB: localhost:27017 (MONGODB_URI=mongodb://mongodb:27017/portfolio inside the API container)
- Source is mounted; code changes restart via nodemon.

To override env (e.g. JWT secrets), add a `.env` in `apps/api` or set in `docker-compose.yml`.

## Check backend & MongoDB / Inspect DB

**1. Backend running**

```bash
curl http://localhost:5002/health   # or whatever PORT is in .env
```

Expected: `{"status":"healthy","timestamp":"...","uptime":...}`

**2. MongoDB running (Docker)**

Containers: `docker ps` — you should see `api-api-1` and `api-mongodb-1` (or similar).  
MongoDB is reachable on host at `localhost:27017` (same port as in compose).

**3. What’s in the local DB**

With MongoDB on `localhost:27017` (Docker or local):

```bash
mongosh "mongodb://localhost:27017/portfolio" --eval "
  db.getCollectionNames();
  db.users.countDocuments();
  db.projects.countDocuments();
  db.skills.countDocuments();
  db.experiences.countDocuments();
"
```

Or open the same URI in [MongoDB Compass](https://www.mongodb.com/products/compass) and browse collections: `users`, `projects`, `skills`, `experiences`.

If the API runs in Docker but you’re on the host, use `localhost:27017`. If you run mongosh inside the API container, use `mongodb://mongodb:27017/portfolio`.

**4. Seed local DB**

From `apps/api` (with MongoDB running and `MONGODB_URI` in `.env` pointing at it, e.g. `mongodb://localhost:27017/portfolio` when using Docker):

```bash
npm run seed
```

Creates admin user (from `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`) and inserts projects, skills, and experiences from **`src/seed-data/`** (projects.ts, skills.ts, experience.ts). These files are the central copy for local dev; keep in sync with `apps/web/src/data/` if you edit there.

## CORS

Only `FRONTEND_URL` (your domain) and localhost are allowed. Set `FRONTEND_URL=https://sgriebenowdev.online` in production.
