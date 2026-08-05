# Four-Page Stitch Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the four approved Stitch pages from canonical backend page read models and shared route search, with the journey-led Airport Page replacing the legacy Airport Hub.

**Architecture:** Each page is a vertical slice with a typed boundary and page-owned presentation. Server Components load immutable page models through `page-query`; interactive result modules use one typed `route-search-query` boundary. Shared UI contains only semantic primitives with multiple real consumers.

**Tech Stack:** Next.js 16, React 19, strict TypeScript, Vitest, PostgreSQL/Supabase RPC and Edge Functions.

---

### Task 1: Canonical frontend transport contracts

**Files:**
- Create: `src/lib/server/page-data/page-request.ts`
- Create: `src/lib/server/page-data/page-envelope.ts`
- Create: `src/lib/server/page-data/page-client.ts`
- Create: `src/lib/server/page-data/page-client.test.ts`
- Create: `src/lib/server/route-search/route-search-client.ts`
- Create: `src/lib/server/route-search/route-search-client.test.ts`
- Modify: `src/lib/server/page-data-environment.ts`
- Modify: `src/lib/server/page-data-environment.test.ts`

- [ ] Write failing tests for one canonical `pageQueryUrl`, one `routeSearchQueryUrl`, stable envelopes, timeout normalization, and not-found handling.
- [ ] Run `pnpm test src/lib/server/page-data src/lib/server/route-search` and observe failures caused by missing contracts.
- [ ] Implement minimal server-only clients using the existing `requestPageData` transport.
- [ ] Re-run focused tests and confirm they pass.

### Task 2: Shared domain values and semantic UI

**Files:**
- Create: `src/shared/domain/route-values.ts`
- Create: `src/shared/domain/route-values.test.ts`
- Create: `src/shared/ui/breadcrumbs.tsx`
- Create: `src/shared/ui/page-hero.tsx`
- Create: `src/shared/ui/stat-grid.tsx`
- Create: `src/shared/ui/freshness-badge.tsx`
- Create: `src/shared/ui/faq-accordion.tsx`
- Create: `src/shared/ui/internal-link-groups.tsx`
- Create: `src/shared/ui/route-values.tsx`
- Create: `src/shared/ui/pseo-elements.css`
- Modify: `src/shared/ui/index.ts`

- [ ] Write failing tests for duration, price availability, semantic headings, FAQ controls, and shared link groups.
- [ ] Implement focused value formatters and accessible server-renderable primitives.
- [ ] Run shared tests and keep existing site-chrome tests green.

### Task 3: Journey-led Airport Page vertical slice

**Files:**
- Create: `src/features/airport-page/domain/airport-page-model.ts`
- Create: `src/features/airport-page/infrastructure/airport-page-response.dto.ts`
- Create: `src/features/airport-page/infrastructure/airport-page-response.dto.test.ts`
- Create: `src/features/airport-page/application/get-airport-page.ts`
- Create: `src/features/airport-page/presentation/airport-page-screen.tsx`
- Create: `src/features/airport-page/presentation/airport-page.css`
- Create: `src/app/airports/[airportSlug]/page.tsx`
- Create: `src/app/airports/[airportSlug]/page.test.tsx`

- [ ] Write failing parser tests for orientation, quick answers, journey steps, transport, parking, terminals, facilities, lounges, notices, FAQs, links, provenance, and meta.
- [ ] Implement the parser and server query for `page_type=airport`.
- [ ] Write failing page tests for journey-led section order and removal of legacy Airport Hub modules.
- [ ] Implement responsive Airport Page presentation and metadata.
- [ ] Verify focused tests.

### Task 4: Shared route-search boundary and Airport direct-flight explorer

**Files:**
- Create: `src/features/route-search/domain/route-search-model.ts`
- Create: `src/features/route-search/infrastructure/route-search-response.dto.ts`
- Create: `src/features/route-search/infrastructure/route-search-response.dto.test.ts`
- Create: `src/features/route-search/application/search-routes.ts`
- Create: `src/features/route-search/presentation/route-results.tsx`
- Modify: `src/features/airport-page/presentation/airport-page-screen.tsx`

- [ ] Write failing tests for city, city-pair, airport-from and airport-to scopes, explicit unavailable price, facets, and cursor.
- [ ] Implement the route-search parser/client integration.
- [ ] Add direct-only airport result controls and render inbound/outbound results without unsupported filters.
- [ ] Verify scope serialization and page tests.

### Task 5: City Hub vertical slice

**Files:**
- Create: `src/features/city-page/domain/city-page-model.ts`
- Create: `src/features/city-page/infrastructure/city-page-response.dto.ts`
- Create: `src/features/city-page/infrastructure/city-page-response.dto.test.ts`
- Create: `src/features/city-page/application/get-city-page.ts`
- Create: `src/features/city-page/presentation/city-page-screen.tsx`
- Create: `src/features/city-page/presentation/city-page.css`
- Create: `src/app/flights-from/[citySlug]/page.tsx`
- Create: `src/app/flights-from/[citySlug]/page.test.tsx`

- [ ] Write failing parser tests for identity, hero, airports, quick facts, featured destinations, FAQs, structured facts, links, price summary and meta.
- [ ] Implement the City Page parser/query.
- [ ] Write failing presentation tests for top route, destination table, airport comparison, FAQ, links, ad, and provenance.
- [ ] Implement the responsive City Hub and URL-backed filter form.
- [ ] Verify focused tests.

### Task 6: Route Page vertical slice and backend payload correction

**Files:**
- Create: `src/features/route-page/domain/route-page-model.ts`
- Create: `src/features/route-page/infrastructure/route-page-response.dto.ts`
- Create: `src/features/route-page/infrastructure/route-page-response.dto.test.ts`
- Create: `src/features/route-page/application/get-route-page.ts`
- Create: `src/features/route-page/presentation/route-page-screen.tsx`
- Create: `src/features/route-page/presentation/route-page.css`
- Create: `src/app/flights/[routeSlug]/page.tsx`
- Create: `src/app/flights/[routeSlug]/page.test.tsx`
- Modify: `../tripways-backend/supabase/sql_src/functions/pseo/route/build_route_page_payload.sql`
- Modify: `../tripways-backend/supabase/functions/_shared/security/tests/canonical_pseo_sql_contract.test.ts`

- [ ] Write a failing backend contract test requiring route options to stay outside the immutable route payload.
- [ ] Remove the embedded `rpc_search_routes` call from the route payload builder and expose only shell content.
- [ ] Write failing frontend parser and page tests.
- [ ] Implement Route Page hero, summary, filters, tabs, results, planning, sponsored conditional, FAQ, links and provenance.
- [ ] Verify backend contract and frontend focused tests.

### Task 7: Homepage vertical slice

**Files:**
- Create: `src/features/homepage/domain/homepage-model.ts`
- Create: `src/features/homepage/infrastructure/homepage-response.dto.ts`
- Create: `src/features/homepage/infrastructure/homepage-response.dto.test.ts`
- Create: `src/features/homepage/application/get-homepage.ts`
- Create: `src/features/homepage/presentation/homepage-screen.tsx`
- Create: `src/features/homepage/presentation/homepage.css`
- Create: `src/app/page.tsx`
- Create: `src/app/page.test.tsx`

- [ ] Write failing parser tests for hero copy, featured origins/routes, reviewed content, FAQ and metadata.
- [ ] Implement the Homepage parser/query.
- [ ] Write failing page tests for search, destination preview, popular routes/origins, ad, value content and disclaimer.
- [ ] Implement the responsive Homepage without production illustrative literals.
- [ ] Verify focused tests.

### Task 8: Indexing, responsive QA and full verification

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/app/indexing-contract.test.ts`
- Modify: `src/app/globals.css`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] Write failing indexing tests for the restored canonical route families while keeping fixture pages noindex through backend metadata.
- [ ] Implement route metadata and sitemap behavior supported by the backend contract.
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
- [ ] Run focused backend Deno contract tests and `git diff --check` in both repositories.
- [ ] Compare all four pages against Stitch at desktop and mobile widths and fix verified layout/accessibility gaps.

## Intentional exclusions

- Legacy Airport Hub UI.
- Header/footer redesign.
- Live booking or fare claims.
- Placeholder affiliate offers.
- Indexable filter combinations.
- Deployment, commit, or push.
