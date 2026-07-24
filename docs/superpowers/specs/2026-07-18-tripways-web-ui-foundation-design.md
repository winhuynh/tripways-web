# Tripways Web UI Foundation Design

## Goal

Create a small, reusable UI foundation for the Tripways web prototype without changing the route
discovery domain model or adding speculative product features. The foundation must make the
homepage, global navigation, footer, search, and future route pages easier to extend while keeping
one responsive codebase.

## Scope

The foundation includes:

- shared site configuration for navigation and footer links;
- reusable primitive UI components used by the current homepage;
- global layout components for the header, desktop navigation, mobile navigation, footer, brand,
  and constrained page width;
- homepage sections with one clear responsibility each;
- responsive behavior for mobile, tablet, and desktop;
- preservation of the existing route search and route discovery behavior.

The foundation does not include authentication, booking, live fares, a production map provider,
newsletter persistence, CMS integration, or deployment.

## Architecture

Application routes remain under `src/app`. Route files compose components and load server data, but
do not contain large presentation implementations.

Reusable components are organized by responsibility:

```text
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button-link.tsx
│   │   └── page-container.tsx
│   ├── layout/
│   │   ├── brand.tsx
│   │   ├── desktop-navigation.tsx
│   │   ├── mobile-navigation.tsx
│   │   ├── site-header.tsx
│   │   └── site-footer.tsx
│   ├── home/
│   │   ├── hero-section.tsx
│   │   ├── route-search-section.tsx
│   │   └── how-it-works-section.tsx
│   ├── search/
│   └── routes/
├── config/
│   ├── navigation.ts
│   └── site.ts
└── lib/
```

Only primitives proven useful by the current interface are introduced. Generic component systems,
variant frameworks, and new UI dependencies are intentionally excluded.

## Global Layout

`src/app/layout.tsx` owns the document shell and renders `SiteHeader`, the page `<main>`, and
`SiteFooter`. Header and footer are therefore shared by every route without duplication.

`SiteHeader` owns header structure only. The two navigation presentations share data from
`src/config/navigation.ts`:

- desktop navigation is visible at medium and larger widths;
- mobile navigation is available below that breakpoint through an accessible disclosure control;
- keyboard focus, accessible names, and touch target sizes are preserved;
- the mobile menu closes through native disclosure behavior without introducing global state.

`SiteFooter` renders grouped links from configuration and changes from multiple columns on wide
screens to a readable single-column flow on narrow screens.

## Homepage Composition

`src/app/page.tsx` becomes a short composition layer:

```text
HeroSection
RouteSearchSection
HowItWorksSection
```

Each section owns its own markup and responsive layout. Existing copy, route links, airport fixture
links, and `AirportSearchForm` behavior are preserved during the structural refactor.

The homepage-specific sections stay under `components/home` because they are not global layout or
route discovery primitives. A section may later move into a feature directory only if another page
actually reuses it.

## Responsive Rules

The implementation is mobile-first and uses one DOM and one URL structure.

- Mobile: sections use one column, primary actions remain full-width where useful, navigation uses
  a disclosure menu, and touch targets are at least 44 pixels tall.
- Tablet: content may use two columns when space permits, while navigation remains readable without
  horizontal overflow.
- Desktop: the hero uses a two-column presentation, navigation is inline, and footer groups use
  multiple columns.

Desktop and mobile navigation may use different presentation components, but they consume the same
configuration. Business logic and server data are never duplicated for a separate mobile site.

## Data and Component Boundaries

Static site metadata and navigation labels live in `src/config`. Airport fixtures and route
discovery remain in `src/lib`.

Server Components remain the default. A Client Component is introduced only when browser state is
required. The initial mobile navigation should prefer native `<details>` and `<summary>` semantics
so it can remain server-rendered.

Components accept narrow, explicit props. UI components do not import Supabase code or route
discovery logic.

## Error Handling

This structural foundation does not add new network operations. Existing route-level loading and
error behavior remains unchanged. Navigation links always resolve to existing prototype routes or
explicit placeholder-free homepage anchors.

If JavaScript is unavailable, global navigation and core homepage content must remain usable.

## Verification

The implementation must pass:

- existing Vitest tests;
- ESLint;
- TypeScript type checking;
- the Next.js production build;
- responsive browser checks at representative mobile, tablet, and desktop widths;
- keyboard checks for header navigation, mobile disclosure, calls to action, and search controls.

Visual checks must confirm that there is no horizontal overflow and that header, homepage sections,
and footer remain readable at narrow widths.

## Explicit Decisions

- Use one responsive website, not a separate mobile application or mobile route tree.
- Preserve the existing navy, blue, and off-white direction instead of copying the supplied
  third-party visual reference.
- Refactor current homepage presentation into focused sections before adding new homepage features.
- Keep the initial foundation intentionally small and dependency-free.
- Do not change Supabase RPC behavior, route ranking, or airport fixtures as part of this work.
