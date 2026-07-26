# Web Code Organization and Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Next.js route easy to navigate by moving page composition and server loaders
into their owning features, then document exported architectural and UI boundaries with concise
JSDoc.

**Architecture:** Keep `src/app` as a thin framework adapter. Feature-owned server components
compose validated read models with focused presentation components, while application,
infrastructure, and domain boundaries remain one-directional. Preserve all current UI, data
contracts, caching, and error behaviour.

**Tech Stack:** Next.js App Router, React Server Components, strict TypeScript, Vitest, ESLint,
Supabase Edge read transports.

---

## File Map

- Create `src/app/architecture-contract.test.ts`: protect thin route entry points and feature
  page exports.
- Create `src/features/home-page/presentation/home-page.tsx`: own homepage composition.
- Create `src/features/city-page/application/city-page-query.ts`: own normalized city identity,
  destination query, and selected filter projection.
- Create `src/features/city-page/presentation/city-page.tsx`: own City Hub server composition.
- Create `src/features/city-page/presentation/city-page-sections.tsx`: own independent server
  section loaders and fallback projection.
- Create `src/features/city-page/presentation/city-page-metadata.ts`: own City Hub metadata
  projection and not-found-safe fallback.
- Create `src/features/city-page/application/city-page-query.test.ts`: lock moved query behaviour.
- Create `src/features/city-page/presentation/city-page.test.tsx`: lock public City Hub page
  composition boundaries without network calls.
- Create `src/features/city-page/infrastructure/city-destinations-http.ts`: parse the destination
  API request and map the application result to HTTP data.
- Create `src/features/city-page/infrastructure/city-destinations-http.test.ts`: lock request
  validation and normalization.
- Modify `src/app/page.tsx`: delegate to the homepage feature page.
- Modify `src/app/flights-from/[citySlug]/page.tsx`: retain only Next.js params, metadata, and
  not-found adaptation.
- Modify `src/app/api/city-page/destinations/route.ts`: retain only Next.js response adaptation.
- Modify feature `index.ts` files: expose intentional page entry points only.
- Modify exported components, use cases, repository contracts, parsers, and server composition
  files under `src/features` and `src/shared/ui`: add responsibility-focused English JSDoc.

### Task 1: Protect the Route Architecture

- [ ] Create `src/app/architecture-contract.test.ts` that reads the three route files and asserts:
  homepage imports `HomePage`, City Hub imports `CityPage` and metadata projection, and the API
  route imports one HTTP request parser.
- [ ] Assert the City Hub route no longer declares `MapSection`, `DestinationsSection`,
  `AirportsSection`, or filter helpers locally.
- [ ] Run `pnpm test -- src/app/architecture-contract.test.ts`.
- [ ] Confirm failure because the current routes still contain composition and loader logic.

### Task 2: Move Homepage Composition

- [ ] Create `HomePage` in
  `src/features/home-page/presentation/home-page.tsx` with the existing read-model call, shared
  chrome, section order, and Suspense boundary unchanged.
- [ ] Add JSDoc explaining that `HomePage` is the server-rendered homepage composition and that
  `HomeRouteMapSection` is independently suspended.
- [ ] Export `HomePage` from `src/features/home-page/index.ts`.
- [ ] Reduce `src/app/page.tsx` to a documented default route adapter returning `<HomePage />`.
- [ ] Update `src/app/page.test.tsx` only where the import boundary changes; preserve its rendered
  content assertions.
- [ ] Run `pnpm test -- src/app/page.test.tsx`.

### Task 3: Move City Query Normalization

- [ ] Write failing tests in
  `src/features/city-page/application/city-page-query.test.ts` for lowercase identity,
  airport normalization, bounded duration, supported departure windows, fixed page size, and
  selected filter values.
- [ ] Run the focused test and confirm missing exports fail.
- [ ] Implement `createCityPageIdentity`, `createCityDestinationQuery`, and
  `readSelectedCityFilters` in
  `src/features/city-page/application/city-page-query.ts`.
- [ ] Add JSDoc describing which URL values are accepted and why invalid values are ignored.
- [ ] Re-run the focused test and expect it to pass.

### Task 4: Move City Metadata and Page Composition

- [ ] Create `createCityPageMetadata` in
  `src/features/city-page/presentation/city-page-metadata.ts`; preserve title, description,
  canonical, robots, Open Graph, not-found, and unavailable fallbacks.
- [ ] Create focused server loaders in
  `src/features/city-page/presentation/city-page-sections.tsx` for route search, route map,
  filters, destinations, quick facts, insights, airports, alternate origins, FAQ, and directories.
- [ ] Add JSDoc to every exported loader explaining its read model and fallback responsibility.
- [ ] Create `CityPage` in `src/features/city-page/presentation/city-page.tsx`; load overview once,
  share the internal-link promise, preserve independent Suspense boundaries, and render shared
  chrome.
- [ ] Export only `CityPage`, `createCityPageMetadata`, `createCityPageIdentity`, and required
  public types through `src/features/city-page/index.ts`.
- [ ] Reduce the dynamic route to params/search params resolution, metadata delegation,
  `CityPageError` not-found adaptation, and `<CityPage />`.
- [ ] Run `pnpm test -- src/features/city-page src/app/architecture-contract.test.ts`.

### Task 5: Isolate Destination API Transport Logic

- [ ] Write failing tests for missing city, normalized city/airport values, fixed pagination, and
  success envelope in
  `src/features/city-page/infrastructure/city-destinations-http.test.ts`.
- [ ] Implement a documented `parseCityDestinationsHttpRequest` pure function and
  `CityDestinationsHttpError` in
  `src/features/city-page/infrastructure/city-destinations-http.ts`.
- [ ] Keep the route handler responsible only for calling the parser, invoking `cityPage`, and
  constructing `NextResponse`.
- [ ] Preserve current `ERR_INVALID_REQUEST`, HTTP 400, and success envelope behaviour.
- [ ] Run the focused HTTP parser and route tests.

### Task 6: Document Public Architectural Boundaries

- [ ] Add concise English JSDoc to exported presentation components in `home-page`, `city-page`,
  `route-map`, `route-discovery`, `advertising`, and `shared/ui`.
- [ ] Add JSDoc to application use-case factories, query builders, repository types, environment
  readers, Edge repository factories, DTO parsers, and server composition objects.
- [ ] Add sparse section comments only around orchestration, contract validation, MapLibre
  lifecycle, fallback normalization, and cleanup.
- [ ] Do not comment obvious formatters, pluralizers, array mapping, JSX tags, or CSS rules.
- [ ] Run `pnpm lint` and `pnpm typecheck`.

### Task 7: Full Verification

- [ ] Run:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

- [ ] Verify `/`, `/flights-from/bangkok`, and `/flights-from/singapore` at desktop and mobile
  widths.
- [ ] Confirm HTML hierarchy, CSS classes, metadata, read-model failures, map behaviour, and API
  envelopes remain unchanged.
- [ ] Review `git status` and preserve all pre-existing user changes.
- [ ] Do not commit, push, deploy, or modify backend/external services.
