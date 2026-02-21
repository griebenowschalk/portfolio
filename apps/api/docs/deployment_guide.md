# Deployment guide

Reference for deploying this API. Env details: see `example_env.md` and the `.env.example` / `.env.development.example` files in the repo.

---

## Before deploying

- Have: MongoDB (e.g. Atlas), AWS (S3, IAM keys), and a host account (Railway, Render, or a VPS).
- From repo root: run the API build (e.g. `npm run build:api` or build from `apps/api`). Fix any build errors before deploying.
- Set all required env vars (see `docs/example_env.md`). Use strong, unique JWT and admin secrets in production.

---

## Railway

- New project from GitHub; set root directory to this API app (e.g. `apps/api`).
- Add every required (and any optional) env var in the Variables tab. Set `NODE_ENV=production` and the correct `FRONTEND_URL`.
- Deploy (e.g. push to the linked branch). Build and start commands are inferred or set in `railway.json` if present.
- After the first successful deploy, run the seed once (one-off command: `npm run seed`) so the admin user and seed data exist. Same Variables as the service; ensure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, and `MONGODB_URI` are set.
- Optional: add a Redis service and set `REDIS_URL` if the app uses it. Optional: attach a custom domain in settings.

---

## Render

- New Web Service; connect the repo and set root directory to this API app.
- Set build command (e.g. `npm install && npm run build`) and start command (e.g. `npm start`).
- Add all required env vars in the dashboard. Set `NODE_ENV=production` and `FRONTEND_URL`.
- Deploy. After first deploy, run seed once (e.g. via shell or one-off) with the same env so the admin exists.
- Optional: add a Redis instance and set `REDIS_URL`.

---

## Docker (production-style)

- Use the Dockerfile in the repo to build the image. Use `docker-compose.yml` for local dev; for production, run the built image with env supplied via host or a non-committed env file.
- Ensure `NODE_ENV=production` and all required env vars are set. Expose the app port (e.g. 5000). Run seed once against the same DB if this is a fresh deployment.

---

## VPS (e.g. EC2 or similar)

- Install Node (LTS) and any system dependencies. Clone the repo (or deploy the built artifact) into the API app directory.
- Create a non-committed `.env` (or use another mechanism) with all required production env vars.
- Install dependencies, build (e.g. `npm run build`), and start (e.g. `node dist/server.js`). Use a process manager (e.g. PM2) and configure it to start on boot.
- Put a reverse proxy (e.g. Nginx) in front of the app; proxy to the port the API listens on. Configure TLS (e.g. Let’s Encrypt) for the API hostname.
- Open only the ports you need (e.g. 22, 80, 443). Run seed once against the production DB so the admin user exists.

---

## After going live

- Confirm health endpoint responds (e.g. `/health`).
- Log in with the seeded admin (e.g. via `POST /api/v1/auth/login`) and confirm protected routes work with the returned token.
- Keep env and secrets only in the host dashboard or a secure, non-committed file. Do not commit `.env` or `.env.development`.
