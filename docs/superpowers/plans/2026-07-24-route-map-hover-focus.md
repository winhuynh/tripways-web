# Route Map Hover Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add modern hover/tap focus behavior to route lines and destination dots.

**Architecture:** Deterministic GeoJSON feature IDs connect map events to a small interaction
module that applies MapLibre feature-state. The client manages events, one active destination
label, and the existing popup.

**Tech Stack:** TypeScript, React, MapLibre GL, GeoJSON, Vitest.

---

### Task 1: Add deterministic feature identity

**Files:**
- Modify: `src/features/route-map/domain/build-route-geojson.ts`
- Modify: `src/features/route-map/domain/build-route-geojson.test.ts`

- [ ] Assert route IDs use `route:<citySlug>` and destination IDs use
  `destination:<citySlug>`.
- [ ] Run the focused test and observe the missing IDs.
- [ ] Add deterministic IDs and the destination slug to route properties.
- [ ] Run the focused test and observe GREEN.

### Task 2: Implement the feature-state interaction boundary

**Files:**
- Create: `src/features/route-map/presentation/route-map-interaction.ts`
- Create: `src/features/route-map/presentation/route-map-interaction.test.ts`

- [ ] Write failing tests for active/dimmed state calls and reset behavior.
- [ ] Implement `focusRouteFeatures` and `resetRouteFeatures` against a narrow map port.
- [ ] Export modern line and point paint expressions with the approved widths, radii, colors, and
  opacities.
- [ ] Run the interaction tests and observe GREEN.

### Task 3: Connect hover, tap, and destination labels

**Files:**
- Modify: `src/features/route-map/presentation/route-map-client.tsx`
- Modify: `src/app/globals.css`

- [ ] Use interaction paint expressions in the MapLibre layers.
- [ ] Focus from both line and destination-point mouse events.
- [ ] Create one active destination label marker and remove it during reset or cleanup.
- [ ] Focus and open the popup from route-line or destination click.
- [ ] Clear pinned focus when the map background is clicked.
- [ ] Reduce default dot and line dimensions to the approved modern values.

### Task 4: Verify

- [ ] Run all tests, lint, typecheck, production build, and `git diff --check`.
- [ ] Verify hover on a route line and destination dot in the browser.
- [ ] Verify other routes dim, the destination label appears, and mouse leave resets.
- [ ] Verify mobile tap behavior and no horizontal overflow.
- [ ] Keep work local on main; do not commit or push.
