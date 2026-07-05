# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

This is the frontend for SKLPS Business Directory — a React + Vite SPA. The backend lives in a
sibling repo at `../server` (Express + Prisma + PostgreSQL); see its own `CLAUDE.md` for API details.
The two are separate git repositories, not a monorepo/workspace, even though they're developed together.

## Commands

```bash
pnpm dev              # start Vite dev server
pnpm build            # tsc -b (typecheck) + vite build
pnpm preview          # preview the production build
pnpm lint             # biome check .
pnpm lint:fix         # biome check --write .
```

There is no test runner configured in this project.

Requires a running instance of the server (see `../server`) at the URL configured via
`VITE_API_URL` (defaults to `http://localhost:5000/api`, see `src/config/env.ts`).

## Architecture

**Module-per-feature, not layer-per-type.** Code under `src/modules/<feature>/` bundles a feature's
pages, components, and API calls together (e.g. `modules/business/business.service.ts` +
`business-card.tsx` + `business-detail-page.tsx`). When adding a feature, follow this grouping
instead of splitting into global `pages/`, `components/`, `services/` directories.

**Three independent auth domains, each with its own layout guard:**
- Public site (`MainLayout`) — home, directory, jobs, add-business — no auth.
- Admin (`AdminLayout` + `modules/auth/auth-context.tsx`, `useAuth()`) — token key `token` in
  `localStorage`, guarded by an effect that redirects to `/admin/login` if no admin/token.
- Business owner (`BusinessLayout` + `modules/auth/business-auth-context.tsx`) — token key
  `businessToken`, separate context/provider from admin auth.

Both contexts wrap the relevant router subtree (not the whole app), and both follow the same
pattern: hold `token`/`entity` state initialized from `localStorage`, verify against a `/me`-style
endpoint on mount, expose `login`/`logout`. When adding a new protected area, prefer reusing one of
these two contexts rather than inventing a third.

**Routing** is centralized in `src/routes/index.tsx` using `createBrowserRouter` with three route
trees (`/`, `/admin`, `/business-dashboard`) each wrapped in their layout, plus a standalone
`/business-login`. Every page component is lazy-loaded via `lazy()` and wrapped with the shared
`wrap()` helper (`Suspense` + `PageSpinner`). New pages should follow this lazy + wrap pattern.

**API access** is a thin, hand-written client, not a generated one:
- `src/services/api-client.ts` — one axios instance; its request interceptor auto-attaches
  `Authorization: Bearer <token>`, preferring `businessToken` over the admin `token` if both are set.
- `src/services/api-endpoints.ts` — a single `API_ENDPOINTS` map of path strings/builders; add new
  routes here rather than inlining URL strings in service files.
- Per-feature `*.service.ts` files (e.g. `business.service.ts`, `jobs.service.ts`) wrap `api` calls
  and return `r.data` directly — components call the service, never `api`/axios directly.

**Path alias**: `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`) — use
it instead of relative `../../` imports.

**UI components**: shadcn/ui (`components.json`, style "new-york") on top of Radix primitives and
Tailwind, generated into `src/components/ui/`. Use the shadcn CLI / existing primitives rather than
hand-rolling new base components; feature-specific composites live in the owning `modules/` folder.

**Formatting/linting**: Biome (not ESLint/Prettier) — double quotes, semicolons, 100-char lines.
Run `pnpm lint:fix` before considering frontend work done.

Note: `Dockerfile` in this directory references a Next.js build output (`.next`, `pnpm-workspace.yaml`)
and does not match this Vite-based app — treat it as stale/unused rather than as architecture reference.
