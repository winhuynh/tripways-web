# Shared Route Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact shared `From` and `To` route switcher to the main header that routes users only to existing canonical City Hub or Route Page paths.

**Architecture:** A pure route-navigation helper resolves selected fixture hubs into a City Hub path, a published route path, or an origin fallback. A client header control owns autocomplete and navigation, while the server-rendered site header continues to own the shared shell.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, existing Tripways CSS.

---

### Task 1: Route-navigation contract

**Files:**
- Create: `src/features/route-navigation/domain/resolve-route-navigation.ts`
- Create: `src/features/route-navigation/domain/resolve-route-navigation.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
expect(resolveRouteNavigation("Bangkok", "Singapore")).toEqual({
  kind: "route",
  href: "/flights/bangkok-to-singapore",
});
expect(resolveRouteNavigation("Bangkok", "")).toEqual({
  kind: "city",
  href: "/flights-from/bangkok",
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/features/route-navigation/domain/resolve-route-navigation.test.ts`
Expected: FAIL because the resolver module does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export function resolveRouteNavigation(originQuery: string, destinationQuery: string) {
  const origin = findHub(originQuery);
  const destination = findHub(destinationQuery);
  if (!origin) return null;
  if (!destination) return { kind: "city", href: `/flights-from/${origin.citySlug}` };
  const route = getHubRouteNetwork(origin).destinations.find(
    (item) => item.citySlug === destination.citySlug,
  );
  return route
    ? { kind: "route", href: route.routePath }
    : { kind: "city", href: `/flights-from/${origin.citySlug}` };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/features/route-navigation/domain/resolve-route-navigation.test.ts`
Expected: PASS.

### Task 2: Shared header control

**Files:**
- Create: `src/shared/ui/route-switcher.tsx`
- Modify: `src/shared/ui/site-header.tsx`
- Modify: `src/shared/ui/editorial-elements.css`
- Modify: `src/shared/ui/site-chrome.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const markup = renderToStaticMarkup(<SiteHeader />);
expect(markup).toContain('aria-label="Explore another flight route"');
expect(markup).toContain("FROM");
expect(markup).toContain("TO");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/shared/ui/site-chrome.test.tsx`
Expected: FAIL because the compact route switcher is absent.

- [ ] **Step 3: Write minimal implementation**

```tsx
<RouteSwitcher />
```

The switcher uses the resolver from Task 1, exposes accessible autocomplete choices, and opens as a
compact disclosure on small screens. It never calls a provider or serializes search queries into the
destination URL.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/shared/ui/site-chrome.test.tsx`
Expected: PASS.

### Task 3: Documentation and verification

**Files:**
- Modify: `../tripways-backend/docs/product/tripways-mvp-roadmap.md`
- Modify: `../tripways-backend/docs/product/p0-staging-readiness-prd.md`

- [ ] **Step 1: Document the shared header behavior**

State that City, Airport, and Route pages share the compact `From`/`To` resolver, which navigates to
canonical content only and keeps the live dated-search boundary in P3.

- [ ] **Step 2: Run verification**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
Expected: PASS.
