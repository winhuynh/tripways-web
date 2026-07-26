# Route Map Hover Focus Design

## Goal

Make direct routes easier to inspect by focusing the hovered route or destination while preserving
the modern, minimal flat-map visual direction.

## Interaction

- Hovering either a route line or destination dot activates the same destination.
- The active route remains blue and becomes slightly wider.
- Other routes become thin, low-opacity blue-grey.
- The active destination dot grows slightly; other destination dots fade.
- Bangkok remains visible and is never dimmed.
- A compact destination label appears above the active destination in the same visual language as
  the Bangkok label.
- Mouse leave resets the transient focus.
- Click or tap pins the focus and opens the existing destination popup.
- Clicking the map background clears the pinned focus.

## Visual Values

- Default route width: `1.35`; active: `2.4`; dimmed: `1`.
- Default route opacity: `0.68`; active: `0.95`; dimmed: `0.2`.
- Bangkok radius: `6`; destination radius: `3.25`; active destination radius: `4.75`.
- Default destination opacity: `0.9`; dimmed: `0.42`.

## Architecture

- GeoJSON assigns deterministic IDs to route and destination features.
- A focused interaction module owns feature-state updates and paint expressions.
- The MapLibre client owns browser events and temporary destination label lifecycle.
- No backend, DTO, repository, or use-case changes are required.

## Accessibility

The existing popup remains available through tap/click. Hover-only labels are supplemental and do
not replace server-rendered route content.
