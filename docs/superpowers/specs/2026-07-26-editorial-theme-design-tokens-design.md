# Editorial Theme and Design Tokens Design

## Goal

Create a reusable Tripways design foundation from the approved editorial style
board while preserving the current city-page UI.

## Token layers

The design system follows the same separation used by `slofi-mobile`:

1. Primitive tokens define reusable palettes and dimensions without UI meaning.
2. Semantic theme tokens map primitives to roles such as `primary`, `surface`,
   `on-surface`, `border`, `link`, `warning`, and `error`.
3. Existing legacy variables temporarily alias semantic roles so current
   components continue rendering while they are migrated incrementally.

## Approved foundations

- Primary: `#137FEC`
- Secondary: `#5F5E5E`
- Tertiary: `#CE6000`
- Neutral: `#FDF9F2`
- Headline: Playfair Display
- Body: Merriweather
- Label and controls: Inter

The palettes include lighter and darker steps for interaction states, borders,
and accessible foregrounds. Component-specific tokens are excluded until a real
component needs them.

## Web implementation

- CSS custom properties are the runtime token format.
- `next/font` self-hosts the three approved font families.
- Token CSS is imported before application CSS.
- A small contract test protects exact brand values, semantic mappings, and
  legacy aliases.

## Scope exclusions

This change establishes and wires the theme foundation. It does not redesign all
existing page components or add dark mode.
