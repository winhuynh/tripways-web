# Tripways Next.js Clean Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Tripways Web from shared `src/lib` Route Discovery code to a pragmatic feature-first architecture consuming the new Edge contract.

**Architecture:** Domain is framework-free, application owns user-intent use cases and one provider port, infrastructure owns server-only environment/HTTP/DTO parsing, presentation owns feature UI, and App Router files remain thin composition boundaries.

**Tech Stack:** Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, Vitest.

---

## File Map

- Create `src/features/route-discovery/domain/*`: airports, filters, route entities/errors.
- Create `src/features/route-discovery/application/*`: provider port and two use cases.
- Create `src/features/route-discovery/infrastructure/*`: environment, strict Edge DTO parser, HTTP adapter.
- Create `src/features/route-discovery/presentation/*`: moved Route Discovery UI.
- Create `src/features/route-discovery/index.ts` and `server.ts`: client-safe and server-only entry points.
- Modify App Router pages and homepage search imports.
- Delete legacy Route Discovery `src/lib` and component files after migration.
- Modify `.env.example` to remove the service-role requirement.

### Task 1: Framework-free domain

**Files:**
- Create: `src/features/route-discovery/domain/airport.ts`
- Create: `src/features/route-discovery/domain/route-option.ts`
- Create: `src/features/route-discovery/domain/route-filters.ts`
- Create: `src/features/route-discovery/domain/route-discovery-error.ts`
- Create: `src/features/route-discovery/domain/domain.test.ts`

- [ ] **Step 1: Write failing domain tests**

Move the existing airport/filter expectations into the feature and assert IATA lookup, destination
candidate exclusion, query filter parsing, and stable error codes without importing React, Next.js,
`fetch`, or environment state.

- [ ] **Step 2: Run and verify RED**

Run:

```bash
pnpm test src/features/route-discovery/domain/domain.test.ts
```

Expected: FAIL because the feature domain files do not exist.

- [ ] **Step 3: Implement readonly domain types and pure functions**

Move existing fixture metadata and filter behavior without transport changes. Define
`RouteDiscoveryErrorCode` as setup/unavailable/contract/invalid categories and keep
`RouteDiscoveryError` free of HTTP details.

- [ ] **Step 4: Run and verify GREEN**

Run the Task 1 command. Expected: domain tests pass.

### Task 2: Application port and use cases

**Files:**
- Create: `src/features/route-discovery/application/route-discovery-provider.ts`
- Create: `src/features/route-discovery/application/search-routes.ts`
- Create: `src/features/route-discovery/application/discover-destinations.ts`
- Create: `src/features/route-discovery/application/application.test.ts`

- [ ] **Step 1: Write failing application tests**

Use a small fake `RouteDiscoveryProvider` to assert `searchRoutes` delegates one normalized domain
input and `discoverDestinations` queries each candidate, retains successful non-empty results, and
reports the first stable service error without importing infrastructure.

- [ ] **Step 2: Run and verify RED**

Run:

```bash
pnpm test src/features/route-discovery/application/application.test.ts
```

Expected: FAIL because application modules do not exist.

- [ ] **Step 3: Implement the narrow provider and use cases**

The port exposes only `searchRoutes(input): Promise<RouteSearchResult>`. Use function dependency
injection; do not create base classes, repositories, factories, or a DI container.

- [ ] **Step 4: Run and verify GREEN**

Run the Task 2 command. Expected: application tests pass.

### Task 3: Strict Edge DTO and server provider

**Files:**
- Create: `src/features/route-discovery/infrastructure/route-search-response.dto.ts`
- Create: `src/features/route-discovery/infrastructure/route-search-response.dto.test.ts`
- Create: `src/features/route-discovery/infrastructure/route-discovery-environment.ts`
- Create: `src/features/route-discovery/infrastructure/edge-route-discovery-provider.ts`
- Create: `src/features/route-discovery/infrastructure/edge-route-discovery-provider.test.ts`

- [ ] **Step 1: Write failing DTO parser tests**

Use a fixture matching the new Edge envelope and assert complete mapping to domain routes,
pagination, and facets. Reject malformed status, route fields, pagination, facets, and error
envelopes as `ERR_ROUTE_DISCOVERY_CONTRACT`.

- [ ] **Step 2: Run and verify DTO RED**

Run the DTO test file. Expected: FAIL because the parser does not exist.

- [ ] **Step 3: Implement strict unknown parsing**

Validate every route field currently rendered by the UI. Do not return or cast the raw Edge DTO as
a domain result.

- [ ] **Step 4: Run and verify DTO GREEN**

Run the DTO test file. Expected: all parser tests pass.

- [ ] **Step 5: Write failing provider tests**

Assert the provider POSTs to `${SUPABASE_URL}/functions/v1/route-discovery-query` with
`{ action: "search_routes", input }`, uses a server credential, maps non-2xx responses to stable
domain errors, and delegates successful unknown JSON to the DTO parser.

- [ ] **Step 6: Implement environment and provider**

Keep both files server-only. Validate `SUPABASE_URL` and `SUPABASE_ANON_KEY`; remove all web
service-role usage. Inject `fetch` for tests.

- [ ] **Step 7: Run and verify provider GREEN**

Run the provider test file. Expected: all provider tests pass.

### Task 4: Feature composition and presentation migration

**Files:**
- Create: `src/features/route-discovery/index.ts`
- Create: `src/features/route-discovery/server.ts`
- Move: existing Route Discovery route/search components into `presentation/`
- Modify: `src/components/home/route-search-section.tsx`

- [ ] **Step 1: Add public API tests**

Assert client-safe exports resolve without loading server-only composition and the server entry point
creates `searchRoutes` and `discoverDestinations` operations from the concrete Edge provider.

- [ ] **Step 2: Run and verify RED**

Expected: FAIL because feature entry points do not exist.

- [ ] **Step 3: Create the composition roots**

`index.ts` exports domain/presentation only. `server.ts` imports `server-only`, constructs one Edge
provider, and exposes ready application operations.

- [ ] **Step 4: Move presentation without behavior changes**

Move map/cards/form/filter files, update imports to feature domain/application types, and keep
homepage marketing components outside the feature.

- [ ] **Step 5: Run component and feature tests**

Run all feature and homepage tests. Expected: pass.

### Task 5: Thin App Router pages

**Files:**
- Modify: `src/app/routes/[from]/[to]/page.tsx`
- Modify: `src/app/flights-from/[iata]/page.tsx`
- Create focused page/view-model tests where pure decisions are extracted.

- [ ] **Step 1: Write failing page-decision tests**

Cover invalid airports, empty result, unavailable result, and successful result mapping without
mocking transport internals.

- [ ] **Step 2: Run and verify RED**

Expected: FAIL because current pages import legacy `src/lib` services directly.

- [ ] **Step 3: Migrate pages**

Pages import client-safe presentation from the feature index and application operations from
`server.ts`. They own route parameter handling, metadata, not-found, and composition only.

- [ ] **Step 4: Run and verify GREEN**

Run page/feature tests. Expected: pass.

### Task 6: Remove legacy paths and service-role configuration

**Files:**
- Delete: `src/lib/airports.ts`, `src/lib/airports.test.ts`
- Delete: `src/lib/route-filters.ts`, `src/lib/route-filters.test.ts`
- Delete: `src/lib/route-discovery.ts`, `src/lib/route-discovery.test.ts`
- Delete migrated files under `src/components/routes` and `src/components/search`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Prove no legacy imports remain**

Run:

```bash
rg -n '@/lib/(airports|route-discovery|route-filters)|@/components/(routes|search)' src
```

Expected before deletion: no matches.

- [ ] **Step 2: Delete obsolete files**

Delete only after every consumer and test has migrated.

- [ ] **Step 3: Update environment documentation**

Keep `SUPABASE_URL` and replace `SUPABASE_SERVICE_ROLE_KEY` with `SUPABASE_ANON_KEY`. Explain that
the web calls the Edge boundary and never receives a service-role secret.

- [ ] **Step 4: Run static checks**

Run:

```bash
pnpm test
pnpm lint
pnpm typecheck
```

Expected: all exit 0.

### Task 7: End-to-end and responsive verification

**Files:**
- Modify only for scoped defects found during verification.

- [ ] **Step 1: Run full quality gates**

Run:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

Expected: 0 failures and a successful production build.

- [ ] **Step 2: Verify against local Edge**

With local Supabase and the Route Discovery Edge Function running, open `/`,
`/flights-from/SGN`, and `/routes/SGN/SIN`. Confirm the new Edge contract returns stored route
results and no browser/server error exposes credentials.

- [ ] **Step 3: Verify responsive behavior**

Check 375×812, 768×1024, and 1440×900. Confirm no horizontal overflow, mobile navigation works,
Route Map and cards reflow, and browser console has no warnings/errors.

- [ ] **Step 4: Preserve repository state**

Do not commit, push, or deploy. Report `implemented`, `skipped`, and `add when` with exact
verification evidence.
