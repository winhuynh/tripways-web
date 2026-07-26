# Tripways Web Code Map

This map explains where page composition, UI, use cases, and data adapters live.
Code remains the source of truth; this document is a navigation aid.

## Route ownership

| URL | Thin Next.js entry | Feature-owned page composition |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | `src/features/home-page/presentation/home-page.tsx` |
| `/flights-from/[citySlug]` | `src/app/flights-from/[citySlug]/page.tsx` | `src/features/city-page/presentation/city-page.tsx` |
| `/api/city-page/destinations` | `src/app/api/city-page/destinations/route.ts` | `src/features/city-page/infrastructure/city-destinations-http.ts` |

Route files translate framework inputs and outputs only. Feature folders own
page composition, business orchestration, parsing, and UI.

## Feature layers

- `domain/`: stable business models, validation rules, and pure transforms.
- `application/`: use cases and repository ports.
- `infrastructure/`: Supabase Edge Function adapters, environment readers, and
  response parsers.
- `presentation/`: page sections, interactive UI, and loading/error states.
- `server.ts`: server-only dependency composition exposed to route entries and
  server components.
- `index.ts`: the supported public imports for a feature.

## City Hub page

- Page composition: `src/features/city-page/presentation/city-page.tsx`
- Independent section loaders:
  `src/features/city-page/presentation/city-page-sections.tsx`
- Search parameter normalization:
  `src/features/city-page/application/city-page-query.ts`
- Read-model use cases:
  `src/features/city-page/application/get-city-read-models.ts`
- Repository contract:
  `src/features/city-page/application/city-page-repository.ts`
- Edge adapter:
  `src/features/city-page/infrastructure/edge-city-page-repository.ts`
- Edge response validation:
  `src/features/city-page/infrastructure/city-page-response.dto.ts`
- Metadata composition:
  `src/features/city-page/presentation/city-page-metadata.ts`

Each independent section receives its own read-model promise and Suspense
boundary so a slow optional block does not hold back unrelated content.

## Route map

- Reusable public UI:
  `src/features/route-map/presentation/route-map.tsx`
- MapLibre lifecycle and interaction:
  `src/features/route-map/presentation/route-map-client.tsx`
- Pure GeoJSON conversion:
  `src/features/route-map/domain/build-route-geojson.ts`
- Map read use case:
  `src/features/route-map/application/get-route-map.ts`
- Edge repository:
  `src/features/route-map/infrastructure/edge-route-map-repository.ts`

The route-map feature is independent from City Hub presentation so an airport
page can reuse it later by supplying the corresponding origin read model.

## Shared UI

Reusable site primitives live in `src/shared/ui`. Feature-specific visuals stay
inside the owning feature instead of becoming global components prematurely.

## Comment convention

- Exported components, use cases, repository ports, parsers, and route handlers
  use short JSDoc that explains responsibility or boundary.
- Non-obvious orchestration may use a section comment.
- Trivial local helpers remain self-documenting and are not commented line by
  line.
