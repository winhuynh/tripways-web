# Figma Editorial City Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved editorial City Hub design for every dynamic city page without
changing the existing Edge/RPC boundaries.

**Architecture:** Keep the App Router page as a thin server composition root. Preserve one
independent read model per backend section, move city-specific visual rules into a feature-owned
stylesheet, and keep reusable chrome under `src/shared/ui`.

**Tech Stack:** Next.js App Router, React Server Components, strict TypeScript, CSS, Vitest,
MapLibre GL.

---

## File Map

- Create `src/features/city-page/presentation/city-page.css`: City Hub layout, component states,
  and responsive rules.
- Create `src/features/city-page/presentation/city-newsletter-card.tsx`: destination-sidebar
  newsletter presentation.
- Create `src/features/city-page/presentation/city-alternate-origins-section.tsx`: reviewed
  internal links rendered as alternative departure cities.
- Modify `src/features/city-page/presentation/city-hero.tsx`: editorial H1, freshness badge, and
  compact facts.
- Modify `src/features/city-page/presentation/city-discovery-tools.tsx`: editorial search and
  filter controls.
- Modify `src/features/city-page/presentation/city-destinations-section.tsx`: dynamic cards and
  independent sidebar.
- Modify `src/features/city-page/presentation/city-insights-section.tsx`: dynamic city title and
  editorial fact strip.
- Modify `src/features/city-page/presentation/city-airports-section.tsx`: airport operations
  story layout.
- Modify `src/features/city-page/presentation/city-faq-section.tsx`: compact accordion layout.
- Modify `src/features/city-page/presentation/city-links-section.tsx`: directory and
  alternate-origin projections.
- Modify `src/features/city-page/index.ts`: expose new presentation units.
- Modify `src/app/flights-from/[citySlug]/page.tsx`: compose the approved visual order.
- Modify `src/app/globals.css`: import feature CSS and remove superseded City Hub rules.
- Modify focused presentation tests: lock dynamic city content and required semantics.

### Task 1: Lock Dynamic Editorial Semantics

- [ ] Add failing tests proving hero, insights, airports, and destinations render the provided
  city name instead of hard-coded Bangkok copy.
- [ ] Run:

```bash
pnpm test -- src/features/city-page/presentation
```

Expected: at least one assertion fails on the old Bangkok-only headings.

- [ ] Add the smallest explicit props required by the affected presentation components.
- [ ] Re-run the focused tests and expect all presentation tests to pass.

### Task 2: Build the Editorial Section Components

- [ ] Add `CityNewsletterCard` with an accessible email field and submit control.
- [ ] Add `CityAlternateOriginsSection` that projects reviewed internal links into compact
  alternative-city tiles.
- [ ] Refactor destination, insight, airport, FAQ, and internal-link markup to match the approved
  section hierarchy while retaining semantic headings, lists, links, and definitions.
- [ ] Keep each file below one clear UI responsibility and avoid client components.
- [ ] Run focused tests and TypeScript:

```bash
pnpm test -- src/features/city-page/presentation
pnpm typecheck
```

Expected: both commands exit 0.

### Task 3: Compose the Dynamic City Route

- [ ] Reorder `src/app/flights-from/[citySlug]/page.tsx` to match the export.
- [ ] Pass `overview.city.name` through every dynamic heading.
- [ ] Reuse the internal-links read model for alternate origins and footer directories without
  adding a new RPC.
- [ ] Remove separate airline and collection visual sections from the page composition while
  keeping their use cases and exports intact.
- [ ] Preserve local `Suspense` boundaries and unavailable states.
- [ ] Run:

```bash
pnpm typecheck
pnpm test
```

Expected: both commands exit 0.

### Task 4: Implement the Feature-Owned Visual System

- [ ] Add `city-page.css` using the shared warm `#FDF9F2` page canvas, white/warm surfaces,
  blue accents, serif headlines, data labels, destination cards, a dark airport story,
  alternate cities, FAQ, advert, and SEO directories.
- [ ] Add desktop, tablet, and mobile rules at 980 px and 760 px.
- [ ] Scope all selectors under `.city-page` or a `city-*` block.
- [ ] Import the stylesheet from `globals.css` and remove obsolete City Hub rules from globals.
- [ ] Run:

```bash
pnpm lint
pnpm typecheck
```

Expected: both commands exit 0.

### Task 5: Verify Production Behaviour

- [ ] Run:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

Expected: every command exits 0.

- [ ] Start the existing local dev server with the local Supabase environment.
- [ ] Verify `/flights-from/bangkok` and `/flights-from/singapore` return HTTP 200.
- [ ] Inspect both routes at desktop and mobile widths for visual hierarchy, map rendering,
  responsive stacking, and horizontal overflow.
- [ ] Do not commit, push, deploy, or change external services.
