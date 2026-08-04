# Advertising Variants Stitch Implementation Plan

> **For agentic workers:** Execute this plan inline in the existing signed-in Stitch side-panel session. Do not use an external browser or modify repository application code.

**Goal:** Create Display Ads and Hybrid Ads desktop/mobile variants for Homepage, City Hub, and Airport Hub while preserving all existing ad-free screens.

**Architecture:** Process one page pair at a time. Select the current desktop/mobile source pair, instruct Stitch to create four new derivative screens rather than edit the source, verify both advertising treatments, then continue to the next page. Finish by validating names, counts, density, and canvas grouping.

**Tech Stack:** Google Stitch prototype canvas, TripWays design system

---

### Task 1: Create Homepage advertising variants

- [ ] Select the existing Homepage desktop/mobile pair.
- [ ] Generate `Homepage — Route Discovery — Desktop — Display Ads` and its mobile counterpart with display placements after the map and near the directory/footer.
- [ ] Generate `Homepage — Route Discovery — Desktop — Hybrid Ads` and its mobile counterpart with a post-map display unit and a clearly labelled native sponsored-travel module after featured routes.
- [ ] Verify search and map remain above advertising, mobile has at most two placements, and the source pair is unchanged.

### Task 2: Create City Hub advertising variants

- [ ] Select the existing City Hub desktop/mobile pair.
- [ ] Generate Display Ads variants with placements after the route map, after the direct-flight table, and before FAQ on desktop; mobile keeps the first two.
- [ ] Generate Hybrid Ads variants with one post-map display unit, one sponsored flight-comparison module after the route table, and one sponsored hotel/transfer module after the airport section; mobile keeps no more than two.
- [ ] Verify the complete route table, shared filters, estimated prices, and Route Page CTAs remain unchanged.

### Task 3: Create Airport Hub advertising variants

- [ ] Select the existing Airport Hub desktop/mobile pair.
- [ ] Generate Display Ads variants with placements after the route map, after facilities, and before FAQ on desktop; mobile keeps the first two.
- [ ] Generate Hybrid Ads variants with one post-map display unit, one sponsored airport-hotel/transfer module after access, and one sponsored lounge/parking/car-rental module after facilities; mobile keeps no more than two.
- [ ] Verify airport facts, map, routes, access, airport comparison, FAQ, and related links remain unchanged.

### Task 4: Verify and arrange the canvas

- [ ] Confirm the original six ad-free screens still exist unchanged.
- [ ] Confirm twelve new advertising screens exist with unambiguous Display Ads or Hybrid Ads names.
- [ ] Confirm every placement is labelled `Advertisement` or `Sponsored`.
- [ ] Confirm no ad appears above the primary action, no mobile screen has more than two ads, and no sticky, popup, interstitial, or deceptive native placement exists.
- [ ] Arrange the original, Display Ads, and Hybrid Ads sets as three nearby comparison groups.
- [ ] Confirm the final canvas contains nineteen nodes: one design-system node, six ad-free screens, six Display Ads screens, and six Hybrid Ads screens.
