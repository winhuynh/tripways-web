# Airport Journey Tabs Stitch Implementation Plan

> **For agentic workers:** Execute this plan inline in the current session. Do not commit, push, or deploy because the repository workflow forbids automatic Git operations.

**Goal:** Rework the approved Stitch airport guide so the page prioritises orientation, two-way Bangkok connections, and complete Arriving and Departing journey states.

**Architecture:** Keep the existing Tripways visual system and shared logo-only header/two-row footer. Create two review screens from one content structure: everything above the journey tabs is identical, while each screen exposes a complete direction-specific journey panel. Verified flights follows the active journey panel; lower-priority airport essentials follow verified flights.

**Tech Stack:** Google Stitch visual editor, existing Tripways design system, repository Markdown specification.

---

### Task 1: Audit current airport screens

**Files:**
- Reference: `docs/superpowers/specs/2026-07-27-airport-pseo-page-design.md`

- [x] Open the Tripways Stitch project and identify every airport-guide screen.
- [x] Record which screen best preserves the approved typography, spacing, colours, shared header, and footer.
- [x] Identify obsolete airport variants, but defer deletion until the two replacements are verified.

### Task 2: Build the shared upper page

- [x] Preserve the logo-only header and existing Tripways visual language.
- [x] Place airport identity and overview first, without journey tabs inside the hero.
- [x] Place quick facts immediately after orientation.
- [x] Build `Bangkok and airport connections` before the journey tabs.
- [x] Include a visible `Airport → Bangkok | Bangkok → Airport` direction control and a scannable comparison of rail, bus, taxi/ride-hailing, transfer, and rental car using estimated prices.

### Task 3: Build the Arriving state

- [x] Create or duplicate a screen named `Airport Guide — Arriving`.
- [x] Activate `Arriving at BKK` in the journey tab set.
- [x] Show the complete sequence: arrival/connection signs, immigration where applicable, baggage claim, customs where applicable, arrivals hall, meeting point, and onward transport.
- [x] Add compact airport-specific help for SIM/eSIM, money, baggage issues, pickup, and late-night arrival only where useful.
- [x] Keep commercial transfer and car-rental actions secondary to the practical instructions.

### Task 4: Build the Departing state

- [x] Create or duplicate a screen named `Airport Guide — Departing` using the identical shared upper page.
- [x] Activate `Departing from BKK` in the journey tab set.
- [x] Show the complete sequence: confirm terminal, travel to airport, drop-off/parking, check-in and bag drop, security, departure immigration where applicable, and gate timing.
- [x] Include neutral lounge guidance with access method, terminal/airside location, opening window, facilities, estimated maintained price, verification date, and affiliate disclosure.
- [x] Do not add exhaustive shop, restaurant, duty-free, or generic facility directories.

### Task 5: Position supporting modules

- [x] Place `Verified direct flights to and from BKK` immediately after the journey panel in both screens.
- [x] Preserve `From BKK | To BKK`, city/airport search, domestic/international, airline, and geography filters.
- [x] Keep airport essentials and FAQs below verified flights and render only airport-specific maintained information.
- [x] Preserve the shared two-row footer on both screens.

### Task 6: Review and cleanup

- [x] Compare the two screens side by side and confirm all content above the journey tabs matches.
- [x] Confirm each active tab changes the complete journey content, not only its label.
- [x] Check hierarchy, alignment, content density, contrast, tap targets, and desktop page continuity.
- [ ] Remove obsolete or rejected airport-guide screens only after both replacement screens are present and correct. Blocked by Stitch deletion persistence: removed screens return after reload.
- [x] Report the final screen names and any Stitch limitation that prevented exact implementation.
