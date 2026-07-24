# MapLibre Route Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static SVG Route Map with a responsive interactive MapLibre/OpenFreeMap map.

**Architecture:** Pure domain code builds GeoJSON and bounds, infrastructure owns the tile style,
and one client component owns MapLibre lifecycle. The public presentation wrapper remains the
stable page-facing component.

**Tech Stack:** Next.js 16, React 19, TypeScript, MapLibre GL JS, OpenFreeMap, Vitest.

---

### Task 1: Geographic domain model

**Files:**
- Modify: `src/features/route-discovery/domain/airport.ts`
- Create: `src/features/route-discovery/domain/route-map.ts`
- Create: `src/features/route-discovery/domain/route-map.test.ts`

- [ ] Write failing tests for real airport coordinates, route point features, curved line features,
  and bounds.
- [ ] Run `pnpm test src/features/route-discovery/domain/route-map.test.ts` and confirm RED.
- [ ] Replace `mapX/mapY` with latitude/longitude and implement the minimal pure GeoJSON helpers.
- [ ] Run the test and confirm GREEN.

### Task 2: Map provider configuration

**Files:**
- Create: `src/features/route-discovery/infrastructure/map/map-style.ts`

- [ ] Export the OpenFreeMap Liberty style URL from infrastructure.
- [ ] Keep domain and application free of provider configuration.

### Task 3: Client MapLibre component

**Files:**
- Modify: `src/features/route-discovery/presentation/route-map.tsx`
- Create: `src/features/route-discovery/presentation/route-map-client.tsx`
- Create: `src/features/route-discovery/presentation/route-map-fallback.tsx`
- Modify: `src/app/globals.css`

- [ ] Write a failing render test for accessible loading/fallback route summaries.
- [ ] Run the focused component test and confirm RED.
- [ ] Install `maplibre-gl`.
- [ ] Implement dynamic client loading, sources/layers, markers, popup, controls, fit bounds, cleanup,
  and error fallback.
- [ ] Import MapLibre CSS globally and add responsive map sizing.
- [ ] Run component tests and confirm GREEN.

### Task 4: Verification

- [ ] Run `pnpm test && pnpm lint && pnpm typecheck && pnpm build`.
- [ ] Run the local app and inspect `/flights-from/SGN` and `/routes/SGN/SIN` at 375×812,
  768×1024, and 1440×900.
- [ ] Verify controls, popup, fit bounds, fallback, attribution, console errors, network errors, and
  horizontal overflow.
- [ ] Do not commit, push, or deploy.
