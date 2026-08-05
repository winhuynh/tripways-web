# Master Route Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement one scope-aware master route filter and attach it to City Hub, Route Page, and Airport Guide.

**Architecture:** Shared domain code normalizes URL values and serializes canonical RPC filters. One presentation component renders an allowlisted set of native GET controls from page data and route facets. Pages remain responsible for selecting the field set and route scope.

**Tech Stack:** Next.js 16 Server Components, React 19, strict TypeScript, Vitest, Supabase canonical route-search RPC.

---

### Task 1: Shared filter contract

**Files:**
- Create: `src/features/route-search/domain/route-filter.ts`
- Create: `src/features/route-search/domain/route-filter.test.ts`

- [ ] Write failing tests for valid scalar/list fields, scope allowlists, invalid values, and cursor reset/preservation.
- [ ] Run the focused test and observe the missing contract failure.
- [ ] Implement normalized values, RPC serialization, and URL serialization.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Master filter presentation

**Files:**
- Create: `src/features/route-search/presentation/master-route-filter.tsx`
- Create: `src/features/route-search/presentation/master-route-filter.test.tsx`
- Create: `src/features/route-search/presentation/master-route-filter.css`

- [ ] Write failing render tests for City, Route, and Airport configurations.
- [ ] Verify the tests fail because the component is absent.
- [ ] Implement accessible native GET controls, selected state, facet counts, Apply, Clear, and next cursor.
- [ ] Re-run presentation tests and confirm they pass.

### Task 3: Page integration

**Files:**
- Modify: `src/app/flights-from/[citySlug]/page.tsx`
- Modify: `src/app/flights/[routeSlug]/page.tsx`
- Modify: `src/app/airports/[airportSlug]/page.tsx`
- Modify: the three corresponding page screens and tests.

- [ ] Write failing contracts proving every page uses `MasterRouteFilter` with its allowed field set.
- [ ] Verify RED.
- [ ] Replace page-specific forms, normalize query values once, and send the same normalized filters to the RPC and UI.
- [ ] Verify focused page and integration tests are GREEN.

### Task 4: Full QA

- [ ] Run frontend test, lint, typecheck, production build, and `git diff --check`.
- [ ] Run backend canonical pSEO/route-search contract tests.
- [ ] Start local data boundaries and test City, Route, and Airport filters by interaction.
- [ ] Check desktop/mobile overflow, selected state, clear action, result counts, and bounded empty state.
