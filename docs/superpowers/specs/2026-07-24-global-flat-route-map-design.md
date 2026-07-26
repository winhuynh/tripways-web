# Global Flat Route Map Design

## Goal

Present the route map as a quiet global canvas where direct routes are the only
high-contrast information.

## Visual hierarchy

- Ocean uses a muted teal fill.
- Land uses a cool off-white fill.
- Country boundaries are thin and low contrast.
- Country names are small, uppercase, and low opacity.
- Roads, cities, POIs, transit, terrain, and local labels are omitted.
- Route lines and origin/destination points retain the existing blue/orange
  interaction states.

## Viewport

The initial camera shows the complete world instead of fitting only the current
route bounds. Zoom and pan remain available for exploration.

## Architecture

Basemap presentation remains isolated in
`infrastructure/map/flat-route-map-style.ts`. Camera defaults are exported from
that module and consumed by the MapLibre client. No route data or backend
contracts change.

## Verification

Unit tests assert required land, water, boundary, and country-label layers and
the global camera settings. Browser verification confirms the visual hierarchy.
