# Tripways Next.js Clean Architecture Design

## Goal

Refactor Tripways Web into a pragmatic, feature-first Next.js architecture that keeps framework,
application, domain, infrastructure, and presentation responsibilities explicit. The result must be
easy for a new developer to trace, test, and extend without copying Flutter-specific controller and
repository layers into the web.

This phase consumes the new breaking Route Discovery Edge contract and removes direct browser/web
knowledge of the Supabase service-role key.

## Scope

This phase includes:

- feature-first organization for Route Discovery;
- domain types and errors independent of Next.js and transport details;
- application use cases representing the two current user intents;
- one Route Discovery provider port;
- one server-only Edge provider adapter;
- strict response DTO parsing and mapping;
- presentation components colocated with the feature;
- route files reduced to parameter handling, metadata, loading/error decisions, and composition;
- a small feature public API;
- migration of current tests and addition of architecture/contract tests.

Global layout, homepage-only marketing sections, shared UI primitives, and site configuration remain
outside Route Discovery because they are not Route Discovery domain code.

## Target File Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── flights-from/
│   │   └── [iata]/
│   │       └── page.tsx
│   └── routes/
│       └── [from]/
│           └── [to]/
│               └── page.tsx
├── features/
│   └── route-discovery/
│       ├── domain/
│       │   ├── airport.ts
│       │   ├── route-option.ts
│       │   ├── route-filters.ts
│       │   └── route-discovery-error.ts
│       ├── application/
│       │   ├── route-discovery-provider.ts
│       │   ├── search-routes.ts
│       │   └── discover-destinations.ts
│       ├── infrastructure/
│       │   ├── route-search-response.dto.ts
│       │   ├── edge-route-discovery-provider.ts
│       │   └── route-discovery-environment.ts
│       ├── presentation/
│       │   ├── destination-card.tsx
│       │   ├── route-map.tsx
│       │   ├── route-option-card.tsx
│       │   ├── airport-search-form.tsx
│       │   └── filter-toolbar.tsx
│       ├── server.ts
│       └── index.ts
├── components/
│   ├── home/
│   ├── layout/
│   └── ui/
├── config/
└── lib/
    └── shared technical utilities only
```

Exact filenames may be consolidated when a split would create a pass-through file, but dependency
direction and ownership must remain unchanged.

## Dependency Rules

```text
presentation → application → domain
infrastructure → application + domain
app → feature public API/server composition + shared layout
domain → no inward dependency
```

Enforcement rules:

- domain files cannot import React, Next.js, `fetch`, environment variables, or Supabase;
- application use cases cannot import Next.js, environment variables, or concrete infrastructure;
- infrastructure cannot import presentation;
- client components cannot import `server.ts` or infrastructure;
- app routes cannot import raw DTO parsers or concrete providers directly;
- shared UI cannot import Route Discovery.

Focused architecture tests or lint-import restrictions will protect these boundaries without adding
a new dependency unless the existing toolchain cannot express the checks.

## Domain

Domain uses readonly TypeScript data types and pure validation/normalization where appropriate.
Entity classes are not introduced when objects are sufficient.

The domain owns:

- `Airport`;
- `RouteOption`;
- `RouteFilters`;
- stable Route Discovery error categories;
- pure filter and airport rules that are independent of transport.

The domain does not own wire envelopes, HTTP status codes, environment names, or Supabase error
messages.

## Application

Application represents current user intent:

- `searchRoutes`: find route options between an origin and destination;
- `discoverDestinations`: discover reachable fixture destinations from one origin.

Both depend on a narrow `RouteDiscoveryProvider` port. The use cases own orchestration and return
domain results. They do not parse unknown JSON or render UI.

Dependency injection is direct:

```ts
const searchRoutes = createSearchRoutes({ routeDiscoveryProvider });
```

There is no generic `UseCase` interface, base class, repository abstraction, service locator, or DI
container.

## Infrastructure

The server-only Edge provider:

- reads validated server environment;
- calls the versioned Route Discovery Edge endpoint;
- sends the new request DTO;
- parses the unknown response;
- maps DTOs into domain objects/results;
- converts transport/contract errors into stable domain errors;
- never returns raw JSON to application or presentation.

`route-discovery-environment.ts` validates only values needed by this provider. Secret values cannot
be exported through a client-reachable module.

## Presentation and App Router

Route Discovery presentation components move under the feature. They accept domain data and
callbacks rather than fetching server data themselves.

Server route files:

- validate and normalize route parameters;
- obtain the server composition through `features/route-discovery/server.ts`;
- invoke the correct application use case;
- select not-found, empty, retryable error, or success UI;
- render feature presentation components.

Client components own only form state, filters, and navigation. They do not call Supabase or import
the server provider.

Homepage marketing sections remain under `components/home`. The Route Search form may use the
feature presentation component through the feature public API.

## Public APIs

`features/route-discovery/index.ts` exports client-safe domain/presentation items.
`features/route-discovery/server.ts` is the server-only composition root and exports ready-to-call
application operations.

Consumers do not deep-import infrastructure:

```ts
import { RouteMap, RouteOptionCard } from "@/features/route-discovery";
import { routeDiscovery } from "@/features/route-discovery/server";
```

This prevents accidental transport leakage and gives new developers two obvious entry points.

## Data Flow

```text
Next.js route params/searchParams
→ application input
→ use case
→ RouteDiscoveryProvider port
→ server-only Edge adapter
→ strict response DTO parser
→ domain result
→ presentation props
```

The previous direct `/rest/v1/rpc/rpc_search_routes` call and
`SUPABASE_SERVICE_ROLE_KEY` dependency are removed from Tripways Web.

## Error Handling

Stable application errors distinguish:

- invalid route search;
- unavailable Route Discovery service;
- violated backend contract.

Pages map these errors deliberately:

- invalid path/search parameters become not-found or visible validation state;
- a valid empty result becomes an empty state, not an exception;
- service unavailability produces retryable safe UI;
- contract violations produce a safe generic error and server-side diagnostic logging.

Raw SQL, Edge stack traces, secret values, and internal URLs never reach rendered error messages.

## Testing

Tests cover:

- pure domain filters and airport normalization;
- use cases with a small in-memory/fake port implementation;
- DTO parser acceptance and rejection;
- Edge provider request shape, status handling, and domain mapping using injected `fetch`;
- server composition environment validation;
- route/page rendering for success, empty, invalid, and unavailable outcomes;
- architecture boundaries preventing client imports of server/infrastructure modules;
- existing component accessibility and responsive behavior.

Implementation follows test-first development. File moves preserve behavioral tests before obsolete
paths are removed.

Full verification includes Vitest, ESLint, TypeScript, Next.js production build, and responsive
browser checks at representative mobile, tablet, and desktop widths.

## Migration Order

1. Create domain types and preserve existing pure behavior tests.
2. Lock application port and use-case behavior with failing tests.
3. Implement strict DTO parsing for the new Edge response.
4. Implement the server-only Edge provider.
5. Add the server composition root.
6. Move Route Discovery presentation into the feature.
7. Migrate App Router pages to application operations.
8. Migrate homepage search imports.
9. Remove legacy `src/lib/route-discovery.ts`, `src/lib/route-filters.ts`,
   `src/lib/airports.ts`, and old Route Discovery component directories after all consumers move.
10. Remove service-role environment requirements from Tripways Web.
11. Run full automated and browser verification.

## Explicit Non-Goals

- No mobile-style controller or long-lived application state layer for Server Components.
- No generic repository layer between application and the Route Discovery provider.
- No shared backend/web source package.
- No entity base class, DTO base class, provider factory, or DI framework.
- No live fares, booking, auth, caching, production map provider, or CMS in this refactor.
