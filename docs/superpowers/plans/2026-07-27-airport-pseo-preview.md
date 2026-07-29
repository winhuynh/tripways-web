# Airport pSEO Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seed BKK, DMK, and SIN airport pages and provide responsive local Next.js preview pages backed by the airport pSEO RPCs.

**Architecture:** Extend the backend development fixture and add a thin two-action Airport Page Edge transport. Build an independent frontend airport-page feature with strict DTO validation, server-only repository access, URL-backed route filters, and presentation components styled with the existing Tripways visual language.

**Tech Stack:** PostgreSQL 17, Supabase Edge Functions/Deno, Next.js App Router, React Server Components, TypeScript, Vitest, CSS.

---

### Task 1: Add failing three-airport backend contract

**Files:**

- Modify: `../tripways-backend/supabase/snippets/e2e_airport_pseo.sql`

- [ ] Assert that BKK, DMK, and SIN resolve through `rpc_get_airport_page`.
- [ ] Assert every airport returns inbound and outbound route results.
- [ ] Assert each page returns published access, parking, lounge, notice, and FAQ content.
- [ ] Run the SQL contract and observe DMK/SIN page-not-found failures.

### Task 2: Seed DMK and SIN preview content

**Files:**

- Modify: `../tripways-backend/supabase/seed/airport_pseo_fixture.sql`

- [ ] Register airport `pseo_pages` and `airport_pages` rows for DMK and SIN.
- [ ] Add concise access, parking, lounge, notice, and FAQ rows for each page.
- [ ] Add only missing directional route/service fixtures required by the failing contract.
- [ ] Reset local Supabase and verify all three pages remain `development_fixture`.

### Task 3: Add Airport Page Edge transport

**Files:**

- Create: `../tripways-backend/supabase/functions/v1/airport-page/query/request.ts`
- Create: `../tripways-backend/supabase/functions/v1/airport-page/query/handler.ts`
- Create: `../tripways-backend/supabase/functions/v1/airport-page/query/index.ts`
- Create: `../tripways-backend/supabase/functions/v1/airport-page/query/tests/request.test.ts`
- Create: `../tripways-backend/supabase/functions/v1/airport-page/query/tests/handler.test.ts`
- Modify: `../tripways-backend/supabase/config.toml`
- Modify: `../tripways-backend/package.json`

- [ ] Write failing request/handler tests for `get_page` and `search_routes`.
- [ ] Validate request method, action, input object, and read-contract header.
- [ ] Map actions directly to the two airport RPC names.
- [ ] Normalize CORS, client errors, and internal failures without exposing raw database errors.
- [ ] Register the Edge Function and add it to Deno check/test scripts.

### Task 4: Define frontend domain and boundary parsing

**Files:**

- Create: `src/features/airport-page/domain/models.ts`
- Create: `src/features/airport-page/domain/airport-page-error.ts`
- Create: `src/features/airport-page/application/airport-page-query.ts`
- Create: `src/features/airport-page/application/airport-page-query.test.ts`
- Create: `src/features/airport-page/infrastructure/airport-page-response.dto.ts`
- Create: `src/features/airport-page/infrastructure/airport-page-response.dto.test.ts`

- [ ] Write failing tests for slug-to-IATA parsing and normalized route filters.
- [ ] Implement an airport identity with IATA and locale.
- [ ] Write valid/malformed RPC-envelope tests.
- [ ] Implement focused parsers for airport page and route-search responses.

### Task 5: Add repository and server use cases

**Files:**

- Create: `src/features/airport-page/application/airport-page-repository.ts`
- Create: `src/features/airport-page/application/get-airport-page.ts`
- Create: `src/features/airport-page/infrastructure/airport-page-environment.ts`
- Create: `src/features/airport-page/infrastructure/edge-airport-page-repository.ts`
- Create: `src/features/airport-page/infrastructure/edge-airport-page-repository.test.ts`
- Create: `src/features/airport-page/server.ts`
- Create: `src/features/airport-page/index.ts`

- [ ] Write a failing repository test that verifies Edge URL, headers, actions, and payloads.
- [ ] Implement one server-only repository with `getPage` and `searchRoutes`.
- [ ] Normalize page-not-found and unavailable errors.
- [ ] Expose focused server use cases without a generic repository abstraction.

### Task 6: Build the airport page UI

**Files:**

- Create: `src/features/airport-page/presentation/airport-page.tsx`
- Create: `src/features/airport-page/presentation/airport-hero.tsx`
- Create: `src/features/airport-page/presentation/airport-route-explorer.tsx`
- Create: `src/features/airport-page/presentation/airport-essentials.tsx`
- Create: `src/features/airport-page/presentation/airport-page-metadata.ts`
- Create: `src/features/airport-page/presentation/airport-page.css`
- Create: `src/features/airport-page/presentation/airport-page.test.tsx`

- [ ] Write a failing server-render test for hero, direction links, routes, access, parking, lounges, notices, and FAQs.
- [ ] Implement the page using shared site header/footer and feature-local airport sections.
- [ ] Match city-page typography, navy/off-white palette, cards, focus states, and responsive rhythm.
- [ ] Render honest empty/unavailable states and omit unknown values.

### Task 7: Add App Router routes

**Files:**

- Create: `src/app/airports/[airportSlug]/page.tsx`
- Create: `src/app/airports/[airportSlug]/loading.tsx`
- Create: `src/app/api/airport-page/routes/route.ts`
- Modify: `src/app/architecture-contract.test.ts`

- [ ] Write failing architecture assertions for server-owned loading and metadata.
- [ ] Add dynamic metadata and `notFound()` behavior.
- [ ] Add a thin same-origin route-search handler.
- [ ] Keep service credentials and Edge calls outside Client Components.

### Task 8: Verify local previews

**Files:**

- Modify only files required by failures discovered during verification.

- [ ] Run backend SQL, Deno tests/checks, migration regeneration, and database reset.
- [ ] Run frontend tests, lint, typecheck, and production build.
- [ ] Start backend Edge transport and Next.js.
- [ ] Inspect BKK, DMK, and SIN on desktop and mobile with no console errors or horizontal overflow.
- [ ] Report exact local URLs and leave changes uncommitted.
