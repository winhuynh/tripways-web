# City Hub pSEO Stitch Implementation Plan

> **For agentic workers:** Execute this plan inline in the existing signed-in Stitch side-panel session. Do not use an external browser.

**Goal:** Replace the City Hub destination cards with a clickable direct-flight table and add estimated price data throughout the page while preserving the TripWays visual system.

**Architecture:** Modify only the existing City Hub desktop and mobile screens through a single tightly scoped Stitch correction prompt. Preserve Homepage, Airport Hub, and the design-system node. Verify information parity and remove superseded City Hub versions after the corrected pair is confirmed.

**Tech Stack:** Google Stitch prototype canvas, TripWays design system

---

### Task 1: Submit the City Hub correction

- [ ] Select the current City Hub desktop and mobile screens.
- [ ] Submit one correction prompt that includes the complete approved hierarchy, snapshot metrics, direct-flight table fields, filters, map synchronization, estimated-price qualification, and explicit exclusions.
- [ ] Require Stitch to preserve the existing TripWays warm ivory, navy, blue, editorial typography, spacing, and component language.
- [ ] Require Stitch to leave Homepage and Airport Hub unchanged.

### Task 2: Verify desktop output

- [ ] Confirm the destination cards were replaced by a 10–20 row direct-flight table.
- [ ] Confirm each row contains destination, IATA code, departure airport, country or region, airlines, duration, weekly frequency, estimated return price range, and "View route".
- [ ] Confirm "View all direct flights" expands the complete list on the same page.
- [ ] Confirm the map preview includes duration, airlines, estimated price range, and a Route Page CTA.
- [ ] Confirm no historical, year-round, or seasonal content remains.

### Task 3: Verify mobile output

- [ ] Confirm mobile preserves the desktop information architecture without horizontal overflow.
- [ ] Confirm the route table becomes stacked clickable rows or a compact horizontally safe data list.
- [ ] Confirm the five primary network metrics appear first and additional facts remain accessible.
- [ ] Confirm filters remain usable through a compact drawer or sheet.
- [ ] Confirm price qualification is visible near every estimated-fare module.

### Task 4: Clean and arrange the canvas

- [ ] Keep the corrected City Hub desktop and mobile pair.
- [ ] Delete superseded City Hub versions only after confirming the corrected pair.
- [ ] Keep Homepage, Airport Hub, and the design-system node unchanged.
- [ ] Position the corrected City Hub pair near the existing Homepage and Airport Hub cluster.
- [ ] Verify the final canvas contains exactly one desktop/mobile pair for each page type.
