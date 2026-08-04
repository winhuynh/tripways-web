# Route Page City Hub Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new Google Stitch Route Page revision that follows the approved City Hub discovery pattern and compares both nonstop and connecting flight options.

**Architecture:** Preserve all existing Stitch screens. Generate one new desktop Route Page screen whose core is a synchronized sidebar, route map and option list, followed by decision support, one advertisement slot and compact pSEO content. Verify the rendered screen from visible DOM and screenshot evidence rather than relying on the generator response.

**Tech Stack:** Google Stitch, Codex in-app browser control, Playwright DOM inspection, Markdown product documentation.

---

### Task 1: Capture the accepted design constraints

**Files:**
- Reference: `docs/superpowers/specs/2026-08-03-route-page-stitch-design.md`
- Reference: `/Users/winn/Documents/Tripways/docs/product/route-page-pseo-requirements-prd.md`

- [ ] **Step 1: Confirm the default route scope**

Verify that the specification requires the H1 `Flights from Bangkok to London` and treats direct/nonstop as a filter and sub-intent rather than the entire page scope.

- [ ] **Step 2: Confirm the City Hub interaction pattern**

Verify that the desktop workspace contains a left sidebar and a right column with route map, result summary and flight-option list, all controlled by the same filters.

- [ ] **Step 3: Confirm removal constraints**

Verify that the new screen must not contain `Scheduled Nonstop Carriers`, standalone airline cards or multiple display-ad blocks.

### Task 2: Generate the new Stitch revision

**Files:**
- External design artifact: Google Stitch project `5009135772066714399`

- [ ] **Step 1: Select the current Route Page screen**

Select `Route — Bangkok to London — Decision-first PSEO — Final` as design context without editing it in place.

- [ ] **Step 2: Submit one explicit generation prompt**

Create a new screen named `Route — Bangkok to London — City Hub Pattern — All Flight Options`. The prompt must require:

- the shared TripWays editorial visual system;
- H1 `Flights from Bangkok to London`;
- a City Hub-style sidebar aligned with the top of the route map;
- departure airport, arrival airport, stops, maximum duration, estimated one-way Economy price and sort controls;
- solid map arcs for nonstop and segmented arcs through transit hubs for connecting options;
- a result summary and `Flight options from Bangkok to London` list immediately below the map;
- All options, Nonstop and 1 stop tabs;
- option rows containing airport pair, stop or transit, airline, total duration, frequency when available, estimated one-way Economy fare and CTA;
- evidence-backed recommendation cards;
- exactly one Advertisement Slot A;
- compact practical planning, labelled sponsored services, FAQ, internal links and provenance;
- no standalone airline section.

- [ ] **Step 3: Wait for generation completion**

Use the visible `Generating Screen` state as the completion signal. Do not inspect or repair the screen while Stitch is still generating.

### Task 3: Validate the generated content architecture

**Files:**
- External design artifact: `Route — Bangkok to London — City Hub Pattern — All Flight Options`

- [ ] **Step 1: Inspect the rendered DOM**

Confirm exactly one visible H1 and verify that its text is `Flights from Bangkok to London`.

- [ ] **Step 2: Validate the discovery workspace**

Confirm the rendered content contains departure airport, arrival airport, stops, duration, estimated fare and sort controls; route-map content; a visible result count; and the flight-option list.

- [ ] **Step 3: Validate option coverage**

Confirm that both `Nonstop` and `1 stop` appear in the core tabs or option rows and that connecting options are not relegated to a small editorial afterthought.

- [ ] **Step 4: Validate commercial constraints**

Confirm exactly one visible Advertisement block and one clearly labelled sponsored-services module. Confirm that affiliate CTAs are contextual and do not interrupt option rows.

- [ ] **Step 5: Validate removals**

Confirm that `Direct flights from Bangkok to London`, `Scheduled Nonstop Carriers` and standalone airline-card headings are absent.

### Task 4: Repair only verified gaps

**Files:**
- External design artifact: `Route — Bangkok to London — City Hub Pattern — All Flight Options`

- [ ] **Step 1: Build a bounded repair prompt**

If validation fails, list only the missing or incorrect elements found in Task 3. Instruct Stitch to modify only the new revision and preserve all other screens.

- [ ] **Step 2: Submit the repair prompt once**

Keep the accepted City Hub layout and existing correct sections unchanged. Remove only verified incorrect sections and add only verified missing sections.

- [ ] **Step 3: Re-run the full validation**

Repeat every check from Task 3 after generation completes. Do not claim completion from Stitch's textual response alone.

### Task 5: Visual QA and handoff

**Files:**
- External design artifact: `Route — Bangkok to London — City Hub Pattern — All Flight Options`

- [ ] **Step 1: Capture a screenshot**

Verify visually that the sidebar begins at the same vertical position as the map, the result list follows the map, and the page uses the City Hub typography, spacing, off-white background and blue accents.

- [ ] **Step 2: Confirm hierarchy**

Verify that the core comparison is visible before Advertisement Slot A and that practical planning and sponsored services appear only after the main options.

- [ ] **Step 3: Preserve the deliverable tab**

Finalize the browser session while keeping the Stitch project tab as the deliverable.

- [ ] **Step 4: Report evidence**

Report the new screen name, retained old screen, verified H1, nonstop and connecting coverage, filter-map-result synchronization, advertisement count, removed airline section and PRD/design references.

## Intentional exclusions

- No production frontend or backend implementation.
- No mobile Stitch screen in this revision.
- No live fare or schedule validation; displayed values remain design-only examples.
- No commit, push or deployment because repository workflow rules prohibit automatic external state changes.
