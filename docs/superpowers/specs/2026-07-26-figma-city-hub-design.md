# Figma Editorial City Hub Design

## Goal

Rebuild every `/flights-from/[citySlug]` page from the approved `Main.png` export while
preserving the existing server-rendered pSEO data contracts and independent read-model loading.

## Source of Truth

- Primary visual reference: Figma frame `City Hub - Bangkok (Premium) - Ad Below FAQ`
  (`1280 × 7696.81`, node `28:272`).
- Export reference: `/Users/winn/Downloads/Main.png` (1280 × 7059). Transparent export regions
  must not be interpreted as a black page background.
- Representative content: Bangkok.
- Dynamic proof pages: Bangkok and Singapore.
- Existing Edge Function and PostgreSQL RPC contracts remain the data source of truth.

## Visual Direction

- The City Hub frame uses the shared warm page canvas `#FDF9F2`, matching the homepage surface
  family. White and warm off-white cards create subtle hierarchy without changing page theme.
- Primary blue is reserved for route data, actions, highlighted words, and map routes.
- Playfair Display owns editorial headlines; Merriweather owns narrative copy; Inter owns
  labels, controls, data captions, and navigation.
- Headings combine upright blue text with a lower-contrast italic phrase, for example
  `Destinations from Bangkok`.
- Destination cards use a strict editorial grid, large airport-code watermark, route facts,
  and a single quiet call to action.
- The airport section is the intentional dark-charcoal exception, with two airport cards, an
  image panel, and one highlighted network statistic.
- The alternate-origin section uses a warm off-white background and compact city tiles.

## Page Composition

1. Shared editorial header.
2. City hero with breadcrumb, pSEO H1, descriptive copy, data freshness badge, and six facts.
3. Route search with contextual quick links.
4. Interactive route map from the reusable route-map feature.
5. Filter toolbar.
6. Destination grid with independent quick-facts, newsletter, and advertisement sidebar.
7. City travel insights.
8. Airport operations feature.
9. Alternate-origin links.
10. FAQ accordion.
11. Post-FAQ advert.
12. Internal-link directories and shared editorial footer.

Airline and collection read models remain available to the page architecture, but they are not
rendered as separate visual sections because they are absent from the approved export. Airline
data remains visible in destination cards and airport facts.

## Architecture

- `src/app/flights-from/[citySlug]/page.tsx` remains the route composition root.
- Each independently loaded backend read model remains behind its own local `Suspense` boundary.
- Presentational sections remain small files under
  `src/features/city-page/presentation/`.
- The feature owns `city-page.css`; global CSS retains only cross-feature reset and imports.
- Static image selection is presentation-only and deterministic by destination slug. It is not
  route eligibility or ranking data.
- The shared `SiteHeader` and `SiteFooter` are reused. City-page modifiers change their surface
  without duplicating component implementations.

## Responsive Behaviour

- Desktop uses a maximum 1152 px content column.
- Below 980 px, destination content and sidebar stack, while the airport feature becomes one
  column.
- Below 760 px, all data grids become one or two columns, the hero H1 remains readable, filters
  wrap, and the map height reduces without horizontal overflow.
- Controls keep at least a 44 px interaction target and visible keyboard focus.

## SEO and Performance

- H1, intro, destinations, airport links, internal links, FAQs, and JSON-LD remain server-rendered.
- MapLibre stays the only client-heavy section and remains isolated in the route-map feature.
- No new client state, global store, or third-party UI dependency is introduced.
- Existing metadata, canonical, robots, and Edge/RPC validation remain unchanged.

## Verification

- Component tests cover dynamic city labels and editorial section semantics.
- Existing read-model, DTO, map, advertising, and homepage tests remain green.
- Verify Bangkok and Singapore at desktop and mobile widths.
- Run tests, lint, typecheck, production build, and `git diff --check`.
