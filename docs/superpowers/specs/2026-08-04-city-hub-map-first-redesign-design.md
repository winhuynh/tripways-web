# City Hub Map-First Redesign

## Goal

Refine the existing City Hub into a focused, server-rendered direct-flight discovery page. Preserve the Stitch-inspired TripWays editorial visual language, keep the route map visible by default, and remove duplicated or low-value UI without changing the backend data contracts.

The page must help a visitor answer three questions in order:

1. Where can I fly nonstop from this city?
2. Which city airport serves the route?
3. Which route should I explore next?

## Scope

This redesign changes only the City Hub presentation layer and presentation tests under `src/features/city-page/presentation`. Existing backend repositories, DTOs, read models, RPC behavior, Airport Hub, Route Page, and Homepage remain unchanged unless a compile-safe presentation adapter is strictly required.

Seed values are accepted as preview content. The redesign does not evaluate or replace their factual accuracy.

## Design direction

Use a controlled map-first hierarchy:

1. Breadcrumb and compact editorial hero
2. Four primary network facts
3. One destination search surface
4. Full-width route map, visible by default
5. Compact URL-driven filter toolbar
6. Server-rendered destination list
7. Airport comparison
8. Airline network
9. City-specific flight insights
10. Airport access content
11. FAQ
12. Alternate departure cities and related links
13. Route information disclaimer and footer

The map supports visual discovery. The destination list remains the primary comparison, navigation, accessibility, and SEO surface.

## Hero

Use the backend-provided City Hub identity while presenting a concise visible heading:

- Visible H1: `Direct flights from {city}`
- Supporting line: `Explore nonstop destinations from every {city} airport.`
- Intro copy may continue to use reviewed backend content when it adds information not already stated by the heading.

Show only four facts in the hero:

- Direct destinations
- Countries
- Airlines
- Airports

Move shortest and longest route facts to the insights section. Remove the oversized hero height and reduce decorative line breaks so the search and map appear earlier.

## Search and filters

Use one search surface only. It submits URL parameters and anchors to the destination results.

- Label: `Search direct destinations from {city}`
- Placeholder: `Search a city, country or airport`
- CTA: `Explore destinations`

Remove the duplicated quick-search links that repeat airport and duration filters.

Keep only filters supported by the current City Hub query contract:

- Departure airport
- Maximum flight duration
- Departure window, when the backend supports a meaningful value

The filter result summary reads `{count} nonstop destinations`. Avoid adding price, seasonality, route-type, or other controls without backend support.

## Route map

Render the existing route map immediately after the search surface. The map is visible by default on desktop and mobile.

- Desktop height: approximately 520–580px
- Mobile height: approximately 360–420px
- Preserve keyboard and pointer interaction from the shared Route Map feature
- Keep its existing local unavailable state
- Do not duplicate destination details around the map

## Destination list

Replace the current image-led destination card grid with compact, responsive destination rows. Do not use decorative placeholder media, `Year-round`, or repeated `Direct route` badges.

Each row contains:

- Destination city and country
- Destination airport codes
- Origin airport codes
- Airlines
- Shortest direct duration
- Weekly frequency when available
- Descriptive route link

Use the route link text `Explore {origin city} to {destination city}` where practical. The entire row may provide a larger pointer target, but it must retain one clear semantic link and visible keyboard focus.

Desktop uses a structured multi-column row. Mobile stacks the identity and facts without horizontal scrolling.

The section heading is `Nonstop destinations from {city}`. The result summary should be explicit, and the empty state should say:

`No destinations match these filters. Try another airport or flight duration.`

Remove the destination sidebar, newsletter card, duplicated quick-facts panel, and rectangle advertising placement from this section.

## Supporting sections

### Airport comparison

Retain the airport section because distinguishing city airports is a primary City Hub task. Use the heading `Choose the {city} airport that fits your trip`. Preserve backend airport counts, descriptions, business-model summaries, and links to Airport Hub pages.

### Airlines

Retain the airline section as a compact network directory. Avoid generic marketing copy and prioritize carrier name, served origin airports, destination count, and crawlable airline links.

### Insights

Use the heading `Understand {city}'s flight network`. Present backend-derived facts such as the most popular, shortest, and longest destinations, top airline, average duration, and country reach. Copy must describe observable data instead of making unsupported promotional claims.

### Airport access

Keep reviewed airport access information within the airport section or a directly adjacent subsection. Do not create a separate tourism guide.

### FAQ and internal links

Keep reviewed FAQs and existing FAQ structured data. Retain one leaderboard ad after the FAQ if advertising remains enabled. Move alternate departure cities and related links below the FAQ so they do not interrupt the primary Bangkok discovery flow.

## Content and UX writing rules

- Use direct, descriptive headings rather than slogans.
- Prefer `nonstop destination` over switching inconsistently between `flight`, `route`, and `connection`.
- Use `Explore route` or a descriptive origin-to-destination link instead of vague `View details` copy.
- Avoid claims about price, convenience, value, popularity, or smoothness unless supplied by the backend read model.
- Do not repeat the same fact in the hero, sidebar, insight cards, and destination rows.
- Empty and unavailable states must explain what the user can do next.

## SEO requirements

- Keep all essential destination links in server-rendered HTML.
- Preserve one H1 and a logical H2/H3 hierarchy.
- Preserve the backend metadata and canonical/indexability contract.
- Use descriptive anchors for route, airport, airline, country, and alternate-city links.
- Keep breadcrumb navigation and FAQ structured data.
- Do not add generic paragraphs solely to increase word count.
- Maintain the City Hub's distinct entity role: aggregate all airports serving a city, then link to airport-specific and route-specific pages.

## Responsive and accessibility requirements

- Four hero facts render as four columns on wide screens and a two-by-two grid on small screens.
- The search control remains fully labelled and usable with a keyboard.
- The map remains visible by default without dominating the complete mobile viewport.
- Filters wrap into readable rows and retain visible labels.
- Destination rows do not require horizontal scrolling.
- Interactive elements have visible focus states and meet practical touch-target sizes.
- Decorative text and symbols remain hidden from assistive technology.

## Failure handling

Preserve the current independent Suspense boundaries and section-level unavailable states. A map, insight, airport, FAQ, or link failure must not prevent the required overview or destination navigation from rendering.

## Testing and verification

Follow test-first development for presentation behavior and copy changes:

- Hero renders only the four primary facts.
- Search exposes one labelled destination input and the approved CTA.
- Destination results render semantic links and no decorative media/sidebar content.
- Empty results render actionable copy.
- Existing airport, insight, FAQ, metadata, and query tests continue to pass.
- Run tests, lint, typecheck, and production build.
- Verify the Bangkok City Hub at desktop and mobile widths in the local browser.

## Acceptance criteria

- The route map is visible by default before filters and results.
- The hero is substantially shorter and shows four primary facts.
- The page contains only one destination search surface.
- The destination grid is replaced by responsive, text-first route rows.
- The destination sidebar, newsletter, duplicate quick facts, placeholder media, and rectangle ad are absent.
- Airport comparison, airlines, insights, FAQ, internal links, disclaimer, and footer remain available.
- The page uses existing backend data without introducing unsupported fields.
- Desktop and mobile checks show no horizontal overflow and preserve the Stitch-inspired ivory, cobalt, charcoal, and editorial typography system.
