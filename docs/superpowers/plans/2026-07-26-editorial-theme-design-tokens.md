# Editorial Theme and Design Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved editorial color, typography, spacing, radius, and size tokens and wire them into the current Next.js app.

**Architecture:** Primitive CSS tokens remain independent of UI meaning. A semantic theme maps primitives to application roles, while temporary legacy aliases protect existing components during incremental migration.

**Tech Stack:** Next.js, React, CSS custom properties, next/font, Vitest

---

### Task 1: Protect the design contract

**Files:**
- Create: `src/app/design/theme/theme-contract.test.ts`

- [ ] Add a failing test that reads the token CSS and asserts the four approved colors, three font roles, semantic mappings, and legacy aliases.
- [ ] Run the focused test and observe failure because the design files do not exist.

### Task 2: Add primitive and semantic token files

**Files:**
- Create: `src/app/design/tokens/colors.css`
- Create: `src/app/design/tokens/typography.css`
- Create: `src/app/design/tokens/spacing.css`
- Create: `src/app/design/tokens/radii.css`
- Create: `src/app/design/tokens/sizes.css`
- Create: `src/app/design/theme/theme.css`
- Create: `src/app/design/index.css`

- [ ] Define primitive palettes and dimensional scales.
- [ ] Map primitives to semantic application roles.
- [ ] Add the narrow compatibility aliases used by existing Tripways CSS.
- [ ] Run the focused test and confirm the design contract passes.

### Task 3: Wire fonts and global theme

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] Load Playfair Display, Merriweather, and Inter through `next/font/google`.
- [ ] Attach their CSS variables to the root HTML element.
- [ ] Import the design foundation before application CSS.
- [ ] Replace root-level hard-coded body colors and font family with semantic tokens.

### Task 4: Verify

**Files:**
- No additional production files.

- [ ] Run all tests, lint, TypeScript, production build, and `git diff --check`.
- [ ] Verify Bangkok and Singapore pages render without layout regression.

No commit or push is performed because repository rules prohibit automatic integration.
