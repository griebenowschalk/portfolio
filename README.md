# Portfolio monorepo

[![CI](https://github.com/griebenowschalk/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/griebenowschalk/portfolio/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/griebenowschalk/portfolio/badge.svg?branch=main)](https://codecov.io/gh/griebenowschalk/portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)

Monorepo: Next.js frontend, CMS API, and shared types. Frontend reads projects, skills, and experience from the API; shared package keeps the API contract in one place.

## Structure

- **apps/web** – Next.js frontend (App Router). Data via SWR + Axios from the API. See [apps/web/README.md](apps/web/README.md).
- **apps/api** – Express API (MongoDB, JWT, S3). Serves projects, skills, experience; admin-only writes. See [apps/api/README.md](apps/api/README.md).
- **apps/cms** – Vite React admin for managing projects, skills, and experience. Uses the API for data and JWT auth. See [apps/cms/README.md](apps/cms/README.md).
- **packages/shared** – Shared TypeScript types for the API contract (`ApiProject`, `ApiSkill`, `ApiExperience`, response envelopes). Used by both API and web.

## Getting started

From repo root:

```bash
npm install
```

**Run locally (full stack):**

1. **API:** `cd apps/api`, copy `.env.development.example` to `.env.development`, set `MONGODB_URI` and other vars (see `apps/api/docs/example_env.md`). Then from root: `npm run dev:api`. API at http://localhost:5002 (or `PORT` in env).
2. **Web:** In `apps/web`, copy `.env.development.example` to `.env.development`, set `NEXT_PUBLIC_API_URL=http://localhost:5002`. From root: `npm run dev`. Frontend at http://localhost:3000.
3. **Seed (once):** With API and MongoDB up, from root: `npm run seed:api`. (creates the initial admin + sample data)
4. **CMS:** From repo root: `npm run dev:cms`. CMS at http://localhost:5173.

**Build shared types (if needed):** From root, `npm run build:shared`. Web and API depend on the built `dist/` in `packages/shared`.

## Scripts (from root)

- `npm run dev` / `npm run dev:web` – start frontend
- `npm run dev:api` – start API
- `npm run dev:cms` – start CMS admin
- `npm run build` / `npm run build:web` – build frontend
- `npm run build:api` – build API
- `npm run build:cms` – build CMS admin
- `npm run seed:api` – seed DB (admin + sample data)
- `npm run test` / `npm run test:web` – frontend tests
- `npm run coverage` – frontend coverage

## Testing

- **Frontend:** Unit tests in `apps/web` (Vitest + React Testing Library). API hooks are mocked; no backend required. See [apps/web/docs/testing.md](apps/web/docs/testing.md).
- **Full stack:** Start API and web as above. Use Postman or curl for API (e.g. `/health`, `GET /api/v1/projects`). Frontend will load data from the API when `NEXT_PUBLIC_API_URL` points at it.

## Docs

- [apps/web/README.md](apps/web/README.md) – frontend quick start, env, scripts, links to web docs
- [apps/api/README.md](apps/api/README.md) – API quick start, env, Docker, deploy, links to api docs
- [apps/cms/README.md](apps/cms/README.md) – CMS admin quick start, env, scripts
- [packages/shared/README.md](packages/shared/README.md) – shared types and usage
