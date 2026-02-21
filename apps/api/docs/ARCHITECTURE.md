# Backend architecture (apps/api)

High-level reference for the Express portfolio API and how it fits into the monorepo.

---

## Stack

- **Node.js**, **Express**, **TypeScript**
- **DB:** MongoDB (Mongoose)
- **Auth:** JWT (access + refresh), optional Redis for token store
- **Storage:** AWS S3 (uploads); optional CloudFront for assets
- **Docs:** OpenAPI (Swagger) at `/api-docs`, JSON at `/api-docs/openapi.json`
- **Shared types:** `@portfolio/shared` (packages/shared) – API response shapes; use in controllers so responses match the contract.

---

## Directory layout

```
apps/api/
├── src/
│   ├── config/          # env validation, config
│   ├── controllers/     # auth, projects, skills, experience
│   ├── middleware/      # auth, error handler, rate limit, validation
│   ├── models/          # Mongoose: Project, Skill, Experience, User
│   ├── routes/          # Mounted under /api/v1
│   ├── services/        # e.g. S3
│   ├── utils/           # logger, etc.
│   ├── app.ts           # Express app, middleware, routes
│   ├── server.ts        # Start server
│   └── openapi.ts       # OpenAPI spec for Swagger
├── docs/                # example_env, deployment_guide, ARCHITECTURE
└── docker-compose.yml   # Local dev (API + MongoDB)
```

---

## API surface

- **Base path:** `/api/v1`
- **Public (no auth):**
  - `GET /projects` – list (pagination, filter by category, featured)
  - `GET /projects/:slug` – single project by slug
  - `GET /skills` – list (filter by category, isActive)
  - `GET /skills/:id` – single skill
  - `GET /experience` – list
  - `GET /experience/:id` – single experience
  - `POST /auth/login` – login (email/password), returns tokens
- **Protected (Bearer JWT):**
  - `GET /auth/me`, `POST /auth/logout`
  - `POST /auth/register` (admin only)
  - `POST/PUT/DELETE` for projects, skills, experience (admin)

---

## Data flow

1. **Env** – `config/env.ts` validates required vars (MongoDB, AWS, JWT secrets, `FRONTEND_URL`, admin credentials for seed).
2. **CORS** – Only origin in `FRONTEND_URL` (and common localhost variants) allowed.
3. **Rate limiting** – Applied to `/api/` routes.
4. **Routes** – Controllers use Mongoose models; respond with `{ success, data }` or `{ success, data, pagination }` for lists.
5. **Errors** – Central `errorHandler` middleware returns consistent JSON.

---

## Models (summary)

- **Project:** title, slug, description, fullDescription, category, technologies, status, images[], links{}, order, etc.
- **Skill:** name, category, proficiency, icon{}, description, link, order, isActive.
- **Experience:** type (job|education), company, education, position, startDate, endDate, description, achievements[], order.

---

## Frontend contract

- Frontend (apps/web) calls `GET /api/v1/projects`, `/skills`, `/experience` and maps responses to its UI types via mappers. CORS must allow the frontend origin (`FRONTEND_URL`).

---

## Env and deployment

- **Development:** `.env.development` (see `docs/example_env.md`). Seed with `npm run seed` after DB is up.
- **Production:** Set all required vars in host (Railway, Render, VPS); run seed once after first deploy. See `docs/deployment_guide.md`.

---

## Future extensions

- **Redis:** Optional `REDIS_URL` for refresh token store or rate-limit state.
- **Pagination:** Projects already support `page` and `limit`; frontend can adopt for large lists.
- **Uploads:** S3 and optional CloudFront; ensure `CLOUDFRONT_URL` and CORS on bucket if frontend uploads directly.
