# @portfolio/shared

Shared types for the portfolio monorepo. Defines the **API contract**: request/response shapes for projects, skills, and experience so backend and frontend stay in sync.

## Contents

- **`ApiListResponse<T>`, `ApiItemResponse<T>`** – Response envelopes for list and single-item endpoints.
- **`ApiProject`, `ApiSkill`, `ApiExperience`** – Plain JSON shapes as returned by the API (no Mongoose/DB specifics).

## Usage

- **apps/api** – Type controller responses and ensure res.json() matches these types. Mongoose `.lean()` returns objects with `_id: ObjectId`; when serialized to JSON, `_id` becomes a string.
- **apps/web** – Import in fetchers, mappers, and hooks. Frontend UI types (e.g. `ProjectsData`) remain in `apps/web/src/types` and are derived from these via mappers.

## Build

From repo root or this directory:

```bash
npm run build
```

Output: `dist/` (JS + `.d.ts`). Consuming apps resolve `@portfolio/shared` via the workspace.
