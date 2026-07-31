# Public Terms and Data Use Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish clean English Terms, link them from the shared footer, and show a reusable route-information disclaimer without changing provider or database behavior.

**Architecture:** A static App Router page owns the legal copy, while one shared server-compatible UI component owns the concise route disclaimer. Existing route pages compose that component and the shared footer exposes the canonical Terms URL. No backend, schema, migration, or client-side state is added.

**Tech Stack:** Next.js App Router, React Server Components, strict TypeScript, Vitest, Testing Library, CSS

---

### Task 1: Static Terms page

**Files:**

- Create: `src/app/terms/page.test.tsx`
- Create: `src/app/terms/page.tsx`
- Create: `src/app/terms/terms-page.css`

- [ ] **Step 1: Write the failing Terms contract test**

Assert that the page exports Terms metadata and renders the effective date, informational-use
notice, third-party-rights language, prohibited automated extraction, search-engine exception,
liability limitation, and contact section.

- [ ] **Step 2: Run the focused test and observe the missing-module failure**

Run: `pnpm vitest run src/app/terms/page.test.tsx`  
Expected: FAIL because `src/app/terms/page.tsx` does not exist.

- [ ] **Step 3: Implement the static server-rendered page**

Create a semantic article using the existing `SiteHeader` and `SiteFooter`. Keep legal copy
jurisdiction-neutral, state that Tripways is informational only, distinguish Tripways IP from
third-party rights, prohibit unauthorized extraction, and permit compliant search-engine crawling.
Import a focused stylesheet with a bounded reading width and existing design tokens.

- [ ] **Step 4: Run the focused test**

Run: `pnpm vitest run src/app/terms/page.test.tsx`  
Expected: PASS.

### Task 2: Shared footer Terms link

**Files:**

- Modify: `src/shared/ui/site-chrome.test.tsx`
- Modify: `src/shared/ui/site-footer.tsx`

- [ ] **Step 1: Add the failing footer assertion**

Require a `Terms` link with `href="/terms"` and require the old `Legal preview` text to be absent.

- [ ] **Step 2: Run the footer test and observe failure**

Run: `pnpm vitest run src/shared/ui/site-chrome.test.tsx`  
Expected: FAIL because the footer still renders preview-only legal text.

- [ ] **Step 3: Replace preview copy with semantic legal navigation**

Render the copyright paragraph and a small navigation element containing the Terms link. Do not
create placeholder Privacy or Technical links.

- [ ] **Step 4: Run the footer test**

Run: `pnpm vitest run src/shared/ui/site-chrome.test.tsx`  
Expected: PASS.

### Task 3: Reusable route-information disclaimer

**Files:**

- Create: `src/shared/ui/route-information-disclaimer.test.tsx`
- Create: `src/shared/ui/route-information-disclaimer.tsx`
- Modify: `src/shared/ui/index.ts`
- Modify: `src/shared/ui/editorial-elements.css`
- Modify: `src/app/airports/[airportSlug]/page.tsx`
- Modify: `src/app/flights-from/[citySlug]/page.tsx`

- [ ] **Step 1: Write the failing component test**

Require the planning-reference message, verification instruction, and `/terms` link.

- [ ] **Step 2: Run the focused test and observe failure**

Run: `pnpm vitest run src/shared/ui/route-information-disclaimer.test.tsx`  
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement and export the server-compatible component**

Create a focused component with semantic note markup and a Terms link. Style it with existing
editorial tokens, no client directive, and no new dependency.

- [ ] **Step 4: Compose the disclaimer into airport and city route pages**

Place it after the primary informational content and before the shared footer so it remains visible
without interrupting route discovery.

- [ ] **Step 5: Run focused component and page tests**

Run: `pnpm vitest run src/shared/ui/route-information-disclaimer.test.tsx src/app/page.test.tsx`  
Expected: PASS.

### Task 4: Source and migration cleanliness verification

**Files:**

- Modify only if formatting requires it: files from Tasks 1–3

- [ ] **Step 1: Format changed web files**

Run the repository formatting command against the changed files.  
Expected: no unrelated file rewrites.

- [ ] **Step 2: Run full web verification**

Run: `pnpm test`  
Run: `pnpm lint`  
Run: `pnpm typecheck`  
Run: `pnpm build`  
Expected: all commands exit successfully.

- [ ] **Step 3: Inspect both repository diffs**

Confirm Terms work changes no backend SQL source or generated migration. Confirm any pre-existing
backend migration changes still correspond to `supabase/sql_src` and are not modified by this
feature.

- [ ] **Step 4: Run backend migration cleanliness checks**

Run the existing migration regeneration/verification workflow only if it is non-destructive to the
local development database; otherwise run its check mode or compare generated output in a temporary
copy. Run relevant backend tests and guards.  
Expected: no new drift introduced by the Terms feature.

- [ ] **Step 5: Review final diff**

Verify there are no placeholder legal links, provider ownership claims, raw provider exposure,
unused code, new dependencies, or generated artifacts.
