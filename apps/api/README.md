# Portfolio CMS API (apps/api)

Backend API for the portfolio. Copy full implementation from **`docs/CODE_CONTEXT.md`** and follow **`docs/IMPLEMENTATION_GUIDE.md`**.

## Quick start

```bash
# From repo root
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env (MongoDB, AWS, JWT, FRONTEND_URL)

npm install
npm run dev:api
```

- API: http://localhost:5000
- Health: http://localhost:5000/health

## Scripts (from root)

- `npm run dev:api` – run API in dev
- `npm run build:api` – build API
- `npm run seed:api` – seed database (after implementing seed script)

## Docker (dev)

From `apps/api`:

```bash
docker compose up --build
```

- API: http://localhost:5000
- MongoDB: localhost:27017 (MONGODB_URI=mongodb://mongodb:27017/portfolio inside the API container)
- Source is mounted; code changes restart via nodemon.

To override env (e.g. JWT secrets), add a `.env` in `apps/api` or set in `docker-compose.yml`.

## CORS

Only `FRONTEND_URL` (your domain) and localhost are allowed. Set `FRONTEND_URL=https://sgriebenowdev.online` in production.
