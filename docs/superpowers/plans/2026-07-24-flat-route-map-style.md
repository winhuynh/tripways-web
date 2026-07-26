# Flat Route Map Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the existing route map with a light monochrome OpenFreeMap basemap.

**Architecture:** A focused infrastructure module owns the MapLibre style contract. The client
component imports that style without changing domain data, application behavior, or page
composition.

**Tech Stack:** Next.js, TypeScript, MapLibre GL, OpenFreeMap/OpenMapTiles, Vitest.

---

### Task 1: Define and implement the flat style contract

**Files:**
- Create: `src/features/route-map/infrastructure/map/flat-route-map-style.test.ts`
- Create: `src/features/route-map/infrastructure/map/flat-route-map-style.ts`
- Modify: `src/features/route-map/presentation/route-map-client.tsx`

- [ ] Write a failing test that expects one OpenFreeMap vector source and exactly four base layers:
  background, water, country boundaries, and disputed boundaries.
- [ ] Run the focused test and confirm the style module is missing.
- [ ] Implement a typed MapLibre style object with no symbol, road, building, or POI layers.
- [ ] Replace the Liberty URL in the client with the local style object.
- [ ] Run focused route-map tests and confirm they pass.

### Task 2: Verify the visual result

**Files:**
- Modify only if required by evidence: `src/app/globals.css`

- [ ] Run all tests, lint, typecheck, production build, and `git diff --check`.
- [ ] Reload the Bangkok city page and verify the flat map, blue route lines, orange origin, blue
  destinations, controls, and attribution.
- [ ] Verify the map at a mobile viewport without changing backend behavior.
- [ ] Keep changes local on main; do not commit or push.
