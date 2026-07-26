# Figma Editorial Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Figma frame `28:2` as a responsive, accessible Tripways homepage at `/` while preserving the existing city pSEO pages.

**Architecture:** Keep `src/app/page.tsx` as a route-level composition Server Component. Put typed editorial content and focused homepage sections under `src/features/home-page`, move genuinely shared site chrome and editorial primitives to `src/shared/ui`, and reuse the existing `route-map` feature behind its own Suspense boundary.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, strict TypeScript, CSS design tokens, MapLibre GL, Vitest.

---

## File Structure

### Create

- `src/features/home-page/domain/home-page-model.ts`: display-ready homepage contracts
- `src/features/home-page/application/get-home-page-read-model.ts`: typed editorial read-model assembly
- `src/features/home-page/application/get-home-page-read-model.test.ts`: read-model contract tests
- `src/features/home-page/presentation/home-hero.tsx`: hero section
- `src/features/home-page/presentation/home-directories.tsx`: directory navigation
- `src/features/home-page/presentation/home-corridors.tsx`: significant corridors and image story
- `src/features/home-page/presentation/home-value-propositions.tsx`: three product principles
- `src/features/home-page/presentation/home-route-map-section.tsx`: isolated map read and fallback
- `src/features/home-page/presentation/home-route-map-section.test.tsx`: map boundary tests
- `src/features/home-page/index.ts`: public feature exports
- `src/shared/ui/brand-mark.tsx`: shared brand element
- `src/shared/ui/editorial-button.tsx`: shared CTA link
- `src/shared/ui/editorial-section-heading.tsx`: shared section heading pattern
- `src/shared/ui/site-header.tsx`: responsive shared site header
- `src/shared/ui/site-footer.tsx`: responsive shared site footer
- `src/shared/ui/site-chrome.test.tsx`: shared semantic tests
- `src/shared/ui/index.ts`: shared UI exports
- `public/figma/home/corridor-flight.*`: exact Figma editorial image asset

### Modify

- `src/app/page.tsx`: compose the Figma homepage
- `src/app/page.test.tsx`: assert homepage content and boundaries
- `src/app/globals.css`: add responsive homepage and shared-site styling
- `src/app/flights-from/[citySlug]/page.tsx`: import shared header and footer
- `src/features/city-page/index.ts`: remove site-chrome exports

### Delete

- `src/features/city-page/presentation/site-header.tsx`
- `src/features/city-page/presentation/site-footer.tsx`

## Task 1: Typed Homepage Read Model

**Files:**

- Create: `src/features/home-page/domain/home-page-model.ts`
- Create: `src/features/home-page/application/get-home-page-read-model.ts`
- Test: `src/features/home-page/application/get-home-page-read-model.test.ts`

- [ ] **Step 1: Write the failing read-model test**

Assert that `getHomePageReadModel()` returns the Figma issue label, hero CTA, five directory entries,
four significant corridors, and three value propositions with stable unique keys.

- [ ] **Step 2: Run the focused test and observe RED**

Run:

```bash
npm test -- src/features/home-page/application/get-home-page-read-model.test.ts
```

Expected: FAIL because the feature files do not exist.

- [ ] **Step 3: Implement explicit read-model contracts**

Define readonly types for hero, directory, corridor, value proposition, and the aggregate
`HomePageReadModel`. Return the approved Figma content from a small synchronous function.

- [ ] **Step 4: Run the focused test and observe GREEN**

Run:

```bash
npm test -- src/features/home-page/application/get-home-page-read-model.test.ts
```

Expected: PASS.

## Task 2: Shared Site UI

**Files:**

- Create: `src/shared/ui/brand-mark.tsx`
- Create: `src/shared/ui/editorial-button.tsx`
- Create: `src/shared/ui/editorial-section-heading.tsx`
- Create: `src/shared/ui/site-header.tsx`
- Create: `src/shared/ui/site-footer.tsx`
- Create: `src/shared/ui/site-chrome.test.tsx`
- Create: `src/shared/ui/index.ts`
- Modify: `src/app/flights-from/[citySlug]/page.tsx`
- Modify: `src/features/city-page/index.ts`
- Delete: `src/features/city-page/presentation/site-header.tsx`
- Delete: `src/features/city-page/presentation/site-footer.tsx`

- [ ] **Step 1: Write failing shared semantic tests**

Assert that the header exposes a labelled primary navigation, brand home link, route-search link,
and city-page link. Assert that the footer contains landmark navigation and newsletter labelling.

- [ ] **Step 2: Run the focused test and observe RED**

Run:

```bash
npm test -- src/shared/ui/site-chrome.test.tsx
```

Expected: FAIL because shared site UI does not exist.

- [ ] **Step 3: Implement the smallest shared components**

Create focused components with explicit props. Keep homepage-only content out of shared UI. Replace
city-page imports with the shared components and remove the old city-owned files.

- [ ] **Step 4: Run focused and city component tests**

Run:

```bash
npm test -- src/shared/ui/site-chrome.test.tsx src/features/city-page
```

Expected: PASS.

## Task 3: Homepage Presentation Sections

**Files:**

- Create: `src/features/home-page/presentation/home-hero.tsx`
- Create: `src/features/home-page/presentation/home-directories.tsx`
- Create: `src/features/home-page/presentation/home-corridors.tsx`
- Create: `src/features/home-page/presentation/home-value-propositions.tsx`
- Create: `src/features/home-page/index.ts`
- Modify: `src/app/page.test.tsx`

- [ ] **Step 1: Replace the route test with failing Figma-content assertions**

Assert the page contains the exact primary heading, Search Routes CTA, Directories, Significant
Corridors, and the three value-proposition headings.

- [ ] **Step 2: Run the route test and observe RED**

Run:

```bash
npm test -- src/app/page.test.tsx
```

Expected: FAIL because the current reset page still renders the draft link.

- [ ] **Step 3: Implement focused presentation sections**

Each section accepts only the portion of `HomePageReadModel` it renders. Use semantic headings, lists,
links, and explicit accessible labels. Do not add data access to presentation files.

- [ ] **Step 4: Export the feature API and rerun the focused test**

Run:

```bash
npm test -- src/app/page.test.tsx
```

Expected: remain RED until route composition is completed in Task 5, while TypeScript resolves the
new feature exports.

## Task 4: Isolated Homepage Route Map

**Files:**

- Create: `src/features/home-page/presentation/home-route-map-section.tsx`
- Create: `src/features/home-page/presentation/home-route-map-section.test.tsx`

- [ ] **Step 1: Write failing map state tests**

Test a pure `HomeRouteMapContent` presenter: available data renders `RouteMap`; unavailable data
renders a map-specific message without throwing.

- [ ] **Step 2: Run the focused test and observe RED**

Run:

```bash
npm test -- src/features/home-page/presentation/home-route-map-section.test.tsx
```

Expected: FAIL because the presenter does not exist.

- [ ] **Step 3: Implement the presenter and Server Component loader**

The loader calls `routeMap.getRouteMap()` with Bangkok, `en-GB`, and a limit of 100. Keep this server
integration inside the section and expose a focused `HomeRouteMapFallback` for Suspense.

- [ ] **Step 4: Run the map tests and observe GREEN**

Run:

```bash
npm test -- src/features/home-page/presentation/home-route-map-section.test.tsx
```

Expected: PASS.

## Task 5: Figma Assets, Route Composition, and Styling

**Files:**

- Create: `public/figma/home/corridor-flight.*`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Download the exact Figma corridor image**

Store the exported binary under `public/figma/home` and verify its content type. Do not retain the
expiring Figma URL in source code.

- [ ] **Step 2: Compose the homepage**

Load `getHomePageReadModel()`, render the shared header/footer and focused sections, and place
`HomeRouteMapSection` inside a section-specific Suspense boundary.

- [ ] **Step 3: Implement responsive CSS from tokens**

Add `.home-*`, `.editorial-*`, and shared site-chrome classes. Reproduce the Figma hierarchy at desktop,
collapse grids at tablet, and prevent horizontal overflow at 320 px. Do not alter route-map internals.

- [ ] **Step 4: Run the homepage test and observe GREEN**

Run:

```bash
npm test -- src/app/page.test.tsx
```

Expected: PASS.

## Task 6: Verification

- [ ] **Step 1: Run all automated checks**

```bash
npm test
npm run lint
npm run typecheck
git diff --check
npm run build
```

Expected: all commands exit zero.

- [ ] **Step 2: Verify browser rendering**

Check `/` at 1440 px, 768 px, 390 px, and 320 px. Check `/flights-from/bangkok` and
`/flights-from/singapore` after the shared header/footer migration.

Expected: no horizontal overflow, no missing image, map failure remains isolated, headings follow the
correct hierarchy, and navigation remains keyboard accessible.

- [ ] **Step 3: Review scope**

Confirm that no CMS, authentication flow, fake live flight count, generic page builder, or city-page
redesign was added.
