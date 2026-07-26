# Reusable Route Map Read Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Bangkok city-page draft map with an independently loaded MapLibre map driven by a dedicated Supabase route-map read model that can later support airport-page origins.

**Architecture:** PostgreSQL aggregates a versioned, filtered city-to-city map read model behind a private helper and service-role-only RPC. The existing City Page Edge Function transports that envelope. Next.js consumes it through a standalone `route-map` domain/application/infrastructure/presentation feature and composes it into the city page under its own Suspense boundary.

**Tech Stack:** PostgreSQL, Supabase CLI, Supabase Edge Functions with Deno, Next.js App Router, strict TypeScript, React Server Components, MapLibre GL, GeoJSON, Vitest, Testing Library.

**Repository constraint:** Do not commit or push automatically. The repository workflow rules override the generic frequent-commit guidance; each task ends with a verification checkpoint instead.

---

### Task 1: Define the backend route-map SQL contract

**Files:**
- Modify: `tripways-backend/supabase/snippets/e2e_city_page_read_models.sql`
- Create: `tripways-backend/supabase/sql_src/functions/pseo/get_city_route_map.sql`
- Create: `tripways-backend/supabase/sql_src/functions/pseo/rpc_get_city_route_map.sql`
- Modify: `tripways-backend/scripts/regenerate-supabase-migrations.sh`

- [ ] **Step 1: Write the failing SQL contract**

Add an assertion block that calls:

```sql
SELECT public.rpc_get_city_route_map(
  jsonb_build_object(
    'city_slug', 'bangkok',
    'locale', 'en',
    'limit', 100
  )
)
INTO v_route_map;
```

Assert:

```sql
IF v_route_map #>> '{data,origin,type}' <> 'city'
  OR v_route_map #>> '{data,origin,name}' <> 'Bangkok'
  OR (v_route_map #>> '{data,origin,latitude}')::DOUBLE PRECISION <> 13.7563
  OR (v_route_map #>> '{data,origin,longitude}')::DOUBLE PRECISION <> 100.5018
THEN
  RAISE EXCEPTION 'City route-map origin contract failed: %', v_route_map;
END IF;
```

Verify destination cities are distinct, include coordinates and route metadata, `meta.total` matches
the filtered set, `meta.omitted_destination_count` is present, and `anon` cannot execute the RPC.

- [ ] **Step 2: Run the contract and observe RED**

Run:

```bash
cd tripways-backend
psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f supabase/snippets/e2e_city_page_read_models.sql
```

Expected: failure because `public.rpc_get_city_route_map(JSONB)` does not exist.

- [ ] **Step 3: Implement the private aggregation helper**

Create:

```sql
private.get_city_route_map(
  p_city_id UUID,
  p_city_slug TEXT,
  p_data_version UUID,
  p_origin_airports TEXT[],
  p_airlines TEXT[],
  p_destination_countries TEXT[],
  p_max_duration_minutes INTEGER,
  p_departure_window TEXT,
  p_limit INTEGER
) RETURNS JSONB
```

The helper must:

- Materialize one filtered `public.city_direct_routes` relation.
- Join origin airports, operating airlines, destination countries, and destination cities.
- Aggregate one record per destination city.
- Omit destination cities with missing coordinates.
- Rank by known weekly frequency descending, shortest duration ascending, confidence descending,
  then city name.
- Return `origin`, `destinations`, `total`, and `omitted_destination_count`.
- Preserve unknown frequency as `NULL`.
- Use `LANGUAGE sql`, `STABLE`, `SECURITY INVOKER`, and `SET search_path = ''`.

- [ ] **Step 4: Implement the public RPC**

Create:

```sql
public.rpc_get_city_route_map(p_input JSONB) RETURNS JSONB
```

Reuse:

- `private.parse_city_page_identity`
- `private.resolve_city_page_context`
- existing airport and airline normalizers
- the existing filter bounds from `public.rpc_search_city_direct_routes`

Accept `limit` from 1 through 100 and no offset. Return the standard `data/meta/error` envelope with:

```json
{
  "meta": {
    "city_slug": "bangkok",
    "locale": "en",
    "data_version": "uuid",
    "total": 5,
    "omitted_destination_count": 0,
    "limit": 100,
    "filters": {}
  }
}
```

Revoke execution from `public`, `anon`, and `authenticated`; grant only `service_role`.

- [ ] **Step 5: Register deterministic migration ordering**

Add the helper before the RPC and add the RPC before grants/tests in:

```text
tripways-backend/scripts/regenerate-supabase-migrations.sh
```

- [ ] **Step 6: Run the SQL contract and observe GREEN**

Run the same `psql` command. Expected: the city-page contract finishes without an exception.

### Task 2: Add the Edge Function route-map transport

**Files:**
- Modify: `tripways-backend/supabase/functions/v1/city-page/query/request.ts`
- Modify: `tripways-backend/supabase/functions/v1/city-page/query/index.ts`
- Modify: `tripways-backend/supabase/functions/v1/city-page/query/tests/request.test.ts`

- [ ] **Step 1: Write the failing request parser test**

Add:

```ts
Deno.test('city page request accepts the get_route_map action', () => {
  const request = parseCityPageRequest({
    action: 'get_route_map',
    input: {
      city_slug: 'bangkok',
      locale: 'en',
      origin_airports: ['BKK'],
      limit: 100,
    },
  });

  assertEquals(request.action, 'get_route_map');
  assertEquals(request.input.origin_airports, ['BKK']);
});
```

- [ ] **Step 2: Run the focused Deno test and observe RED**

Run:

```bash
cd tripways-backend
deno test supabase/functions/v1/city-page/query/tests/request.test.ts
```

Expected: invalid action failure.

- [ ] **Step 3: Add the thin action mapping**

Add `get_route_map` to the action union and map it to:

```ts
rpc_get_city_route_map
```

Do not add aggregation logic to the Edge Function.

- [ ] **Step 4: Run the focused Deno test and observe GREEN**

Run the same Deno command. Expected: all request parser tests pass.

### Task 3: Create the standalone frontend route-map domain and DTO

**Files:**
- Create: `tripways-web/src/features/route-map/domain/route-map-model.ts`
- Move and adapt: `tripways-web/src/features/route-discovery/domain/route-map.ts`
- Create: `tripways-web/src/features/route-map/domain/build-route-geojson.test.ts`
- Create: `tripways-web/src/features/route-map/infrastructure/route-map-response.dto.ts`
- Create: `tripways-web/src/features/route-map/infrastructure/route-map-response.dto.test.ts`

- [ ] **Step 1: Write failing domain tests**

Define the expected domain boundary:

```ts
export type RouteMapOriginIdentity =
  | Readonly<{ type: "city"; slug: string }>
  | Readonly<{ type: "airport"; iata: string }>;

export type RouteMapPoint = Readonly<{
  type: "city";
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
}>;

export type RouteMapDestination = Readonly<{
  cityName: string;
  citySlug: string;
  countryIso2: string;
  countryName: string;
  latitude: number;
  longitude: number;
  routePath: string;
  originAirports: readonly string[];
  destinationAirports: readonly string[];
  airlines: readonly string[];
  shortestDurationMinutes: number;
  frequencyPerWeek: number | null;
}>;
```

Test that GeoJSON contains:

- one origin point with role `origin`
- one point per destination with role `destination`
- one 65-coordinate great-circle line per destination
- bounds containing origin, destinations, and interpolated paths

- [ ] **Step 2: Run the domain test and observe RED**

Run:

```bash
cd tripways-web
npm test -- src/features/route-map/domain/build-route-geojson.test.ts
```

Expected: module not found.

- [ ] **Step 3: Move the reusable GeoJSON implementation**

Move the generic interpolation and GeoJSON construction out of `route-discovery`. Rename
airport-specific properties to generic route-map properties. Keep interpolation deterministic and
dependency-free.

- [ ] **Step 4: Write the failing DTO test**

Test strict parsing of the SQL envelope, including nullable frequency, meta fields, normalized
filters, and rejection of missing or non-finite coordinates.

- [ ] **Step 5: Run the DTO test and observe RED**

Run:

```bash
npm test -- src/features/route-map/infrastructure/route-map-response.dto.test.ts
```

Expected: parser module not found.

- [ ] **Step 6: Implement the strict DTO parser**

Export:

```ts
parseRouteMapResponse(value: unknown): RouteMapReadModel
```

Validate every external array, object, number, and string before returning domain types. Do not
reuse permissive casts from presentation code.

- [ ] **Step 7: Run both focused tests and observe GREEN**

Run:

```bash
npm test -- \
  src/features/route-map/domain/build-route-geojson.test.ts \
  src/features/route-map/infrastructure/route-map-response.dto.test.ts
```

Expected: both files pass.

### Task 4: Add repository and use-case boundaries

**Files:**
- Create: `tripways-web/src/features/route-map/application/route-map-repository.ts`
- Create: `tripways-web/src/features/route-map/application/get-route-map.ts`
- Create: `tripways-web/src/features/route-map/application/get-route-map.test.ts`
- Create: `tripways-web/src/features/route-map/infrastructure/edge-route-map-repository.ts`
- Create: `tripways-web/src/features/route-map/infrastructure/edge-route-map-repository.test.ts`
- Create: `tripways-web/src/features/route-map/server.ts`

- [ ] **Step 1: Write the failing use-case test**

Test that:

- a city origin is passed to the repository with bounded filters
- available data is returned unchanged
- repository failures normalize to an unavailable read-model result
- an airport origin returns an explicit unsupported-origin result without calling the Edge Function

- [ ] **Step 2: Run the use-case test and observe RED**

Run:

```bash
npm test -- src/features/route-map/application/get-route-map.test.ts
```

Expected: repository/use-case modules not found.

- [ ] **Step 3: Implement the application boundary**

Define:

```ts
export interface RouteMapRepository {
  getCityRouteMap(query: CityRouteMapQuery): Promise<RouteMapReadModel>;
}
```

Expose:

```ts
getRouteMap(query: RouteMapQuery): Promise<RouteMapLoadResult>
```

The use case owns origin dispatch and error normalization. The repository owns transport only.

- [ ] **Step 4: Write the failing Edge repository test**

Assert one POST to the City Page Edge endpoint with:

```json
{
  "action": "get_route_map",
  "input": {
    "city_slug": "bangkok",
    "locale": "en",
    "origin_airports": ["BKK"],
    "limit": 100
  }
}
```

- [ ] **Step 5: Implement the Edge repository**

Reuse the existing server-only Edge request mechanism and caching rules. Include a distinct
route-map cache contract version so old city-page payloads cannot satisfy the new DTO.

- [ ] **Step 6: Add the server composition root**

Construct the repository and export a server-only `routeMap.getRouteMap` facade. Keep environment
variables and privileged credentials out of domain and presentation files.

- [ ] **Step 7: Run focused application/infrastructure tests**

Expected: all new tests pass.

### Task 5: Build the reusable MapLibre presentation

**Files:**
- Create: `tripways-web/src/features/route-map/presentation/route-map.tsx`
- Move and adapt: `tripways-web/src/features/route-discovery/presentation/route-map-client.tsx`
- Move and adapt: `tripways-web/src/features/route-discovery/presentation/route-map-fallback.tsx`
- Create: `tripways-web/src/features/route-map/presentation/route-map-popup.ts`
- Create: `tripways-web/src/features/route-map/presentation/route-map.test.tsx`
- Create: `tripways-web/src/features/route-map/index.ts`
- Modify: `tripways-web/src/app/globals.css`

- [ ] **Step 1: Write the failing presentation test**

Verify:

- the region label names the origin city
- loading fallback has stable height
- empty state names the active filter result
- the MapLibre client receives one origin and the destination list
- popup markup escapes database strings and contains the internal route link

- [ ] **Step 2: Run the presentation test and observe RED**

Run:

```bash
npm test -- src/features/route-map/presentation/route-map.test.tsx
```

Expected: new presentation module not found.

- [ ] **Step 3: Adapt the MapLibre client**

Reuse the existing map style, navigation controls, click behavior, and cleanup. Render:

```ts
"circle-radius": ["case", ["==", ["get", "role"], "origin"], 9, 5]
"circle-color": ["case", ["==", ["get", "role"], "origin"], "#101828", "#147df5"]
```

Keep route lines blue, curved, and visually subordinate to the distinct origin point.

- [ ] **Step 4: Extract safe popup rendering**

Create a pure function that escapes every interpolated field and returns the popup HTML. Include
city, country, airports, airlines, duration, and `routePath`.

- [ ] **Step 5: Preserve stable loading, error, and empty layouts**

Use one shared shell height. Loading and WebGL/tile errors must not collapse the page. Empty results
render the origin identity and an explicit message without attempting invalid `fitBounds`.

- [ ] **Step 6: Export the focused feature API**

Only export the domain query types, server facade, and presentation component needed by page
composition.

- [ ] **Step 7: Run the presentation test and observe GREEN**

Expected: all route-map presentation tests pass.

### Task 6: Compose the read model into the city page

**Files:**
- Modify: `tripways-web/src/app/flights-from/[citySlug]/page.tsx`
- Modify: `tripways-web/src/features/city-page/presentation/city-discovery-tools.tsx`
- Modify: `tripways-web/src/features/city-page/index.ts`
- Modify: `tripways-web/src/app/globals.css`
- Modify: relevant city-page composition tests

- [ ] **Step 1: Write the failing city-page composition test**

Assert the page constructs:

```ts
{
  origin: { type: "city", slug: citySlug },
  locale: "en",
  originAirports,
  airlines,
  destinationCountries,
  maxDurationMinutes,
  departureWindow,
  limit: 100,
}
```

from the route filter query parameters and loads it inside the map Suspense boundary.

- [ ] **Step 2: Run the composition test and observe RED**

Expected: the page still renders the static `CityRouteMap`.

- [ ] **Step 3: Add an independent server MapSection**

Call `routeMap.getRouteMap` without loading airport cards or paginated destinations. Render the
route-map unavailable state only when this read model fails.

- [ ] **Step 4: Remove the static city map**

Delete the CSS-only `CityRouteMap` component, fixed region labels, and unused `.draft-map`,
`.map-grid`, `.map-origin`, and `.map-destination*` styles.

- [ ] **Step 5: Run city-page and route-map tests**

Expected: the city page uses the independent feature and all focused tests pass.

### Task 7: Regenerate, reset, and verify end to end

**Files:**
- Generated: `tripways-backend/supabase/migrations/*.sql`

- [ ] **Step 1: Format backend files**

Run:

```bash
cd tripways-backend
deno fmt supabase/functions
```

- [ ] **Step 2: Regenerate migrations**

Run:

```bash
bash scripts/regenerate-supabase-migrations.sh
```

Expected: deterministic clean migrations generated only from `supabase/sql_src`.

- [ ] **Step 3: Reset the local database from zero**

Run:

```bash
supabase db reset --local --yes
```

Expected: migrations and seed complete without errors.

- [ ] **Step 4: Run all backend verification**

Run all SQL snippets, Deno tests/checks, database lint, and:

```bash
git diff --check
```

Expected: zero failures and no schema warnings.

- [ ] **Step 5: Run all web verification**

Run:

```bash
cd ../tripways-web
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
```

Expected: every command exits zero.

- [ ] **Step 6: Verify the local browser result**

Open:

```text
http://localhost:3000/flights-from/bangkok
```

Confirm:

- a real tile map renders
- Bangkok has one large, distinct origin point
- every returned destination city appears once
- route curves originate at Bangkok
- popup route links are correct
- airport filters change routes without moving the Bangkok origin
- a map failure cannot block the remaining city-page sections

- [ ] **Step 7: Report without committing or pushing**

Report exact test counts and any production data limitation using:

```text
implemented: ...; skipped: ...; add when: ...
```
