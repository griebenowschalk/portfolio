# Portfolio monorepo

Monorepo: Next.js frontend, CMS API, and shared types. Frontend reads projects, skills, and experience from the API; shared package keeps the API contract in one place.

## Structure

- **apps/web** – Next.js frontend (App Router). Data via SWR + Axios from the API. See [apps/web/README.md](apps/web/README.md).
- **apps/api** – Express API (MongoDB, JWT, S3). Serves projects, skills, experience; admin-only writes. See [apps/api/README.md](apps/api/README.md).
- **packages/shared** – Shared TypeScript types for the API contract (`ApiProject`, `ApiSkill`, `ApiExperience`, response envelopes). Used by both API and web.

## Getting started

From repo root:

```bash
npm install
```

**Run locally (full stack):**

1. **API:** `cd apps/api`, copy `.env.development.example` to `.env.development`, set `MONGODB_URI` and other vars (see `apps/api/docs/example_env.md`). Then from root: `npm run dev:api`. API at http://localhost:5002 (or `PORT` in env).
2. **Web:** In `apps/web`, copy `.env.development.example` to `.env.development`, set `NEXT_PUBLIC_API_URL=http://localhost:5002`. From root: `npm run dev`. Frontend at http://localhost:3000.
3. **Seed (once):** With API and MongoDB up, from root: `npm run seed:api`.

**Build shared types (if needed):** From root, `npm run build -w @portfolio/shared`. Web and API depend on the built `dist/` in `packages/shared`.

## Scripts (from root)

- `npm run dev` / `npm run dev:web` – start frontend
- `npm run dev:api` – start API
- `npm run build` / `npm run build:web` – build frontend
- `npm run build:api` – build API
- `npm run seed:api` – seed DB (admin + sample data)
- `npm run test` / `npm run test:web` – frontend tests
- `npm run coverage` – frontend coverage

## Testing

- **Frontend:** Unit tests in `apps/web` (Vitest + React Testing Library). API hooks are mocked; no backend required. See [apps/web/docs/testing.md](apps/web/docs/testing.md).
- **Full stack:** Start API and web as above. Use Postman or curl for API (e.g. `/health`, `GET /api/v1/projects`). Frontend will load data from the API when `NEXT_PUBLIC_API_URL` points at it.

## Docs

- [apps/web/README.md](apps/web/README.md) – frontend quick start, env, scripts, links to web docs
- [apps/api/README.md](apps/api/README.md) – API quick start, env, Docker, deploy, links to api docs
- [packages/shared/README.md](packages/shared/README.md) – shared types and usage
