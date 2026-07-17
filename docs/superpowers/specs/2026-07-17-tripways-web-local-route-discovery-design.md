# Tripways Web Local Route Discovery Design

## Goal

Build a small local web application that lets the user exercise the current Tripways Route
Discovery backend through three responsive pages inspired by the supplied FlightFinder screenshot.
The application is a temporary product shell, but its routing and server boundary must remain
compatible with the future pSEO direction.

## Stack

- Next.js App Router
- TypeScript with strict compiler settings
- Tailwind CSS
- Server-side requests to the local Supabase REST RPC endpoint
- Native SVG and CSS for the temporary route-map visual

No map library, component framework, state library, or browser-side Supabase client is required for
this phase.

## Pages

### Home: `/`

The home page introduces Tripways and provides origin and destination selectors. Submitting the
form navigates to `/routes/[from]/[to]`. A secondary link opens the selected origin's discovery
page at `/flights-from/[iata]`.

The airport options are limited to the deterministic backend fixture: SGN, SIN, BKK, LHR, and CDG.
This registry is temporary because the backend does not yet expose an airport-directory RPC.

### Origin discovery: `/flights-from/[iata]`

This page follows the reference composition:

- compact header and search affordance;
- origin-specific hero copy;
- wide visual route map with simple controls;
- filter toolbar;
- destination-card grid;
- airline summary sidebar;
- lightweight footer.

For each known fixture destination, the server calls `rpc_search_routes` with the selected origin
and destination. Pairs with no results are omitted. Filters operate through URL search parameters
and are forwarded to the RPC; the UI does not duplicate route eligibility or ranking logic.

### Route detail: `/routes/[from]/[to]`

The route page calls `rpc_search_routes` for one airport pair and displays:

- origin and destination identity;
- direct or one-stop badge;
- operating airlines;
- departure and arrival local times;
- total flight, layover, and journey duration;
- connection airport;
- operating weekdays and validity window;
- filter controls shared with the discovery page;
- empty and backend-unavailable states.

There is no live fare, inventory, booking, or affiliate action in this phase.

## Visual Direction

The implementation uses the screenshot as composition guidance rather than copying branding:

- off-white page background;
- dark navy typography;
- bright blue accent and pale blue controls;
- generous whitespace, rounded cards, subtle borders, and restrained shadows;
- strong headline hierarchy;
- responsive grid that becomes a single column on mobile;
- Tripways branding and fixture-specific content, using Ho Chi Minh City/SGN as the useful local
  demo instead of reproducing Bangkok content unsupported by the fixture.

The map is an intentionally non-geographic SVG visualization with route arcs and airport markers.
It provides the visual hierarchy needed for local testing without creating a production map
dependency.

## Data Boundary

The browser never receives the Supabase service-role key. Server components call a small server-only
Route Discovery client, which sends requests to:

```text
POST {SUPABASE_URL}/rest/v1/rpc/rpc_search_routes
```

Required environment variables:

```text
SUPABASE_URL=http://127.0.0.1:55321
SUPABASE_SERVICE_ROLE_KEY=<local service-role key>
```

The server client validates the RPC envelope before exposing it to page components. Raw Supabase
errors and credentials are never rendered. The Edge Function is not required for local web testing
because the current local Supabase Edge Runtime has an external JSR bootstrap issue; the web server
still calls the same database-owned RPC contract.

## Component Boundaries

- `app/`: page composition and route-level loading/error states.
- `components/layout/`: shared header, footer, and page shell.
- `components/search/`: airport search form and filter controls.
- `components/routes/`: map visual, route cards, detail cards, and airline summary.
- `lib/airports.ts`: temporary fixture airport registry.
- `lib/route-discovery.ts`: server-only RPC client and response validation.
- `lib/route-filters.ts`: URL search-parameter parsing into the RPC input contract.

Components remain direct and feature-specific. There is no generic design-system package or
repository abstraction.

## Interaction and Error Handling

- Invalid airport codes render a not-found state.
- Identical origin and destination are rejected by the search form and backend RPC.
- Backend validation errors render a concise user-safe message.
- Backend/network failures render a retryable local-development state with setup guidance.
- Empty results are a normal state and link back to the origin discovery page.
- Filters persist in the URL so pages can be refreshed and shared locally.

## Testing and Verification

- Unit-test airport validation and filter parsing.
- Unit-test the RPC envelope validator with success, stable error, and malformed responses.
- Run framework lint and TypeScript checks.
- Run a production build.
- Start the local application and visually verify desktop and mobile layouts for all three pages.
- With local Supabase running, verify SGN to LHR returns two direct options and one one-stop option.

## Intentional Exclusions

- Authentication and signup behavior
- Live fare search, dated inventory, and booking
- Real map tiles or geospatial interaction
- Airport autocomplete backed by a directory API
- Newsletter submission
- CMS and pSEO publishing workflow
- Analytics and affiliate redirects
- Production deployment and caching policy
