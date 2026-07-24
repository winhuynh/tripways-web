# Tripways City Page Read-Model Design

## Goal

Build a draft Bangkok city page that can render the approved page structure from backend data while
keeping the UI intentionally replaceable. The implementation must follow the existing pragmatic
Clean Architecture used by Tripways and the client-to-Edge-to-RPC boundary used by Slofi.

The page route is `/flights-from/bangkok`. It represents Bangkok as a city hub containing both BKK
and DMK, rather than treating BKK as the city identity.

## Success Criteria

- SEO-critical content is rendered by Next.js Server Components.
- Each page section consumes a bounded read model through its own application use case.
- A slow, empty, or unavailable secondary section does not prevent other sections from rendering.
- Web code never calls PostgreSQL RPCs directly and never receives a Supabase service-role key.
- The Edge boundary exposes a small action contract and owns internal RPC invocation.
- PostgreSQL remains the source of truth for publication, indexability, filtering, and route facts.
- The draft follows the supplied visual hierarchy without treating the current styling as final.
- The production build has no avoidable client JavaScript for static SEO content.

## End-to-End Boundary

```text
Next.js Server Component
→ city-page application use case
→ CityPageRepository port
→ server-only EdgeCityPageRepository
→ city-page-query Edge Function
→ one bounded PostgreSQL RPC
→ read-model tables
```

Interactive browser controls use a Next.js Route Handler as a same-origin boundary:

```text
Client filter/search control
→ Next.js Route Handler
→ city-page application use case
→ Edge Function
→ search RPC
```

The browser never imports the server repository, internal DTO parser, Supabase URL, or server
credential.

## Backend Read Models

The backend exposes independent read contracts for the sections that need independent loading or
different cache behavior.

### Overview

`rpc_get_city_overview` returns:

- city and country identity;
- SEO title, meta description, canonical path, H1, intro, and publication state;
- indexability, noindex reason, data version, generated time, and source freshness;
- quick facts required above the fold.

Overview is the required page identity. A missing overview produces `notFound()`.

### Airports

`rpc_get_city_airports` returns one card per active city airport, including BKK and DMK, airport
identity, primary status, coordinates, direct destination count, airline count, and airport-page
path.

### Destinations

The existing `rpc_search_city_direct_routes` remains the destination/filter read model. It returns
destination cards, facets, pagination, and data version. Initial server rendering uses default
filters; interactive filters use the same action contract through a same-origin Route Handler.

### Airlines

`rpc_get_city_airlines` returns airlines operating direct services from the city, their IATA code,
name, served origin airports, direct destination count, and semantic page path.

### Insights

`rpc_get_city_insights` returns factual derived values only:

- most popular destination when supported by frequency data;
- shortest-duration route;
- longest route;
- top airline;
- average direct duration;
- direct country count.

Unknown facts remain `null`; the frontend does not invent values.

### Internal Links

`rpc_get_city_internal_links` returns reviewed links grouped by semantic cluster. It powers popular
routes, countries, regions, related pages, collections, and change-source-city sections. Links are
rendered as server-side `<a href>` elements.

### FAQs

`rpc_get_city_faqs` returns only published FAQs in display order. The same read model powers visible
content and `FAQPage` JSON-LD.

### Map

The map consumes the airport and initial destination read models. It is not a separate database
RPC. Its visual runtime is loaded after the text route content and receives only serializable map
points.

## Edge API

One Edge Function owns the feature boundary:

```http
POST /functions/v1/city-page-query
```

Supported actions:

```text
get_overview
get_airports
get_destinations
get_airlines
get_insights
get_internal_links
get_faqs
```

Request envelope:

```json
{
  "action": "get_overview",
  "input": {
    "city_slug": "bangkok",
    "locale": "en-GB"
  }
}
```

The Edge Function:

- accepts `POST` only;
- validates action-specific bounded input;
- calls an allow-listed RPC with a server-side service role;
- normalizes the internal RPC envelope into one public response contract;
- returns safe HTTP errors without internal SQL, URLs, keys, or stack traces;
- applies public-read rate limiting only when the shared policy is ready;
- does not add Redis or another cache in this phase.

## Web Feature Architecture

```text
src/features/city-page/
├── domain/
│   ├── city-overview.ts
│   ├── city-airport.ts
│   ├── city-destination.ts
│   ├── city-airline.ts
│   ├── city-insights.ts
│   ├── city-internal-link.ts
│   ├── city-faq.ts
│   └── city-page-error.ts
├── application/
│   ├── city-page-repository.ts
│   ├── get-city-overview.ts
│   ├── get-city-airports.ts
│   ├── get-city-destinations.ts
│   ├── get-city-airlines.ts
│   ├── get-city-insights.ts
│   ├── get-city-internal-links.ts
│   └── get-city-faqs.ts
├── infrastructure/
│   ├── city-page-environment.ts
│   ├── city-page-response.dto.ts
│   └── edge-city-page-repository.ts
├── presentation/
│   ├── city-hero.tsx
│   ├── city-route-search.tsx
│   ├── city-route-map.tsx
│   ├── city-filter-toolbar.tsx
│   ├── city-destinations-section.tsx
│   ├── city-airports-section.tsx
│   ├── city-airlines-section.tsx
│   ├── city-collections-section.tsx
│   ├── city-insights-section.tsx
│   ├── city-internal-links-section.tsx
│   ├── city-faq-section.tsx
│   └── section-fallback.tsx
├── server.ts
└── index.ts
```

The exact presentation filenames may be consolidated when a split would create a pass-through
component. Domain, application, infrastructure, and presentation dependency directions remain
fixed.

## Repository and Use Cases

`CityPageRepository` is a feature port with explicit methods:

```ts
interface CityPageRepository {
  getOverview(input: CityPageIdentity): Promise<CityOverview>;
  getAirports(input: CityPageIdentity): Promise<readonly CityAirport[]>;
  getDestinations(input: CityDestinationQuery): Promise<CityDestinationResult>;
  getAirlines(input: CityPageIdentity): Promise<readonly CityAirline[]>;
  getInsights(input: CityPageIdentity): Promise<CityInsights>;
  getInternalLinks(input: CityPageIdentity): Promise<readonly CityInternalLinkGroup[]>;
  getFaqs(input: CityPageIdentity): Promise<readonly CityFaq[]>;
}
```

Each use case represents one user-facing read intent and depends only on this port. There is no
generic repository, base use-case class, DI container, controller layer, or global store.

The server composition root constructs the concrete Edge repository and exports ready-to-call use
cases. Client-safe exports never re-export infrastructure or environment modules.

## Independent Loading

The page loads the overview first because it owns canonical metadata, H1, and publication identity.
All other server sections load independently under local `<Suspense>` boundaries.

Each async section converts expected repository failures into one section state:

```text
available
empty
unavailable
```

Expected secondary failure renders a compact unavailable state and does not throw through the page.
Unexpected programming or contract errors are logged server-side and rendered safely.

Independent loading does not mean every decorative element receives an RPC. Related elements that
share one semantic read model remain together:

- overview and quick facts;
- destinations and destination facets;
- FAQs and FAQ JSON-LD;
- internal-link groups and collections/change-source links.

## SEO and Core Web Vitals

### Server rendering

The following appear in server-rendered HTML:

- canonical metadata and robots state;
- H1 and intro;
- initial destination links;
- airport and airline links;
- internal-link clusters;
- FAQ content and JSON-LD.

### LCP

- The hero is text-first and does not require client hydration.
- Above-the-fold layout reserves stable map and search dimensions.
- No large JavaScript-driven hero image is introduced.
- Destination images use explicit dimensions and responsive image sizing.

### CLS

- Every streamed section has a fallback with a matching minimum block size.
- Images, map, cards, newsletter, and advertising placeholders reserve dimensions.
- Font fallback uses the local/system stack until a deliberate font decision is made.

### INP and JavaScript

- Static sections remain Server Components.
- Only search, filters, show-more behavior, and MapLibre runtime are Client Components.
- No page-wide context provider or client data cache is introduced.
- Filter input updates are scoped to the destination result region.

### Metadata

`generateMetadata` uses the overview use case. Database-controlled `is_indexable` and
`noindex_reason` determine robots output; the web does not infer production eligibility.

## Draft Page Composition

The draft follows this order:

1. Header and breadcrumb
2. City hero and quick facts
3. Direct-route search
4. Route map
5. Filter toolbar
6. Destinations
7. Direct-flight airport hubs
8. Airlines
9. Explore collections
10. Travel insights
11. Semantic internal-link groups
12. FAQs
13. Change source city
14. Related pages
15. Footer

Styling uses the existing navy, blue, off-white direction and the supplied screenshot as layout
reference. It intentionally avoids a detailed design system or pixel-perfect reconstruction because
the user will revise UI later.

## Error and Security Rules

- The web uses `SUPABASE_URL` and `SUPABASE_ANON_KEY` only in server-only infrastructure.
- The service-role key exists only in the Edge runtime.
- PostgreSQL RPCs and private helpers remain executable only by `service_role`.
- Public clients cannot access underlying read-model tables.
- DTO parsing treats every Edge response as `unknown`.
- No raw provider data, SQL error, stack trace, internal UUID requirement, or secret is rendered.
- Development fixtures remain non-indexable.

## Testing

Backend tests cover:

- each new RPC output contract and empty/not-found behavior;
- Edge action routing and request validation;
- safe error mapping;
- service-role-only RPC and helper grants;
- anon/authenticated denial;
- regression of existing Route Discovery and city pSEO behavior.

Web tests cover:

- domain types and page identity rules;
- every use case with a fake repository;
- strict DTO parsing for each action;
- Edge repository request and response mapping;
- server section states for available, empty, and unavailable data;
- metadata and robots output;
- FAQ JSON-LD consistency;
- client/server import boundaries;
- accessibility of search and filter controls.

Final verification includes database reset, SQL E2E, Deno tests/check, Vitest, ESLint, TypeScript,
Next.js production build, and browser checks at mobile, tablet, and desktop widths.

## Delivery Boundaries

Included:

- backend per-read-model RPCs;
- one city-page Edge query function;
- Next.js city-page feature architecture;
- `/flights-from/[citySlug]` draft route;
- Bangkok local seed rendering;
- section isolation, SEO metadata, JSON-LD, and responsive draft layout.

Excluded:

- live pricing and booking;
- authentication;
- production provider ingestion;
- Redis/Upstash cache;
- CMS editing;
- analytics and advertising integrations;
- pixel-perfect final UI;
- deployment, commit, or push.
