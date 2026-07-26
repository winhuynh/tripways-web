# Flat Route Map Style Design

## Goal

Replace the geographic OpenFreeMap Liberty basemap with a light, monochrome world map that keeps
Tripways direct-route lines and origin/destination points visually dominant.

## Decisions

- Keep MapLibre as the renderer and OpenFreeMap as the vector-tile provider.
- Use a small local MapLibre style object instead of a remote general-purpose style.
- Render land in pale blue-grey and water in off-white.
- Render only country and disputed boundaries from the basemap.
- Remove roads, buildings, terrain, POIs, airports, and place labels.
- Keep OpenFreeMap/OpenMapTiles/OpenStreetMap attribution.
- Keep current blue route lines, orange Bangkok origin, blue destination points, controls, popup,
  loading, and error behavior.
- Do not change Supabase, the route-map read model, or route filtering.

## Verification

- A unit contract verifies the style source and minimal layer set.
- Existing route-map tests remain green.
- Browser verification confirms the flat visual treatment, route visibility, and distinct Bangkok
  origin on desktop and mobile-width viewports.
