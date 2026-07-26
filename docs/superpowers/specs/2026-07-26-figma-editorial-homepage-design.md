# Figma Editorial Homepage Design

## Scope

Implement Figma frame `28:2` from file `VMQKw6GyKfYXsAIOLdCeqT` as the Tripways homepage at `/`.
Keep the existing `/flights-from/[citySlug]` pSEO pages and their read models unchanged.

The homepage includes:

1. Shared editorial site header
2. Centered editorial hero
3. Reusable direct-route map
4. Knowledge directory cards
5. Significant corridor list and editorial image card
6. Tripways value propositions
7. Shared editorial site footer

## Visual Direction

Use the repository design tokens as the source of truth:

- Primary blue: `#137FEC`
- Secondary grey: `#5F5E5E`
- Tertiary orange: `#CE6000`
- Neutral background: `#FDF9F2`
- Headline: Playfair Display
- Body: Merriweather
- Label and controls: Inter

Match the Figma composition, hierarchy, spacing, typography, borders, and restrained shadows. Preserve
the existing responsive and accessibility requirements rather than copying fixed desktop coordinates.

## Architecture

### Route composition

`src/app/page.tsx` remains a small Server Component. It composes the homepage sections and owns only
route-level `Suspense` boundaries.

### Homepage feature

Create `src/features/home-page` with these responsibilities:

- `domain/home-page-model.ts`: explicit typed content and read-model contracts
- `application/get-home-page-read-model.ts`: assembles editorial content needed by the route
- `presentation/home-hero.tsx`
- `presentation/home-directories.tsx`
- `presentation/home-corridors.tsx`
- `presentation/home-value-propositions.tsx`

Static editorial copy is represented as typed data outside the presentation files. It does not require
a backend request until a CMS or homepage API exists.

### Shared site UI

Create `src/shared/ui` for elements that are genuinely used by both homepage and city pages:

- `BrandMark`
- `SiteHeader`
- `SiteFooter`
- `EditorialButton`
- `EditorialSectionHeading`

Do not create generic card, stack, grid, or layout abstractions unless at least two real consumers need
the exact same behavior.

### Route map

Reuse the existing `route-map` feature without moving MapLibre code into the homepage feature.
The homepage map loads through its own Server Component and `Suspense` boundary. Failure renders a
map-specific unavailable state while the rest of the homepage remains available.

For the initial homepage, the map uses the existing Bangkok route-map read model because it is the only
reviewed local route data currently available. The section remains reusable with another origin query.

## Data Flow

```text
app/page.tsx
├── getHomePageReadModel()
│   └── typed editorial homepage content
├── static presentation sections
└── Suspense: HomeRouteMapSection
    └── routeMap.getRouteMap(...)
        └── existing Edge Function / RPC boundary
```

The homepage read model contains display-ready editorial data. Route discovery and route eligibility
remain owned by Postgres RPC and the existing route-map repository.

## Asset Handling

Download and store the exact Figma-exported image assets used by the homepage. Do not keep expiring
Figma MCP URLs in production code. Use Next Image for editorial raster images where appropriate.

Reuse an existing icon only when its glyph clearly matches the Figma asset. Otherwise store and render
the exact exported asset with explicit width and height.

## Responsive Behaviour

- Desktop keeps the Figma 1152 px content rhythm inside the repository page shell.
- Tablet collapses corridor and value-proposition layouts without changing reading order.
- Mobile replaces desktop navigation with a compact accessible layout, stacks hero copy, allows the
  directory cards to wrap, and keeps map controls reachable.
- No horizontal overflow at 320 px.

## Error and Loading States

- Editorial content renders synchronously from the typed homepage read model.
- The map owns a focused skeleton and unavailable state.
- Missing non-critical image assets must not remove adjacent text or links.
- The homepage must remain useful when route-map data is unavailable.

## Testing

Use test-first implementation for:

- Homepage route composition and primary content
- Typed homepage read-model assembly
- Shared header/footer semantics
- Map section isolation and fallback

Finish with full tests, lint, typecheck, production build, and browser checks at desktop and mobile
widths for `/`, `/flights-from/bangkok`, and `/flights-from/singapore`.

## Explicit Non-Goals

- No CMS
- No authentication flow behind the sign-up control
- No live global flight statistics
- No new homepage backend RPC
- No generic page-builder system
- No redesign of the existing city page in this change
