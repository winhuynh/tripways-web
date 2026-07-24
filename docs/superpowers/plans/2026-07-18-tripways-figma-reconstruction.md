# Tripways Figma Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct the current Tripways web application in the existing Figma file as an
editable design system with 18 desktop/mobile screen frames.

**Architecture:** Use a hybrid workflow. Browser captures from the running application provide
pixel references; Figma variables, styles, Auto Layout components, variants, and instances form
the maintainable deliverable. Work incrementally in the target file and validate every major
section before composing final screens.

**Tech Stack:** Next.js local application, in-app browser, Figma MCP, Figma variables and styles,
Auto Layout, components, component variants.

---

## Target artifacts

No application source files are modified.

- Target Figma file: `VMQKw6GyKfYXsAIOLdCeqT`
- Create or reconcile Figma pages:
  - `00 Foundations`
  - `01 Components`
  - `02 Homepage`
  - `03 Flights From`
  - `04 Route Detail`
  - `99 Reference`
- Design specification:
  `docs/superpowers/specs/2026-07-18-tripways-figma-design-system.md`

### Task 1: Inspect the source application and target Figma file

- [ ] **Step 1: Load required Figma instructions**

Read the complete `figma-use`, `figma-generate-design`, and their required references before any
Figma write. Include both skill names in every applicable `use_figma` call.

- [ ] **Step 2: Inventory the target file**

Use a read-only Figma call to return all pages, top-level nodes, local variable collections,
local text/effect/paint styles, and current naming conventions. Do not create, rename, or delete
nodes in this step.

Expected result: a structured inventory identifying whether the target file is empty and which
existing assets must be preserved.

- [ ] **Step 3: Check Code Connect**

Run:

```bash
rg --files | rg '\.figma\.(ts|tsx|js)$'
```

Expected result: either a list of relevant Code Connect files or an explicit empty result.

- [ ] **Step 4: Inventory existing Figma components**

Inspect each existing Figma page for `COMPONENT`, `COMPONENT_SET`, and `INSTANCE` nodes. Record
reusable matches for navigation, buttons, fields, cards, filters, notices, and footer content.

Expected result: a component reuse table with `component name`, `node ID or component key`, and
`reuse decision`.

- [ ] **Step 5: Inspect product source**

Read the page, layout, global CSS, and presentation component files used by:

```text
/
/flights-from/SGN
/routes/SGN/SIN
```

Record the product font, colors, spacing, radii, shadows, page sections, and responsive changes.

### Task 2: Capture pixel-reference screens

- [ ] **Step 1: Confirm local runtime**

Open `http://localhost:3000`. If unavailable, run:

```bash
pnpm dev
```

Expected result: the homepage responds successfully without changing application source.

- [ ] **Step 2: Capture canonical routes**

Capture full-page references at 1440 px and 375 px for:

```text
http://localhost:3000
http://localhost:3000/flights-from/SGN
http://localhost:3000/routes/SGN/SIN
```

Expected result: six reference captures with route and viewport encoded in their names.

- [ ] **Step 3: Import captures into `99 Reference`**

Use the Figma web-design capture workflow against file
`VMQKw6GyKfYXsAIOLdCeqT`. Arrange references in route rows with Desktop before Mobile.

Expected result: six clearly named reference frames that do not overlap existing content.

### Task 3: Build foundations

- [ ] **Step 1: Create or reconcile pages**

Create only missing pages from the approved file organization. Preserve unrelated existing
pages and nodes. Position new top-level content away from existing content.

- [ ] **Step 2: Create semantic color variables**

Create or reuse variables for:

```text
Background/Base
Background/Subtle
Surface/Default
Text/Primary
Text/Secondary
Border/Default
Brand/Primary
Brand/PrimaryStrong
Brand/Navy
State/Success
State/Warning
State/Error
```

Values must be extracted from `src/app/globals.css` and current component source. Bind created
swatches to the variables.

- [ ] **Step 3: Create typography styles**

Verify the product font with Figma's available-font list, load every used font style, then create
or reconcile display, heading, body, label, and caption styles. Do not default to Inter unless
the source application actually uses it.

- [ ] **Step 4: Document spacing, radius, and effects**

Create an Auto Layout foundation sheet showing the source spacing scale, corner radii, borders,
and shadows. Reuse variables/styles where the Figma API supports the property.

- [ ] **Step 5: Validate foundations**

Return the created/reused variable, style, and node IDs. Screenshot `00 Foundations` and verify
labels are legible, swatches are bound, and no node is clipped.

### Task 4: Build shared layout components

- [ ] **Step 1: Build brand and buttons**

Create reusable Brand and Button components with only observed variants:

```text
Button: emphasis=primary|secondary, size=default|compact
```

Use Auto Layout, semantic variables, and typography styles.

- [ ] **Step 2: Build responsive headers**

Create a Header component set:

```text
viewport=desktop|mobile
```

Desktop includes brand, navigation, utility actions, sign-in, and registration. Mobile includes
brand and the observed menu trigger/treatment.

- [ ] **Step 3: Build responsive footer**

Create a Footer component set:

```text
viewport=desktop|mobile
```

Preserve current link groups, supporting copy, locale/currency controls, and copyright.

- [ ] **Step 4: Validate shared layout**

Screenshot the header and footer component sets. Verify Auto Layout resizing, text wrapping,
variant names, and semantic bindings before composing screens.

### Task 5: Build search, filter, and feedback components

- [ ] **Step 1: Build search primitives**

Create reusable airport field, swap control, search action, and complete airport search form.
Include the compact presentation used on Route Detail.

- [ ] **Step 2: Build filter controls**

Create filter chip/control variants for default and active states, then compose the Filter
Toolbar component used by discovery pages.

- [ ] **Step 3: Build feedback panels**

Create Notice Panel variants:

```text
state=loading|empty|error
```

Use the actual copy hierarchy and warning/error visual treatments from the application.

- [ ] **Step 4: Validate interaction components**

Screenshot the component groups and verify field labels, component properties, state variants,
mobile wrapping, and focus/selection visibility.

### Task 6: Build route-discovery content components

- [ ] **Step 1: Build destination cards**

Create the Destination Card component from the current data-state UI, including destination,
route summary, airlines, and call to action.

- [ ] **Step 2: Build route option cards**

Create the Route Option Card component from the current schedule option presentation, including
stops, segments, airlines, duration, and confidence metadata.

- [ ] **Step 3: Build map visual states**

Create an editable Map component set:

```text
state=data|loading|error
viewport=desktop|mobile
```

The data state contains map surface, airport points, IATA labels, route arc, controls,
attribution, and the stored-route disclaimer. It must not imply live tracking.

- [ ] **Step 4: Build supporting panels**

Create route summary, airlines sidebar, local-data badge, and section-heading patterns required
by Flights From and Route Detail.

- [ ] **Step 5: Validate discovery components**

Screenshot all sets and verify content hierarchy, variant axes, semantic bindings, Auto Layout,
and absence of clipping or unintended overlap.

### Task 7: Compose Homepage frames

- [ ] **Step 1: Compose Desktop**

Build `Homepage / Desktop / Data` at 1440 px using shared Header, Hero, Route Search, How It
Works, and Footer instances.

- [ ] **Step 2: Compose Mobile**

Build `Homepage / Mobile / Data` at 375 px using mobile component variants and responsive
stacking. Do not scale down the desktop frame.

- [ ] **Step 3: Compare with references**

Screenshot both frames and compare their section order, content width, type scale, spacing,
colors, and footer structure against the imported captures. Apply targeted fixes before
continuing.

### Task 8: Compose Flights From frames

- [ ] **Step 1: Build Desktop data state**

Build `Flights From / Desktop / Data` using SGN content, map, filter toolbar, destination grid,
airlines sidebar, shared header, and footer.

- [ ] **Step 2: Derive Desktop loading, empty, and error**

Create separate frames that preserve the surrounding layout and replace only the route result
region with the corresponding feedback state.

- [ ] **Step 3: Build Mobile data state**

Build `Flights From / Mobile / Data` at 375 px with stacked sections, mobile header/footer,
mobile map, wrapping filters, destination cards, and airline content.

- [ ] **Step 4: Derive Mobile loading, empty, and error**

Create separate mobile frames with the same structure and state-specific result content.

- [ ] **Step 5: Validate all eight frames**

Confirm these names exist:

```text
Flights From / Desktop / Data
Flights From / Desktop / Loading
Flights From / Desktop / Empty
Flights From / Desktop / Error
Flights From / Mobile / Data
Flights From / Mobile / Loading
Flights From / Mobile / Empty
Flights From / Mobile / Error
```

Screenshot Desktop Data and Mobile Data and compare them against references. Check all state
frames for consistent surrounding structure.

### Task 9: Compose Route Detail frames

- [ ] **Step 1: Build Desktop data state**

Build `Route Detail / Desktop / Data` using SGN → SIN content, compact search, route hero,
summary panel, map, filters, route option cards, shared header, and footer.

- [ ] **Step 2: Derive Desktop loading, empty, and error**

Preserve the page shell and replace only the schedule-results region with the matching feedback
state.

- [ ] **Step 3: Build Mobile data state**

Build `Route Detail / Mobile / Data` at 375 px using mobile variants and stacked content.

- [ ] **Step 4: Derive Mobile loading, empty, and error**

Create mobile loading, empty, and error frames with the same surrounding page structure.

- [ ] **Step 5: Validate all eight frames**

Confirm these names exist:

```text
Route Detail / Desktop / Data
Route Detail / Desktop / Loading
Route Detail / Desktop / Empty
Route Detail / Desktop / Error
Route Detail / Mobile / Data
Route Detail / Mobile / Loading
Route Detail / Mobile / Empty
Route Detail / Mobile / Error
```

Screenshot Desktop Data and Mobile Data, compare them against references, and check all state
frames for structural consistency.

### Task 10: Final Figma verification and handoff

- [ ] **Step 1: Verify screen count**

Inspect pages `02 Homepage`, `03 Flights From`, and `04 Route Detail`. Expected primary-frame
count: 18.

- [ ] **Step 2: Verify component usage**

Inspect instances in every primary frame. Header, Footer, buttons, forms, filters, cards,
notices, and map visuals must be instances where their matching component exists.

- [ ] **Step 3: Verify layout quality**

Screenshot all primary frames in manageable batches. Check for clipped text, hidden content,
overlap, invalid overflow, inconsistent spacing, leftover shimmer placeholders, and accidental
absolute positioning of structural content.

- [ ] **Step 4: Preserve references safely**

Keep `99 Reference` hidden for future comparison unless the user requests deletion. Do not
delete unrelated nodes.

- [ ] **Step 5: Deliver Figma link and inventory**

Return the target Figma link with a concise inventory:

```text
implemented: foundations, reusable components, 18 desktop/mobile frames, four route states;
skipped: tablet-specific frames, interactive MapLibre behavior, Code Connect;
add when: tablet requires breakpoint-specific art direction or engineering requests Code Connect.
```

Do not commit, push, deploy, or alter application source.
