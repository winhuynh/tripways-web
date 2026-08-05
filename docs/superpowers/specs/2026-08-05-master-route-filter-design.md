# Master Route Filter Design

**Date:** 2026-08-05
**Status:** Approved

## Goal

Build one server-renderable `MasterRouteFilter` for City Hub, Route Page, and Airport Guide. Each page supplies a field allowlist, current URL values, backend facets, and page-specific fixed options. Homepage remains an origin discovery form and does not use this filter.

## Boundaries

- The component renders only allowlisted fields and submits with a native GET form.
- A shared query parser validates URL parameters and emits only filters accepted for that page scope.
- City enables departure airport, geography, airline, route type, and duration.
- Route enables stops, airline, connection airport, departure time, duration, and layover.
- Airport enables direction, counterpart query, geography, route type, and airline; it never exposes connections, duration, layover, price, or stops.
- Price and currency are deferred until published route data exposes a usable price capability.
- Cabin is deferred because the SQL contract validates it but does not currently apply it.
- Results remain page-owned; this feature does not redesign result cards.

## Data flow

URL search params are normalized into a `RouteFilterValues` object. The page passes those values to `MasterRouteFilter` and serializes the same normalized values to `rpc_search_routes`. Faceted fields use `RouteSearchModel.facets`; City departure airports use the city page model; time and route-type fields use canonical fixed choices.

Changing a filter performs a GET navigation without a cursor. `Clear filters` links to the base pathname. A `Load more` link includes the current normalized query plus the backend cursor when one exists.

## Verification

Use TDD for parser/serialization and component configuration. Run focused tests, full frontend verification, backend route-search contracts, and desktop/mobile browser QA against local canonical RPC data.
