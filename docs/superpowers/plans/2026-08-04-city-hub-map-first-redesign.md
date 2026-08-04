# City Hub Map-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the City Hub presentation as a compact map-first direct-flight discovery page using the existing backend read models.

**Architecture:** Preserve the existing Server Component loaders, repository contracts, metadata, and independent Suspense boundaries. Simplify only the presentation composition, replace image-led destination cards with semantic route rows, add the existing airline read model to the page, and rewrite City Hub CSS around the approved hierarchy.

**Tech Stack:** Next.js 16 Server Components, React 19, strict TypeScript, CSS, Vitest server-rendered component tests

---

### Task 1: Lock the compact hero and single search contract

**Files:**
- Create: `src/features/city-page/presentation/city-hero.test.tsx`
- Create: `src/features/city-page/presentation/city-route-search.test.tsx`
- Modify: `src/features/city-page/presentation/city-hero.tsx`
- Modify: `src/features/city-page/presentation/city-discovery-tools.tsx`

- [ ] **Step 1: Write failing hero and search tests**

Assert that `CityHero` renders `Direct flights from Bangkok`, the four primary facts, and excludes `Shortest route` and `Longest route`. Assert that `CityRouteSearch` renders one labelled search input with placeholder `Search a city, country or airport`, CTA `Explore destinations`, and no `Quick search` block.

- [ ] **Step 2: Run focused tests and observe failure**

Run: `pnpm test src/features/city-page/presentation/city-hero.test.tsx src/features/city-page/presentation/city-route-search.test.tsx`

Expected: FAIL because the current hero uses decorative split heading markup and six facts, while the current search uses the old placeholder, CTA, and quick links.

- [ ] **Step 3: Implement the compact hero and search**

Render one natural H1, supporting copy, four facts, and the existing reviewed-data badge. Keep the form URL-driven with `action="#destinations"` and `name="q"`, but remove quick links and duplicated airport/duration shortcuts.

- [ ] **Step 4: Run focused tests**

Run: `pnpm test src/features/city-page/presentation/city-hero.test.tsx src/features/city-page/presentation/city-route-search.test.tsx`

Expected: PASS.

### Task 2: Replace the destination grid and remove the sidebar

**Files:**
- Modify: `src/features/city-page/presentation/city-destinations-section.test.tsx`
- Modify: `src/features/city-page/presentation/city-destinations-section.tsx`
- Modify: `src/features/city-page/presentation/city-page-sections.tsx`

- [ ] **Step 1: Rewrite the destination test to describe route rows**

Assert the section renders `Nonstop destinations from Singapore`, route identity, airport codes, airlines, duration, frequency, and descriptive link `Explore Singapore to Bangkok`. Assert that markup excludes placeholder media, newsletter email fields, `Subscribe`, `Quick facts slot`, and rectangle advertising.

- [ ] **Step 2: Run the destination test and observe failure**

Run: `pnpm test src/features/city-page/presentation/city-destinations-section.test.tsx`

Expected: FAIL because the current component renders image cards, newsletter, quick facts, and `View route`.

- [ ] **Step 3: Implement semantic destination rows**

Remove `ReactNode`, `AdSlot`, and `CityNewsletterCard` dependencies. Render one list of responsive route articles with a single descriptive link per result. Remove `quickFactsSlot` from the component contract and from `CityDestinationsLoader`; remove the now-unused nested Quick Facts loader imports and implementation from `city-page-sections.tsx`.

- [ ] **Step 4: Add the actionable empty-state assertion**

Update the relevant loader or page composition test to expect `No destinations match these filters. Try another airport or flight duration.` rather than only `No matching destinations`.

- [ ] **Step 5: Run destination and loader-related tests**

Run: `pnpm test src/features/city-page/presentation/city-destinations-section.test.tsx src/features/city-page/application/get-city-read-models.test.ts`

Expected: PASS.

### Task 3: Restore airline content and correct supporting-section copy/order

**Files:**
- Create: `src/features/city-page/presentation/city-page.test.tsx`
- Modify: `src/features/city-page/presentation/city-page.tsx`
- Modify: `src/features/city-page/presentation/city-page-sections.tsx`
- Modify: `src/features/city-page/presentation/city-airlines-section.tsx`
- Modify: `src/features/city-page/presentation/city-insights-section.tsx`
- Modify: `src/features/city-page/presentation/city-airports-section.tsx`

- [ ] **Step 1: Write focused composition and copy tests**

Assert the component source order remains hero → search → map → filters → destinations, then insights → airports → airlines → FAQ → alternate origins → related links. Assert the headings `Understand Bangkok's flight network`, `Choose the Bangkok airport that fits your trip`, and `Airlines flying nonstop from Bangkok`.

- [ ] **Step 2: Run tests and observe failure**

Run: `pnpm test src/features/city-page/presentation/city-page.test.tsx src/features/city-page/presentation/city-insights-section.test.tsx src/features/city-page/presentation/city-airports-section.test.tsx`

Expected: FAIL because airlines are not loaded, current supporting copy is promotional/editorial, and alternate origins precede FAQ.

- [ ] **Step 3: Add `CityAirlinesLoader` using the existing read model**

Call `cityPage.getAirlines(identity)`, render `CityAirlinesSection` only for an available model, and preserve a local unavailable state. Add the loader after airports and before FAQ. Move alternate origins after FAQ while preserving the shared internal-links promise.

- [ ] **Step 4: Rewrite supporting headings without changing data contracts**

Pass `cityName` into `CityAirlinesSection`. Replace generic promotional headings with the approved descriptive headings. Preserve existing airport facts, airline links, insight values, and airport image.

- [ ] **Step 5: Run focused tests**

Run: `pnpm test src/features/city-page/presentation/city-page.test.tsx src/features/city-page/presentation/city-insights-section.test.tsx src/features/city-page/presentation/city-airports-section.test.tsx`

Expected: PASS.

### Task 4: Rebuild City Hub layout CSS around map-first hierarchy

**Files:**
- Modify: `src/features/city-page/presentation/city-page.css`

- [ ] **Step 1: Remove obsolete selectors**

Remove styles for `.content-with-aside`, `.destination-grid`, `.destination-card__media`, `.page-aside`, `.quick-facts-card`, and `.newsletter-card`. Keep shared ad styles needed by the post-FAQ leaderboard.

- [ ] **Step 2: Implement compact hero and map-first spacing**

Reduce the desktop hero minimum height and top padding, render the quick facts as four columns, place search directly above the default route map, keep the map at approximately 560px desktop and 400px mobile, and eliminate negative margins that hide the intended hierarchy.

- [ ] **Step 3: Implement responsive route rows**

Create `.destination-list`, `.destination-row`, identity, fact-grid, and link styles. Use structured desktop columns and stacked mobile layout without horizontal scrolling. Preserve the ivory, cobalt, charcoal, serif headline, accessible focus, and minimum touch-target system.

- [ ] **Step 4: Align supporting sections and responsive behavior**

Keep four hero facts as two-by-two on small screens, filters wrapping with visible labels, airport cards responsive, map visible by default, and FAQ/internal-link sections readable.

- [ ] **Step 5: Run all City Hub tests**

Run: `pnpm test src/features/city-page`

Expected: PASS.

### Task 5: Full verification and browser QA

**Files:**
- Modify only if verification exposes a City Hub regression.

- [ ] **Step 1: Run repository verification**

Run: `pnpm test && pnpm lint && pnpm typecheck && pnpm build`

Expected: all commands exit 0.

- [ ] **Step 2: Start the local application**

Run: `pnpm dev`

Expected: Next.js serves the application without compilation errors.

- [ ] **Step 3: Verify Bangkok City Hub on desktop**

Open `/flights-from/bangkok` at a desktop viewport. Confirm map-first order, one search surface, four hero facts, destination rows, supporting sections, visible focus, and no obsolete sidebar/newsletter/media cards.

- [ ] **Step 4: Verify Bangkok City Hub on mobile**

Check a 390px-wide viewport. Confirm the map remains visible, facts form a two-by-two grid, filters and destination rows do not overflow, and route links remain usable.

- [ ] **Step 5: Report scope and evidence**

Report `implemented`, `skipped`, and `add when` items with exact verification commands and any remaining constraints. Do not commit, push, deploy, or modify unrelated user files.
