# MapLibre Route Map Design

## Goal

Replace the illustrative SVG Route Map with an interactive geographic map using MapLibre GL JS and
OpenFreeMap while preserving the Route Discovery clean architecture boundaries.

## Architecture

- Domain airports store real latitude/longitude rather than presentation coordinates.
- A pure domain helper builds airport points, curved route GeoJSON, and geographic bounds.
- Infrastructure owns the OpenFreeMap style URL.
- A client-only presentation component owns MapLibre lifecycle and interaction.
- The public Route Map wrapper provides loading and safe non-map content.
- App Router pages and application use cases remain unaware of the map library.

## Behavior

- Show the origin, destinations, airport labels, and curved geographic route lines.
- Fit the camera to all displayed airports.
- Provide MapLibre navigation controls while disabling scroll zoom by default.
- Show airport details in popups.
- Keep attribution visible.
- Use a 320-pixel mobile and 440-pixel desktop map.
- Provide an accessible loading state and a route-summary fallback when WebGL or map loading fails.
- Dynamically load MapLibre in the browser so Server Components do not evaluate browser APIs.

## Provider Decision

Use MapLibre GL JS directly with the OpenFreeMap Liberty style:
`https://tiles.openfreemap.org/styles/liberty`.

Do not add a React wrapper package. The style URL remains isolated in infrastructure so a future
tile provider can replace OpenFreeMap without changing domain or page code.

## Testing

- Unit-test coordinate data, curved line generation, point features, and bounds.
- Component-test accessible loading/fallback content without requiring WebGL.
- Run Vitest, ESLint, TypeScript, and the Next.js production build.
- Browser-test route rendering, controls, popup, fit bounds, responsive sizes, console errors, and
  absence of horizontal overflow.

## Non-Goals

- No live aircraft tracking, geolocation, 3D terrain, clustering, route animation, custom tile
  hosting, or offline maps.
