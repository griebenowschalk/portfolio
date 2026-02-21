# Frontend architecture (apps/web)

High-level reference for the Next.js portfolio frontend and how it fits into the monorepo.

---

## Stack

- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **Styling:** Tailwind CSS
- **Data:** SWR + Axios; backend API at `NEXT_PUBLIC_API_URL`
- **Shared types:** `@portfolio/shared` (packages/shared) – API response shapes used by both API and web

---

## Directory layout

```
apps/web/
├── src/
│   ├── app/              # App Router routes, layout, page
│   ├── components/       # UI components (Projects, Skills, Experience, etc.)
│   ├── data/            # Static data (navbar, filter labels, fallback/legacy)
│   ├── hooks/           # useProjects, useSkills, useExperience (SWR)
│   ├── lib/             # api-client, api fetchers, mappers, api-types
│   ├── types/           # Frontend types (ProjectsData, SkillsData, ExperienceData)
│   └── __tests__/       # Vitest + RTL component tests
├── docs/                # example_env, deployment_guide, testing, ARCHITECTURE
├── public/              # Static assets (images, etc.)
└── next.config.ts
```

---

## Data flow

1. **API base URL**  
   Set via `NEXT_PUBLIC_API_URL` (dev: `http://localhost:5002`, prod: deployed API).

2. **Client**  
   `src/lib/api-client.ts` – Axios instance with `baseURL`, timeout, credentials. Used only by fetchers.

3. **Fetchers**  
   `src/lib/api.ts` – Typed functions: `fetchProjects`, `fetchSkills`, `fetchExperience`. Use types from `@portfolio/shared`; return backend envelope `{ success, data, pagination? }`.

4. **Mappers**  
   `src/lib/mappers.ts` – Map API shapes to frontend types:
   - `ApiProject` → `ProjectsData` (title→name, images[0]→image, technologies→tags, status→inProgress, links→link)
   - `ApiSkill` → `SkillsData` (icon.url→image)
   - `ApiExperience` → `ExperienceData` (position→title, startDate→year, achievements→experience)

5. **SWR hooks**  
   `src/hooks/useProjects.ts`, `useSkills.ts`, `useExperience.ts` – Call fetchers, run mappers, expose `{ projects|skills|experience, isLoading, isError, error, mutate }`. Cache key is a constant per resource; deduping and revalidate options set in the hook.

6. **Components**  
   `Projects`, `Skills`, `Experience` use the hooks; show loading/error states; render lists. Filter buttons for projects remain from `data/projects` (projectsButtons).

---

## Backend contract

- **Base path:** `{NEXT_PUBLIC_API_URL}/api/v1`
- **Endpoints used:**
  - `GET /projects` – list (query: `limit`, optional `page`, `category`, `featured`)
  - `GET /skills` – list (query: optional `category`, `isActive`)
  - `GET /experience` – list
- **Response:** `{ success: true, data: T[] }` or projects with `pagination`.
- **CORS:** Backend must allow the frontend origin (`FRONTEND_URL` on API).

---

## Env and deployment

- **Development:** `.env.development` or `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5002`.
- **Production:** Set `NEXT_PUBLIC_API_URL` in host (Vercel, Netlify, etc.). Only `NEXT_PUBLIC_*` vars are available in the browser.
- See `docs/example_env.md` and `docs/deployment_guide.md`.

---

## Testing

- Component tests mock `useProjects`, `useSkills`, `useExperience` with static data from `src/data/*` so no API is called.
- See `docs/testing.md`.

---

## Future extensions

- **Auth:** If the API adds protected routes for the frontend, add a small auth context and pass a token in `api-client` interceptors.
- **Images:** Project/skill images may come from S3/CloudFront. Add those hostnames to `next.config.ts` `images.remotePatterns` (or use `unoptimized` for external URLs).
- **SSR/SSG:** For SEO, consider fetching projects/experience in a server component or `getStaticProps` and passing into client components, while still using SWR on the client for revalidation.
