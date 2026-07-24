# Tripways City Page Read-Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a draft `/flights-from/bangkok` city page whose independently loaded SEO sections consume bounded backend read models through Edge and pragmatic Next.js Clean Architecture.

**Architecture:** PostgreSQL owns section read models and publication rules; one allow-listed Edge query function exposes them; a server-only Next.js repository maps strict DTOs into domain models; application use cases feed independently streamed Server Components. Search and map interaction are the only client-side islands.

**Tech Stack:** PostgreSQL, Supabase Edge Functions/Deno, Next.js 16 App Router, React 19 Server Components, TypeScript 6, Tailwind CSS 4, MapLibre, Vitest.

---

### Task 1: Backend read-model contracts

**Files:**
- Create: `tripways-backend/supabase/snippets/e2e_city_page_read_models.sql`
- Create: `tripways-backend/supabase/sql_src/functions/pseo/rpc_get_city_overview.sql`
- Create: `tripways-backend/supabase/sql_src/functions/pseo/rpc_get_city_airports.sql`
- Create: `tripways-backend/supabase/sql_src/functions/pseo/rpc_get_city_airlines.sql`
- Create: `tripways-backend/supabase/sql_src/functions/pseo/rpc_get_city_insights.sql`
- Create: `tripways-backend/supabase/sql_src/functions/pseo/rpc_get_city_internal_links.sql`
- Create: `tripways-backend/supabase/sql_src/functions/pseo/rpc_get_city_faqs.sql`
- Modify: `tripways-backend/scripts/regenerate-supabase-migrations.sh`

- [ ] Write SQL assertions for Bangkok overview, BKK/DMK airports, airlines, insights, grouped links, FAQs, invalid identity, missing city, and service-role-only execution.
- [ ] Run the snippet before implementation and observe missing-function failure.
- [ ] Implement one stable JSON envelope per RPC using existing private identity/context/error helpers.
- [ ] Revoke `PUBLIC`, `anon`, and `authenticated`; grant only `service_role`.
- [ ] Add each source once to the pSEO functions migration group after its dependencies.
- [ ] Regenerate migrations, reset local Supabase, and run the new and existing SQL E2E snippets.

### Task 2: City-page Edge query boundary

**Files:**
- Create: `tripways-backend/supabase/functions/v1/city-page/query/request.ts`
- Create: `tripways-backend/supabase/functions/v1/city-page/query/response.ts`
- Create: `tripways-backend/supabase/functions/v1/city-page/query/handler.ts`
- Create: `tripways-backend/supabase/functions/v1/city-page/query/index.ts`
- Create: `tripways-backend/supabase/functions/v1/city-page/query/tests/request.test.ts`
- Create: `tripways-backend/supabase/functions/v1/city-page/query/tests/response.test.ts`
- Create: `tripways-backend/supabase/functions/v1/city-page/query/tests/handler.test.ts`
- Modify: `tripways-backend/supabase/config.toml`

- [ ] Write RED tests for the seven allow-listed actions, bounded identity/pagination/filter inputs, unsupported actions, malformed JSON, RPC failures, and safe public envelopes.
- [ ] Implement the request normalizer without generic dispatch or arbitrary RPC names.
- [ ] Implement response normalization using the existing shared Edge response utilities.
- [ ] Implement an injected handler that maps each action to exactly one RPC.
- [ ] Register the versioned Edge function with JWT verification consistent with public Route Discovery.
- [ ] Run focused Deno tests, formatting, and type checking.

### Task 3: Web domain and application ports

**Files:**
- Create: `tripways-web/src/features/city-page/domain/models.ts`
- Create: `tripways-web/src/features/city-page/domain/city-page-error.ts`
- Create: `tripways-web/src/features/city-page/application/city-page-repository.ts`
- Create: `tripways-web/src/features/city-page/application/read-model-result.ts`
- Create: `tripways-web/src/features/city-page/application/get-city-read-models.ts`
- Create: `tripways-web/src/features/city-page/application/get-city-read-models.test.ts`

- [ ] Write RED tests proving every use case delegates the normalized city identity and converts expected secondary failures into `unavailable` without affecting other calls.
- [ ] Define readonly domain models containing only fields rendered by the page.
- [ ] Define one explicit `CityPageRepository` port with seven methods; do not introduce a generic repository or base use-case type.
- [ ] Implement focused use-case factories and the `available | empty | unavailable` secondary result.
- [ ] Run focused Vitest tests.

### Task 4: Strict Edge repository

**Files:**
- Create: `tripways-web/src/features/city-page/infrastructure/city-page-environment.ts`
- Create: `tripways-web/src/features/city-page/infrastructure/city-page-response.dto.ts`
- Create: `tripways-web/src/features/city-page/infrastructure/city-page-response.dto.test.ts`
- Create: `tripways-web/src/features/city-page/infrastructure/edge-city-page-repository.ts`
- Create: `tripways-web/src/features/city-page/infrastructure/edge-city-page-repository.test.ts`
- Create: `tripways-web/src/features/city-page/server.ts`
- Create: `tripways-web/src/features/city-page/index.ts`
- Modify: `tripways-web/.env.example`

- [ ] Write RED DTO tests for all seven action payloads and malformed envelope rejection.
- [ ] Write RED repository tests for action/input mapping, HTTP errors, and contract errors.
- [ ] Implement strict `unknown` parsing with small field validators and action-specific mappers.
- [ ] Implement a server-only Edge repository using `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- [ ] Create the server composition root and client-safe feature exports.
- [ ] Run focused DTO/repository tests and architecture import checks.

### Task 5: Draft page presentation

**Files:**
- Create: `tripways-web/src/features/city-page/presentation/site-header.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-hero.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-route-search.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-route-map.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-filter-toolbar.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-destinations-section.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-airports-section.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-airlines-section.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-insights-section.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-links-section.tsx`
- Create: `tripways-web/src/features/city-page/presentation/city-faq-section.tsx`
- Create: `tripways-web/src/features/city-page/presentation/section-state.tsx`
- Create: `tripways-web/src/features/city-page/presentation/site-footer.tsx`
- Create: `tripways-web/src/features/city-page/presentation/presentation.test.tsx`

- [ ] Write RED rendering tests for headings, semantic links, airport identity, empty/unavailable states, and FAQ accessibility.
- [ ] Implement server-first semantic components matching the approved draft hierarchy.
- [ ] Keep static sections free of `"use client"`; isolate search/filter/map interaction.
- [ ] Give images, map, advertisements, and streamed sections stable dimensions.
- [ ] Run focused presentation tests.

### Task 6: App Router composition and SEO

**Files:**
- Create: `tripways-web/src/app/flights-from/[citySlug]/page.tsx`
- Create: `tripways-web/src/app/flights-from/[citySlug]/loading.tsx`
- Create: `tripways-web/src/app/flights-from/[citySlug]/page.test.tsx`
- Create: `tripways-web/src/app/api/city-page/destinations/route.ts`
- Modify: `tripways-web/src/app/layout.tsx`
- Modify: `tripways-web/src/app/globals.css`
- Modify: `tripways-web/src/app/page.tsx`

- [ ] Write RED tests for Bangkok metadata, database-owned robots state, page H1, FAQ JSON-LD, and missing-city behavior.
- [ ] Implement `generateMetadata` from the required overview use case.
- [ ] Compose overview first and wrap every secondary async section in a local Suspense fallback.
- [ ] Render FAQ JSON-LD from the same FAQ read model used visibly.
- [ ] Add a same-origin destination Route Handler for client filters.
- [ ] Implement responsive draft styling in the approved navy/blue/off-white direction.
- [ ] Keep `/` as a compact link to the Bangkok draft.

### Task 7: Full verification

**Files:**
- Modify only scoped defects found during verification.

- [ ] Regenerate migrations twice and compare checksums.
- [ ] Reset Supabase from zero and run auth, Route Discovery, city pSEO, and city read-model SQL tests.
- [ ] Run all backend Deno tests, format, and check commands.
- [ ] Run all web Vitest, ESLint, TypeScript, and production build commands.
- [ ] Start local backend Edge and Next.js servers.
- [ ] Verify `/flights-from/bangkok` at 375×812, 768×1024, and 1440×900.
- [ ] Confirm no horizontal overflow, broken internal links, console errors, secret leakage, or layout shifts from unreserved sections.
- [ ] Preserve existing dirty changes and do not commit, push, or deploy.
