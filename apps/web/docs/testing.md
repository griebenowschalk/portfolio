# Testing (apps/web)

## Stack

- **Vitest** – test runner
- **React Testing Library** – component tests

## Commands (from repo root or `apps/web`)

- `npm run test` – run tests once
- `npm run test:watch` – watch mode
- `npm run coverage` – coverage report

## Patterns

- **Data hooks (useProjects, useSkills, useExperience):** Mocked in tests via `vi.mock('@/hooks/useProjects', …)` so tests don’t hit the real API. Tests use the static data from `@/data/projects`, `@/data/skills`, `@/data/experience` to keep assertions stable.
- **API client:** Not called during component tests. For integration or E2E tests, use a real backend or MSW to mock `src/lib/api-client` or the fetchers in `src/lib/api.ts`.

## Running tests with API

To test against a live API (e.g. local backend), run the API first (`npm run dev:api` from repo root), set `NEXT_PUBLIC_API_URL` if needed, then run tests. Component tests will still use mocks unless you remove or override the hook mocks.

## Adding tests for API-backed components

- Keep mocking the hooks when testing UI behavior (filters, click, loading/error states).
- To test loading state: mock `useProjects` with `isLoading: true` and assert on “Loading projects…” (or equivalent).
- To test error state: mock with `isError: true` and assert on “Unable to load projects.” (or equivalent).
