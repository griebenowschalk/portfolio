# Portfolio frontend (apps/web)

Next.js frontend for the portfolio. Projects, skills, and experience are loaded from the backend API (apps/api) via SWR + Axios. About, questions, and navbar data remain in static files.

**Reference (this app):**

- **`docs/example_env.md`** – Environment variables (`NEXT_PUBLIC_API_URL`, loading order).
- **`docs/deployment_guide.md`** – Deployment (Vercel, Netlify, Docker).
- **`docs/testing.md`** – How tests work and how to mock API hooks.
- **`docs/ARCHITECTURE.md`** – Data flow, API client, SWR hooks, mappers, shared types.

---

## Features

- Responsive layout; dark/light theme with persistent preference
- Framer Motion animations; loading screen
- Scroll-based navigation with auto-highlight
- Project showcase with tag filtering (data from API)
- Skills and experience sections (data from API)
- Static about-me, Q&A, and navbar content

## Stack

- Next.js (App Router), React, TypeScript, Tailwind CSS
- Framer Motion, Radix UI, Remix Icons
- SWR + Axios for API data; shared types from `@portfolio/shared`

## Project structure

```
src/
├── app/           # App Router (layout, page, globals)
├── components/    # UI (common + ui)
├── data/          # Static data (navbar, filter labels, about, questions)
├── hooks/         # useProjects, useSkills, useExperience (SWR)
├── lib/           # api-client, api fetchers, mappers (re-exports shared types)
├── types/         # Frontend UI types (ProjectsData, SkillsData, ExperienceData)
└── __tests__/     # Vitest + React Testing Library
```

## Quick start (development)

From repo root:

```bash
cd apps/web
cp .env.development.example .env.development
# Set NEXT_PUBLIC_API_URL=http://localhost:5002

npm install
npm run dev
```

Frontend: http://localhost:3000. Run the API (e.g. `npm run dev:api` from root) so Projects, Skills, and Experience load.

## Env

- **Local:** `.env.development` or `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5002`.
- **Production:** Set `NEXT_PUBLIC_API_URL` in the host (Vercel, Netlify, etc.). Do not commit env files.

See **`docs/example_env.md`** for the full list.

## Scripts (from repo root or apps/web)

- `npm run dev` – Next.js dev server
- `npm run build` – production build
- `npm run start` – production server (after build)
- `npm run test` – Vitest once
- `npm run test:watch` – Vitest watch
- `npm run coverage` – coverage report

## Testing

Component tests mock the API hooks with static data; no backend required. See **`docs/testing.md`**.

## Customization

- **From API:** Projects, skills, experience – edit via API/admin or seed data in `apps/api`.
- **Static (this app):** About text (`src/data/about-me.ts`), Q&A (`src/data/questions.ts`), navbar and project filter labels (`src/data/navbar.ts`, `src/data/projects.ts`).

## Responsive breakpoints

- Mobile: &lt; 640px
- Tablet: 640px–768px
- Desktop: 768px–1024px
- Large: &gt; 1024px

## Key components

- **Hero** – Landing and intro
- **About** – Static about-me content
- **Experience** – Timeline from API
- **Skills** – Skills from API
- **Projects** – Filterable gallery from API
- **Questions** – Static Q&A
- **Navbar** – Navigation with scroll-based highlight
