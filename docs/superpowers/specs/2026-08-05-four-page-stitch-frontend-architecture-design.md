# Four-Page Stitch Frontend Architecture Design

**Date:** 2026-08-05  
**Status:** Approved direction; awaiting written-spec review  
**Scope:** Homepage, City Hub, Route Page, and journey-led Airport Page

## 1. Goal

Rebuild the Tripways public frontend from the four product screens that currently exist in Google
Stitch. The implementation must render backend-owned pSEO content and aviation facts through typed
page read models, use one shared route-search contract for interactive discovery, and reuse UI only
where components share both presentation and semantics.

The four in-scope pages are:

1. Homepage.
2. City Hub — Bangkok.
3. Route — Bangkok to London.
4. Airport Guide — BKK — Journey-led, treated as the canonical Airport Page design.

The legacy Airport Hub is out of scope. Header and footer already exist and are not redesigned by
this work.

## 2. Evidence and constraints

The Stitch canvas contains four product-screen iframe nodes. It does not contain an Airport Hub
node, even though an earlier Stitch conversation claims that five product screens exist. The live
canvas is the source of truth for frontend scope.

The frontend has intentionally been reset to an application shell and informational pages. The
backend already exposes canonical page read models for `homepage`, `city`, `airport`, and `route`
through `rpc_get_page`, plus shared interactive route results through `rpc_search_routes`.

The following repository constraints remain mandatory:

- PostgreSQL and RPCs own route eligibility, ranking, publication, freshness, and indexability.
- Server Components load page data; Client Components own browser interaction only.
- External envelopes are parsed before rendering.
- The Supabase service-role key never reaches the browser.
- Development fixtures remain `noindex` and are never presented as production data.
- No generic JSON page renderer or speculative UI framework is introduced.

## 3. Chosen architecture

Use vertical slices for each page and extract shared semantic primitives only after identifying at
least two real consumers. Each page owns its read-model parser, application query, screen
composition, and page-specific sections. Shared route-search owns the interactive search contract,
URL-filter state, result parsing, and reusable route values, but not page-specific result layouts.

The server-rendered page shell and interactive route explorer have separate data flows:

```text
Request
  -> Next.js Server Component
  -> page-query Edge transport
  -> rpc_get_page
  -> page-specific read-model parser
  -> immutable SEO/editorial page shell

Browser filter interaction
  -> canonical URL search params
  -> server navigation or thin same-origin read boundary
  -> route-search-query Edge transport
  -> rpc_search_routes
  -> shared route-search parser
  -> page-specific results presentation
```

Page read models must not embed a live or filterable result list. Route results are loaded through
the shared route-search contract so filters, pagination, facets, and freshness have one source of
truth.

## 4. Frontend organization

```text
src/
├── app/
│   ├── page.tsx
│   ├── flights-from/[citySlug]/page.tsx
│   ├── flights/[routeSlug]/page.tsx
│   └── airports/[airportSlug]/page.tsx
├── features/
│   ├── homepage/
│   ├── city-page/
│   ├── route-page/
│   ├── airport-page/
│   └── route-search/
├── shared/
│   ├── domain/
│   └── ui/
└── lib/server/
    ├── page-data/
    └── route-search/
```

Each page feature follows the smallest useful clean boundary:

```text
domain/<page>-page-model.ts
infrastructure/<page>-response.dto.ts
infrastructure/edge-<page>-repository.ts
application/get-<page>.ts
presentation/<page>-screen.tsx
presentation/sections/*
```

An interface is introduced only at an actual transport or test boundary. Page sections remain
small files when they own distinct content, interactions, or responsive behavior.

## 5. Shared models

### 5.1 Page models

Use four independent types rather than one large discriminated page object:

- `HomepagePageModel`
- `CityPageModel`
- `AirportPageModel`
- `RoutePageModel`

Each parser validates the exact backend payload consumed by its page. Unknown additive fields are
ignored. Missing required identity, SEO, publication, or section data returns a stable unavailable
error rather than rendering partial misleading facts.

### 5.2 Shared route-search models

`route-search` owns:

- `RouteSearchScope`
- `RouteSearchFilters`
- `RouteSearchOption`
- `RouteSearchFacets`
- `RouteSearchPage`
- airport, city, airline, price, duration, and schedule value objects used by route results

The result layouts remain page-owned because their grains differ:

- City Hub renders aggregated direct destinations.
- Route Page renders direct and connecting route options.
- Airport Page renders direct airport-pair results in one selected direction.

## 6. Shared UI boundaries

The following components may live in `src/shared/ui` because they have the same meaning across
pages:

- `PageContainer`
- `Breadcrumbs`
- `PageHero` with composition slots rather than page flags
- `SectionHeading`
- `StatGrid` and `StatItem`
- `FreshnessBadge`
- `FaqAccordion`
- `InternalLinkGroups`
- `DisclosureNotice`
- `EmptyState` and `UnavailableState`
- `AirportCodeBadge`
- `AirlineCodeList`
- `DurationValue`
- `PriceEstimate`
- `RouteTypeBadge`

Existing `AdSlot`, editorial primitives, route-information disclaimer, design tokens, site header,
and site footer are reused.

The following stay under `features/route-search/presentation`:

- filter-control primitives backed by `RouteSearchFilters`
- result count and pagination controls
- route-type control
- route-option value presentation

The following remain page-owned:

- City destination table and airport comparison cards
- Route Page filter workspace, tabs, and option-card composition
- Airport journey steps, transport comparison, terminals, facilities, notices, and mode switch
- Homepage hero discovery and featured-route presentation

Forbidden abstractions include `GenericPageRenderer`, `DynamicSectionRenderer`, a global
`GenericCard`, and direct component selection from backend `section_type` values.

## 7. Page designs

### 7.1 Homepage

Render the hero origin search, selected-origin destination preview, one advertisement slot, popular
nonstop routes, popular origins, three reviewed value propositions, and the travel-data disclaimer.

Initial content comes from `HomepagePageModel`. Place search uses the homepage place-search RPC;
origin resolution uses the canonical homepage-origin RPC. Destination discovery uses
`rpc_search_routes` with a global or resolved origin scope. The selected destination preview is a
real route result or a reviewed featured route, never hard-coded illustrative data in production.

Value-proposition copy comes from reviewed homepage content sections or explicitly frontend-owned
product copy. Aviation counts, durations, airlines, and routes never come from frontend literals.

### 7.2 City Hub

Render breadcrumb, hero, freshness, quick facts, route filters, top destination, direct-destination
table, airport comparison, one advertisement slot, FAQ, internal links, and provenance.

The immutable shell uses `CityPageModel`. Interactive results use scope
`{ type: "origin_city", key: citySlug }`. URL parameters represent departure airport,
country/region, airline, maximum duration, route type, maximum estimated price, currency, and
cursor. The backend remains responsible for matching and facet counts.

The top-route module comes from the first explicitly ranked featured destination. It is omitted when
no eligible destination exists. Frequency and fare are displayed only when their contract states
that the value is available; missing values render as unknown, not zero.

### 7.3 Route Page

Render breadcrumb, hero and route summary, filter workspace, All/Nonstop/1-stop views, route-option
results, journey-planning facts, cited official links, sponsored services when configured, FAQ,
internal links, and provenance.

The immutable shell uses `RoutePageModel`. Results use scope
`{ type: "city_pair", from: originSlug, to: destinationSlug }`. Nonstop and one-stop tabs are filter
presets over the same route-search request rather than separate datasets.

The backend route read model must stop embedding a default `rpc_search_routes` response. Summary,
editorial content, comparisons, facts, FAQs, internal links, and provenance remain in the read model;
options are requested independently. Sponsored services are omitted unless approved commercial
configuration exists. Official guidance links render only with verified primary source URLs.

### 7.4 Journey-led Airport Page

Render airport orientation, arrival/departure mode actions, section navigation, quick answers,
arrival steps, transport comparison, departure steps, verified direct flights, parking/pickup/car
rental, terminals, facilities, lounges when available, notices, FAQ, internal links, and provenance.

The immutable shell uses `AirportPageModel`. Flight results use one of:

```json
{"type":"airport","key":"BKK","direction":"from"}
```

```json
{"type":"airport","key":"BKK","direction":"to"}
```

Airport flight scope is direct-only. The UI exposes only counterpart search, direction, route type,
operating airline, counterpart country/region, pagination, and facets supported by the airport
contract.

Journey steps retain their `audience` and are grouped without inventing missing guidance. Terminal
labels come from reviewed content and terminal records, not from count-based text generation.
Commercial airport CTAs render only when an approved actionable URL exists.

## 8. Backend alignment work

Before page implementation, close these contract gaps:

1. Add an explicit canonical page-query and route-search endpoint configuration to the frontend;
   remove page-specific city/airport endpoint names.
2. Ensure homepage publication builds a canonical `HomepagePageModel` payload; retire frontend use
   of legacy `build_homepage_discovery`.
3. Remove embedded route options from `build_route_page_payload` and keep results in
   `rpc_search_routes`.
4. Define whether weekly frequency is part of `route_search_options`. If approved source data exists,
   return a nullable frequency summary with provenance; otherwise remove frequency from interactive
   result UI.
5. Ensure every estimated price uses the existing explicit availability state and expiry contract.
6. Preserve airport two-direction, direct-only route-search behavior.
7. Keep all read-model publication and indexability rules in PostgreSQL.

These are contract corrections, not a redesign of canonical aviation tables.

## 9. Error and empty-state behavior

- Invalid route identity calls Next.js `notFound()`.
- Missing current publication calls `notFound()` only for stable backend not-found codes.
- Transport timeout, malformed envelope, or schema mismatch renders the route-level unavailable
  boundary and does not leak raw backend errors.
- An empty route result is a successful state with filter-reset guidance.
- Missing fare, frequency, source, facility, lounge, or commercial offer hides only the dependent
  field/module; it never produces a fabricated value.
- Client filter changes are reflected in canonical URL parameters and remain usable without
  JavaScript through server navigation.

## 10. Testing strategy

Use test-first development for every parser and non-trivial interaction.

Required coverage:

- DTO tests for all four page envelopes and route-search envelopes.
- Application tests for backend not-found, unavailable, timeout, and malformed-payload behavior.
- Presentation tests for conditional sections and unknown values.
- URL-filter parsing/serialization round trips.
- Route scope tests for city, city-pair, airport-from, and airport-to requests.
- Accessibility tests for search controls, filter groups, tab semantics, tables, accordions, focus,
  and keyboard interaction.
- Indexability and canonical metadata tests.
- Responsive browser verification against all four Stitch screens.
- Full lint, typecheck, unit test, and production build verification.

## 11. Delivery order

1. Shared page and route-search transport contracts.
2. Shared semantic UI primitives.
3. Journey-led Airport Page vertical slice.
4. City Hub vertical slice.
5. Route Page vertical slice and backend option-payload separation.
6. Homepage vertical slice.
7. Cross-page responsive, accessibility, indexing, and production verification.

Airport Page is first because its current backend contract most closely matches the accepted Stitch
screen. Homepage is last because origin resolution, autocomplete, and discovery fallback behavior
depend on the shared route-search foundation.

## 12. Intentional exclusions

- Legacy Airport Hub UI and backend presentation fields.
- Header or footer redesign.
- Live dated availability, booking, or fare claims.
- Unapproved affiliate redirects or placeholder sponsored cards.
- Indexable filter combinations.
- A generic CMS-style section renderer.
- Production provider credentials, deployment, or database mutation as part of frontend delivery.
