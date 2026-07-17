# Tripways Web Local Route Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a three-page responsive Next.js application that exercises the local Tripways Route Discovery RPC through a server-only boundary.

**Architecture:** Next.js App Router server components own route loading and call a server-only RPC client. Pure parsing and validation helpers are tested independently; feature components render home search, origin discovery, and route detail views without duplicating backend ranking or eligibility logic.

**Tech Stack:** Next.js App Router, React, TypeScript strict, Tailwind CSS 4, Vitest, pnpm.

---

## File map

- `docs/codex_work_rules.md`: repository workflow, scope, security, and verification rules.
- `package.json`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`: framework and quality configuration.
- `src/app/layout.tsx`, `src/app/globals.css`: shared metadata, font, tokens, and responsive base styles.
- `src/app/page.tsx`: home search page.
- `src/app/flights-from/[iata]/page.tsx`: origin discovery page.
- `src/app/routes/[from]/[to]/page.tsx`: route detail page.
- `src/components/layout/`: header, footer, and page shell.
- `src/components/search/`: airport search form and URL-backed filter toolbar.
- `src/components/routes/`: map visual, destination cards, airline summary, and itinerary details.
- `src/lib/airports.ts`: deterministic fixture airport registry and code validation.
- `src/lib/route-filters.ts`: URL search-parameter parser for supported RPC filters.
- `src/lib/route-discovery.ts`: server-only RPC client and envelope validation.
- `src/lib/*.test.ts`: pure helper and RPC-contract tests.

### Task 1: Repository foundation

**Files:** Create framework configuration, `.gitignore`, `.env.example`, `README.md`, and coding rules.

- [ ] Create a strict Next.js App Router package using current official packages:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

- [ ] Install `next@latest`, `react@latest`, `react-dom@latest`, Tailwind/PostCSS, ESLint, TypeScript, and Vitest with pnpm.
- [ ] Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env.example` without real secrets.
- [ ] Add coding rules requiring server-only secrets, SQL/RPC ownership, strict TypeScript, responsive verification, no automatic commit, and `implemented/skipped/add when` handoff.
- [ ] Run `pnpm typecheck`; expected result is exit 0 for the empty framework shell.

### Task 2: Airport registry and filter parser using TDD

**Files:** Create `src/lib/airports.ts`, `src/lib/route-filters.ts`, and their tests.

- [ ] Write RED tests proving airport lookup accepts normalized fixture codes, rejects unknown codes, defaults filters, parses bounded numeric values, and ignores unsupported values.
- [ ] Run `pnpm test -- src/lib/airports.test.ts src/lib/route-filters.test.ts`; expected failure is missing modules.
- [ ] Implement `AIRPORTS`, `getAirport`, `listDestinationCandidates`, and `parseRouteFilters` with the backend field names `max_stops`, `airlines`, `exclude_airports`, `max_duration_minutes`, `max_layover_minutes`, `departure_window`, `limit`, and `offset`.
- [ ] Re-run the focused tests; expected result is all green.

### Task 3: Server-only Route Discovery client using TDD

**Files:** Create `src/lib/route-discovery.ts` and `src/lib/route-discovery.test.ts`.

- [ ] Write RED tests for a valid `{ data, meta, error }` envelope, a stable RPC error, a malformed payload, and missing server environment.
- [ ] Run the focused test and observe the expected missing-module failure.
- [ ] Implement exported route option/envelope types, a pure `parseRouteSearchEnvelope`, and `searchRoutes(input, fetchImpl = fetch)`. Mark the module with `import 'server-only'`, send both `apikey` and `authorization` headers, and never expose the key in returned errors.
- [ ] Re-run the focused test; expected result is green.

### Task 4: Shared visual shell and search interactions

**Files:** Create shared layout, header, footer, search form, filter toolbar, route map, and global CSS.

- [ ] Build the page shell with Tripways branding, responsive navigation, accessible focus styles, and the screenshot-inspired navy/blue/off-white palette.
- [ ] Implement the airport form as a client component that prevents identical endpoints and navigates to `/routes/[from]/[to]`.
- [ ] Implement URL filter controls that submit GET parameters without client-side business logic.
- [ ] Implement a native SVG route map with fixture marker positions and decorative arcs; no map package.
- [ ] Run lint and typecheck; expected result is exit 0.

### Task 5: Build the three pages

**Files:** Create the home, origin discovery, and route detail page trees plus route-specific cards.

- [ ] Home page: hero, search panel, fixture airport chips, and a local-testing explanation.
- [ ] Origin page: validate `[iata]`, query each fixture destination through `searchRoutes`, omit empty results, and render hero/map/filters/cards/airline sidebar/footer.
- [ ] Route page: validate both codes, call the RPC once, and render direct/one-stop options with schedules, airlines, duration, layover, connection, weekdays, and validity.
- [ ] Render intentional setup, empty, not-found, and safe backend-error states.
- [ ] Run tests, lint, and typecheck; expected result is green.

### Task 6: Local integration and visual verification

**Files:** Update `README.md` with exact local commands and fixture routes.

- [ ] Start Supabase from `tripways-backend` and obtain local values through `supabase status -o env` without committing them.
- [ ] Create local-only `.env.local`, then run `pnpm build`; expected result is a successful production build.
- [ ] Start `pnpm dev`, verify `/`, `/flights-from/SGN`, and `/routes/SGN/LHR` return HTTP 200, and confirm SGN-LHR renders three route options.
- [ ] Capture desktop and mobile screenshots and inspect hierarchy, overflow, spacing, focus states, and responsive stacking.
- [ ] Run final `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check` where applicable.
- [ ] Report completion without committing, pushing, or deploying.
