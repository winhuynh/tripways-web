# Tripways Web UI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the current Tripways homepage into a small reusable, accessible, mobile-first UI foundation with shared site configuration, global layout, and focused homepage sections.

**Architecture:** Keep Next.js App Router pages as composition and server-data boundaries. Store shared labels and links in typed configuration, keep global chrome under `components/layout`, homepage-only sections under `components/home`, and introduce only the two UI primitives proven useful by the existing interface.

**Tech Stack:** Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, Vitest, React DOM server rendering.

---

## File Map

- Create `src/config/navigation.ts`: typed main navigation and footer link groups.
- Create `src/config/site.ts`: typed static site metadata and scope copy.
- Create `src/components/ui/button-link.tsx`: reusable link with primary and secondary presentation.
- Create `src/components/ui/page-container.tsx`: shared constrained-width wrapper.
- Create `src/components/layout/desktop-navigation.tsx`: inline desktop navigation.
- Create `src/components/layout/mobile-navigation.tsx`: native accessible mobile disclosure.
- Modify `src/components/layout/site-header.tsx`: compose brand, desktop/mobile navigation, and CTA.
- Modify `src/components/layout/site-footer.tsx`: render configured groups responsively.
- Create `src/components/home/hero-section.tsx`: homepage hero and featured connection.
- Create `src/components/home/route-search-section.tsx`: route search and fixture shortcuts.
- Create `src/components/home/how-it-works-section.tsx`: three-step explanation.
- Modify `src/app/page.tsx`: compose homepage sections only.
- Modify `src/app/layout.tsx`: use Vietnamese document language and retain shared global chrome.
- Modify `src/app/globals.css`: add reusable design tokens and responsive container behavior.
- Create `src/config/navigation.test.ts`: configuration integrity tests.
- Create `src/components/layout/site-header.test.tsx`: server-rendered navigation/accessibility tests.
- Create `src/components/home/home-sections.test.tsx`: server-rendered homepage content tests.

### Task 1: Typed shared site configuration

**Files:**
- Create: `src/config/navigation.test.ts`
- Create: `src/config/navigation.ts`
- Create: `src/config/site.ts`

- [ ] **Step 1: Write the failing configuration test**

```ts
import { describe, expect, it } from "vitest";
import { footerNavigation, mainNavigation } from "./navigation";

describe("site navigation", () => {
  it("uses unique non-empty internal destinations", () => {
    const hrefs = mainNavigation.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(mainNavigation.every((item) => item.label && item.href.startsWith("/"))).toBe(true);
  });

  it("provides named footer groups with links", () => {
    expect(footerNavigation.length).toBeGreaterThan(1);
    expect(footerNavigation.every((group) => group.title && group.links.length > 0)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `pnpm test src/config/navigation.test.ts`

Expected: FAIL because `src/config/navigation.ts` does not exist.

- [ ] **Step 3: Implement typed navigation and site configuration**

Create readonly `NavigationItem` and `NavigationGroup` types. Export one internal-link list for
desktop/mobile navigation, grouped footer links, and `siteConfig` containing name, description,
copyright, and prototype-scope copy. Use only destinations supported by the current prototype:
`/`, `/flights-from/SGN`, and `/#how-it-works`.

- [ ] **Step 4: Run the test and confirm GREEN**

Run: `pnpm test src/config/navigation.test.ts`

Expected: 2 tests pass.

### Task 2: Minimal reusable UI primitives

**Files:**
- Create: `src/components/ui/button-link.tsx`
- Create: `src/components/ui/page-container.tsx`
- Create: `src/components/ui/ui-primitives.test.tsx`

- [ ] **Step 1: Write failing server-render tests**

Use `renderToStaticMarkup` to verify `ButtonLink` renders an anchor with its destination and label,
and `PageContainer` renders its children with the `page-container` class.

- [ ] **Step 2: Run the tests and confirm RED**

Run: `pnpm test src/components/ui/ui-primitives.test.tsx`

Expected: FAIL because the UI primitive modules do not exist.

- [ ] **Step 3: Implement the minimal primitives**

`ButtonLink` accepts `href`, `children`, and `variant: "primary" | "secondary"` with accessible
focus and minimum touch-target styling. `PageContainer` accepts standard `div` props, combines an
optional `className`, and owns no business logic.

- [ ] **Step 4: Run the tests and confirm GREEN**

Run: `pnpm test src/components/ui/ui-primitives.test.tsx`

Expected: all primitive tests pass.

### Task 3: Responsive shared header navigation

**Files:**
- Create: `src/components/layout/site-header.test.tsx`
- Create: `src/components/layout/desktop-navigation.tsx`
- Create: `src/components/layout/mobile-navigation.tsx`
- Modify: `src/components/layout/site-header.tsx`

- [ ] **Step 1: Write the failing header test**

Render `SiteHeader` to static markup and assert:

- it contains a `Main navigation` landmark;
- all configured main navigation labels appear in desktop and mobile presentations;
- it contains a native `<details>` disclosure and a `Menu` summary;
- the primary CTA links to `/flights-from/SGN`.

- [ ] **Step 2: Run the test and confirm RED**

Run: `pnpm test src/components/layout/site-header.test.tsx`

Expected: FAIL because the current header has no mobile disclosure or configuration-backed menu.

- [ ] **Step 3: Implement desktop and mobile navigation**

Desktop navigation receives readonly `NavigationItem[]` and is hidden below `md`. Mobile navigation
receives the same items, uses `<details>`/`<summary>`, is hidden at `md` and above, and contains
44-pixel link targets. Both use Next.js `Link`.

- [ ] **Step 4: Refactor `SiteHeader` as composition**

Compose `Brand`, `DesktopNavigation`, `MobileNavigation`, `PageContainer`, and `ButtonLink`. Keep the
sticky translucent header, show the full CTA on desktop, and keep a compact mobile-friendly action
without horizontal overflow.

- [ ] **Step 5: Run the test and confirm GREEN**

Run: `pnpm test src/components/layout/site-header.test.tsx`

Expected: header test passes.

### Task 4: Responsive configured footer

**Files:**
- Create: `src/components/layout/site-footer.test.tsx`
- Modify: `src/components/layout/site-footer.tsx`

- [ ] **Step 1: Write the failing footer test**

Render `SiteFooter`, assert every configured group title and link label is present, and assert the
footer includes the configured description and copyright text.

- [ ] **Step 2: Run the test and confirm RED**

Run: `pnpm test src/components/layout/site-footer.test.tsx`

Expected: FAIL because the current footer is not driven by the new configuration.

- [ ] **Step 3: Implement the configured responsive footer**

Render the brand/description and configured groups in a one-column mobile grid that expands to
multiple columns at `md`. Use `PageContainer`, preserve readable link focus states, and avoid
client-side state.

- [ ] **Step 4: Run the test and confirm GREEN**

Run: `pnpm test src/components/layout/site-footer.test.tsx`

Expected: footer test passes.

### Task 5: Focused homepage sections

**Files:**
- Create: `src/components/home/home-sections.test.tsx`
- Create: `src/components/home/hero-section.tsx`
- Create: `src/components/home/route-search-section.tsx`
- Create: `src/components/home/how-it-works-section.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write failing section-render tests**

Render the three sections and assert the existing hero heading, route finder heading,
`AirportSearchForm`, fixture airport links, and all three how-it-works titles are present.

- [ ] **Step 2: Run the tests and confirm RED**

Run: `pnpm test src/components/home/home-sections.test.tsx`

Expected: FAIL because the homepage section modules do not exist.

- [ ] **Step 3: Extract the hero section**

Move the existing hero content and featured SGN–LHR card into `HeroSection`. Use `PageContainer` and
`ButtonLink`; preserve the one-column mobile and two-column desktop behavior.

- [ ] **Step 4: Extract the route search section**

Move `AirportSearchForm` and fixture airport shortcuts into `RouteSearchSection`. Preserve
`id="route-search"` and all existing route destinations.

- [ ] **Step 5: Extract the how-it-works section**

Move the three existing explanation cards into `HowItWorksSection`, preserve
`id="how-it-works"`, and use a one-column to three-column responsive grid.

- [ ] **Step 6: Replace homepage implementation with composition**

`src/app/page.tsx` imports and renders only `HeroSection`, `RouteSearchSection`, and
`HowItWorksSection`.

- [ ] **Step 7: Run the section tests and confirm GREEN**

Run: `pnpm test src/components/home/home-sections.test.tsx`

Expected: all homepage section tests pass.

### Task 6: Global document and responsive polish

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update the document shell**

Set `<html lang="vi">`, retain one shared `SiteHeader` and `SiteFooter`, and preserve metadata.

- [ ] **Step 2: Consolidate reusable global tokens**

Keep the approved palette, update `.page-container` for 20-pixel mobile and 32-pixel larger-screen
gutters, preserve visible focus styles, and add reduced-motion handling for smooth scrolling.

- [ ] **Step 3: Run static verification**

Run: `pnpm lint && pnpm typecheck`

Expected: both commands exit 0 with no errors.

### Task 7: Full verification and responsive inspection

**Files:**
- Modify only if verification exposes a scoped defect.

- [ ] **Step 1: Run all automated checks**

Run: `pnpm test && pnpm lint && pnpm typecheck && pnpm build`

Expected: all tests pass and the production build completes successfully.

- [ ] **Step 2: Start the development server**

Run: `pnpm dev`

Expected: Next.js reports a local URL and serves the homepage.

- [ ] **Step 3: Inspect representative viewports**

Check `/` at 375×812, 768×1024, and 1440×900. Confirm no horizontal overflow, mobile disclosure is
operable, desktop navigation appears at `md`, hero and footer reflow correctly, and all focusable
controls have visible keyboard focus.

- [ ] **Step 4: Report without committing**

Report `implemented`, `skipped`, and `add when` items with exact verification commands. Do not
commit, push, or deploy because `docs/codex_work_rules.md` prohibits automatic repository actions.
