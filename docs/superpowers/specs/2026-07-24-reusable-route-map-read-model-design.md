# Reusable Route Map Read Model Design

## Status

Approved for planning on 2026-07-24.

## Goal

Replace the CSS-only city-page map with a real interactive direct-route map backed by published
Supabase route data. Keep the map as an independent feature so the same frontend domain,
application, infrastructure, and presentation code can later render airport-page route maps.

## Product Decisions

- The Bangkok city page uses one origin point at the Bangkok city coordinates.
- All route lines originate from that city point, even when the underlying routes depart from BKK
  or DMK.
- Each destination point represents a destination city, not an individual airport.
- Airport and airline data remain route metadata and filtering inputs.
- The map represents the published direct-route graph. It is not live aircraft tracking.
- The initial city implementation may return at most 100 destination cities.
- The frontend feature is reusable for city and airport origins, but the first backend contract
  implements only the city origin. Airport-origin support is added when the airport page is built.

## Existing State

The current city-page `CityRouteMap` is a static draft composed of CSS, fixed region labels, and a
route count. It does not consume coordinates or draw backend routes.

The web repository already contains a MapLibre client, GeoJSON construction, great-circle
interpolation, accessible loading/error fallbacks, and popup behavior under `route-discovery`.
These proven parts should be moved or reused by the new focused `route-map` feature instead of
being rewritten.

The backend already stores latitude and longitude for cities and airports. The existing city
destination RPC aggregates routes by destination city but does not return destination
coordinates. Extending that paginated read model would couple the map to destination-card loading,
so the map requires its own read model.

## Architecture

### Backend

The backend exposes an independent city route-map query:

```text
Next.js server
  -> City Page Edge query action: get_route_map
    -> public.rpc_get_city_route_map(JSONB)
      -> private.get_city_route_map(...)
        -> public.city_direct_routes
        -> public.cities
        -> public.countries
        -> public.airports
        -> public.airlines
```

The private helper owns reusable route-map aggregation. The RPC owns public input validation,
city-page context resolution, version selection, and the standard `data/meta/error` envelope. The
Edge Function remains a thin privileged transport.

The RPC must use the same published `data_version` as the other city-page read models. It must
never expose unpublished or fixture-only data as production-indexable content.

### Frontend

Create a top-level `route-map` feature:

```text
src/features/route-map/
├── domain/
│   ├── route-map-model.ts
│   └── build-route-geojson.ts
├── application/
│   ├── route-map-repository.ts
│   └── get-route-map.ts
├── infrastructure/
│   ├── edge-route-map-repository.ts
│   └── route-map-response.dto.ts
└── presentation/
    ├── route-map.tsx
    ├── route-map-client.tsx
    ├── route-map-popup.tsx
    └── route-map-fallback.tsx
```

The route-map feature must not import city-page presentation code. The city page composes the
feature by passing a city-origin query and the current route filters.

The application boundary uses a generic origin identity:

```ts
type RouteMapOrigin =
  | Readonly<{ type: "city"; slug: string }>
  | Readonly<{ type: "airport"; iata: string }>;
```

Only the city origin is sent to the backend in the first implementation. The airport variant keeps
the frontend domain boundary reusable, but the repository must reject it explicitly until the
backend implements airport-origin resolution. It must not silently translate an airport into a
city query.

## Read Model Contract

The successful response data contains:

```json
{
  "origin": {
    "type": "city",
    "name": "Bangkok",
    "slug": "bangkok",
    "latitude": 13.7563,
    "longitude": 100.5018
  },
  "destinations": [
    {
      "city_name": "Tokyo",
      "city_slug": "tokyo",
      "country_iso2": "JP",
      "country_name": "Japan",
      "latitude": 35.6762,
      "longitude": 139.6503,
      "route_path": "/flights/bangkok-to-tokyo",
      "origin_airports": ["BKK", "DMK"],
      "destination_airports": ["HND", "NRT"],
      "airlines": ["TG", "JL"],
      "shortest_duration_minutes": 345,
      "frequency_per_week": 42
    }
  ]
}
```

Metadata contains:

- `data_version`
- `total`
- the normalized filters applied by the query
- `limit`

The map destination list is aggregated by destination city. Multiple airport-to-airport route
records must produce one destination point and one city-to-city line.

## Filters

The first route-map query accepts the same bounded city-route filters already used by destination
discovery:

- `origin_airports`
- `airlines`
- `destination_countries`
- `max_duration_minutes`
- `departure_window`

Filtering changes which destination cities and route lines appear. It does not change the Bangkok
origin coordinates. The RPC must derive all results from one filtered relation so map results and
reported totals cannot disagree.

Pagination offsets do not belong to the map contract. The map returns the top eligible cities up
to its bounded limit, ranked by frequency, duration, confidence, and stable city name ordering.

## Map Rendering

- Use MapLibre with the existing configured map style.
- Build GeoJSON inside the route-map domain layer.
- Generate one great-circle line from the origin city to every destination city.
- Render the origin as a larger dot with a distinct color.
- Render destination cities as smaller blue dots with white strokes.
- Fit bounds to the origin, destinations, and interpolated route geometry.
- Disable scroll zoom by default to avoid trapping page scrolling.
- Retain zoom controls without a compass.
- A destination click opens an escaped popup containing city, country, airport codes, airlines,
  shortest duration, and an internal route link.
- Loading and error states retain the same map height to avoid layout shift.
- Empty results show the origin and an explicit “No direct routes match these filters” state.

## Page Composition and Loading Isolation

The city page loads the route map inside its own Suspense boundary. A map transport, parsing, tile,
or WebGL failure must not block the hero, filters, destinations, Quick Facts, or other read models.

MapLibre remains a client-only dependency and is dynamically loaded by the focused presentation
component. The route-map data itself is loaded on the server through the repository and use case.

The city page must remove the static `CityRouteMap` markup after the real feature is connected.

## Security and Data Boundaries

- The browser never receives the Supabase service-role key.
- The public client does not call the RPC directly.
- The Edge Function calls the service-role-only RPC.
- SQL uses `SECURITY INVOKER`, an explicit empty `search_path`, least-privilege grants, and bounded
  input validation.
- HTML inserted into MapLibre popups must be escaped, including values originating from the
  database.
- The frontend DTO validates every external field before rendering.

## Error Handling

- Invalid filters return the existing city-page invalid-request error contract.
- A missing or unpublished city returns the existing not-found/unavailable contract.
- Missing destination coordinates exclude that destination from the map and are reported in
  metadata as an omitted count; they must not produce invalid GeoJSON.
- A failed read model renders only the route-map unavailable state.
- A tile or WebGL failure renders the accessible route-map fallback using the already loaded
  origin and destination data.

## Testing

### Backend

- Observe a failing SQL contract before implementing the helper and RPC.
- Verify origin coordinates and distinct destination-city aggregation.
- Verify multiple routes to one city create one destination entry.
- Verify airport, airline, country, duration, and departure-window filters.
- Verify the 100-city bound and deterministic ordering.
- Verify missing coordinates are omitted and counted.
- Verify anonymous and authenticated roles cannot execute the RPC.
- Run a clean migration regeneration, local database reset, SQL snippets, Deno tests, formatting,
  type checks, and database lint.

### Frontend

- Observe failing domain, DTO, repository, use-case, and presentation tests first.
- Verify great-circle GeoJSON and the distinct origin/destination point roles.
- Verify strict response parsing and airport-origin rejection until supported.
- Verify city-page composition passes the current filters.
- Verify loading, empty, unavailable, and MapLibre error fallbacks.
- Run unit tests, ESLint, TypeScript checks, production build, and responsive browser checks.

## Out of Scope

- Live aircraft positions or flight tracking.
- Live fares and dated itinerary availability.
- Airport-page backend origin resolution.
- Route animations, clustering, heatmaps, or three-dimensional globes.
- A new tile provider or paid geocoding service.
- SEO content derived from the canvas; indexable route content remains in server-rendered HTML.

## Acceptance Criteria

1. The Bangkok city page renders a real interactive map from the published Supabase route graph.
2. Bangkok appears as one visually distinct origin point.
3. Every eligible destination city appears once and connects to Bangkok with a great-circle line.
4. Airport and other supported filters update the map without changing the origin point.
5. The map has an independent backend read model and frontend loading boundary.
6. The frontend route-map feature has no city-page-specific presentation dependency.
7. Existing route-map implementation is reused where it meets this contract.
8. All repository verification commands pass from a clean local database foundation.
