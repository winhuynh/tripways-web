# Global Flat Route Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a quiet full-world basemap that visually prioritizes flight routes.

**Architecture:** Keep all basemap styling and camera defaults inside the route-map infrastructure adapter. The client consumes the exported camera without changing route read models or interactions.

**Tech Stack:** TypeScript, MapLibre GL, Vitest

---

### Task 1: Basemap style contract

**Files:**
- Modify: `src/features/route-map/infrastructure/map/flat-route-map-style.ts`
- Create: `src/features/route-map/infrastructure/map/flat-route-map-style.test.ts`

- [ ] Add a failing test asserting water, land, boundary, country-label layers and global camera defaults.
- [ ] Run the focused test and confirm it fails.
- [ ] Add the minimal MapLibre style layers and camera constants.
- [ ] Run the focused test and confirm it passes.

### Task 2: Global camera

**Files:**
- Modify: `src/features/route-map/presentation/route-map-client.tsx`

- [ ] Replace route-bounds fitting with the exported full-world camera.
- [ ] Run lint and TypeScript checks.
- [ ] Run all tests and the production build.
- [ ] Verify the map visually at desktop and mobile widths.

No commit step is included because this repository's Codex rules prohibit automatic commits.
