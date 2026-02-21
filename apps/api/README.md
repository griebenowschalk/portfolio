# Portfolio CMS API (apps/api)

Backend API for the portfolio. Copy full implementation from **`docs/CODE_CONTEXT.md`** and follow **`docs/IMPLEMENTATION_GUIDE.md`** (monorepo root docs).

**Reference (this app):**
- **`docs/example_env.md`** – All environment variables (required/optional, constraints, loading order).
- **`docs/deployment_guide.md`** – Deployment steps for Railway, Render, Docker, VPS; seed-after-deploy.
- **`docs/ARCHITECTURE.md`** – Backend architecture, routes, models, and frontend contract.

---

## Quick start (development)

From repo root:

```bash
cd apps/api && cp .env.development.example .env.development
# Edit .env.development (see docs/example_env.md)

npm install
npm run dev:api
```

- API: http://localhost:5002 (or `PORT` in `.env.development`)
- Health: http://localhost:5002/health
- API docs (Swagger): http://localhost:5002/api-docs
- OpenAPI (Postman): http://localhost:5002/api-docs/openapi.json → Import → Link

## Env (development vs production)

- **Local / Docker:** Use **`.env.development`**. App loads it when the file exists.
- **Production:** Set variables in the host dashboard; keep `.env` only as a local reference. Do not commit env files.

Full list and defaults: **`docs/example_env.md`**.

## Scripts (from repo root)

- `npm run dev:api` – run API in dev
- `npm run build:api` – build API
- `npm run seed:api` – seed DB (or `cd apps/api && npm run seed`)

## Docker (dev)

From `apps/api`:

```bash
cp .env.development.example .env.development
# For API in container: MONGODB_URI=mongodb://mongodb:27017/portfolio

docker compose up --build
```

API: http://localhost:5002. MongoDB: host `localhost:27017`. Compose uses `env_file: .env.development`.

## Check backend and seed

- Health: `curl http://localhost:5002/health` → `{"status":"healthy",...}`
- With MongoDB on `localhost:27017`: from `apps/api`, run `npm run seed`. Creates admin from `ADMIN_*` and seeds `src/seed-data/`. Use [MongoDB Compass](https://www.mongodb.com/products/compass) or `mongosh` on that URI to inspect.

## Postman

1. Import → Link → `http://localhost:5002/api-docs/openapi.json` (API running).
2. `POST /api/v1/auth/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
3. Set collection auth to Bearer and paste `data.token`; protected routes work.

## Deploy and production admin

Deployment steps: **`docs/deployment_guide.md`**.

After first deploy (e.g. Railway): run a one-off **`npm run seed`** with the same env as the service so the admin user and seed data exist. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `MONGODB_URI` in the host dashboard.

## CORS

Only the origin in `FRONTEND_URL` (and localhost) is allowed. Set `FRONTEND_URL` to your frontend origin in production.
