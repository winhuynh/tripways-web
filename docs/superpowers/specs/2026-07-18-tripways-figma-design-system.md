# Tripways Figma Design System and Screen Reconstruction

## Goal

Reconstruct the current Tripways web UI in the existing Figma file as an editable,
maintainable design system. The Figma output must match the running application closely while
remaining useful for future product design, engineering handoff, and QA.

Target Figma file:

- `VMQKw6GyKfYXsAIOLdCeqT`
- Name: `tripways`

## Approved approach

Use a hybrid reconstruction workflow:

1. Capture the running web pages as pixel-accurate references.
2. Inspect the existing Figma file before creating or changing nodes.
3. Establish foundations and reusable components.
4. Rebuild each screen with Auto Layout and component instances.
5. Compare reconstructed screens against the reference captures.
6. Hide or remove temporary reference captures after verification.

Reference captures are not the final deliverable. The final screens must be editable Figma
objects with reusable components.

## Scope

### Breakpoints

- Desktop: 1440 px viewport.
- Mobile: 375 px viewport.
- Tablet is not delivered as a separate frame. Auto Layout and constraints must allow the
  design to interpolate between mobile and desktop.

### Pages

1. Homepage.
2. Flights From, using `SGN` as the representative origin.
3. Route Detail, using `SGN → SIN` as the representative route.

### States

Homepage receives one canonical state at each breakpoint.

Flights From and Route Detail each receive:

- Data.
- Loading.
- Empty.
- Error.

This produces 18 primary screen frames:

- Homepage: 2.
- Flights From: 8.
- Route Detail: 8.

### Shared UI

- Desktop header and navigation.
- Mobile header and menu treatment.
- Footer.
- Buttons and links.
- Airport search fields.
- Search form.
- Filter controls.
- Destination cards.
- Route option cards.
- Summary and notice panels.
- Map container and its data, loading, and error presentations.

The Figma map is an editable visual representation, not an interactive MapLibre runtime.

## Figma file organization

Use the following pages:

- `00 Foundations`
- `01 Components`
- `02 Homepage`
- `03 Flights From`
- `04 Route Detail`
- `99 Reference`

If the target file already contains an established structure, preserve existing work and adapt
these names to its conventions instead of deleting or overwriting unrelated nodes.

## Foundations

Extract values from the current source rather than inventing a new visual language:

- Color roles for background, surface, text, muted text, borders, primary blue, navy, success,
  warning, and error.
- Product typography and a practical type scale.
- Spacing scale.
- Corner radius scale.
- Border and shadow styles.
- Desktop and mobile content widths.

Use Figma variables and styles where the target file supports them. Components and screens
should bind to these shared definitions instead of duplicating raw values.

## Component architecture

Components must use Auto Layout and expose variants only where a state or presentation changes
meaningfully. Avoid speculative variants that do not appear in the current product.

Recommended variant axes include:

- Size: desktop/mobile where structure changes.
- State: default, loading, empty, error where applicable.
- Selection: default/active for filters and navigation.
- Emphasis: primary/secondary for buttons.

Desktop and mobile frames must be composed from component instances wherever possible.

## Screen reconstruction

Each screen must:

- Match the running UI's hierarchy, spacing, typography, colors, borders, and responsive
  behavior.
- Use representative content from the current application.
- Preserve a clear layer hierarchy and meaningful node names.
- Avoid absolute positioning for structurally related content.
- Avoid clipped text, overlapping nodes, or detached duplicate components.
- Keep the shared header and footer consistent through instances.

Loading, empty, and error frames must preserve the same surrounding page structure as the data
state and vary only the relevant content region.

## Source of truth

The running local application and current source code are the visual and structural source of
truth:

- `/`
- `/flights-from/SGN`
- `/routes/SGN/SIN`

The existing Figma file is the source of truth for any established naming convention, reusable
library component, variable, or style that already exists and matches the product.

## Verification

Before completion:

1. Inspect all Figma pages, local variables, styles, and existing components.
2. Capture desktop and mobile references for all three routes.
3. Verify all 18 primary frames exist and use the intended component instances.
4. Check desktop and mobile screenshots visually against their reference captures.
5. Check that text is not clipped and frames do not contain unintended overflow.
6. Confirm temporary placeholders are removed.
7. Confirm unrelated existing Figma nodes were not deleted or overwritten.

## Non-goals

- Redesigning Tripways.
- Creating a separate tablet frame set.
- Reproducing live MapLibre interactions inside Figma.
- Adding flows or product states not present in the current application.
- Writing Code Connect mappings in this phase.
- Committing, pushing, deploying, or changing application source code.

## Completion criteria

The work is complete when the existing Figma file contains foundations, reusable components,
and all 18 reviewed screen frames, with desktop/mobile fidelity to the local application and
complete data/loading/empty/error coverage for the two route-discovery pages.
