# Route Page Stitch Design

## Status

Approved product direction pending written-spec review. This specification replaces the earlier direct-flight-first route concept.

## Goal

Create a Route Page concept for a Bangkok-to-London example that follows the approved City Hub discovery pattern. The page must help travelers compare every publishable flight option between the two cities, including nonstop and connecting itineraries, without presenting direct flights as the entire page intent.

## Primary intent

Answer: “How can I fly from Bangkok to London, how do the viable options compare, and which option fits my priorities?”

Direct-flight availability is a fact and filter. It is not the default scope of the page.

## Selected approach

Use the City Hub discovery workspace pattern:

- a compact route hero;
- a persistent filter sidebar on desktop;
- a route map synchronized with the filters;
- a result count and flight-option list synchronized with the same filters;
- decision-support content only after the core comparison is satisfied.

Do not use the rejected editorial-first or OTA-only approaches. The editorial-first approach overemphasizes carriers and long-form copy. The OTA-only approach loses evergreen pSEO value and requires live availability that is outside current scope.

## Page structure

1. Shared TripWays header and breadcrumb.
2. Compact route hero.
3. Discovery workspace: filters, route map, result summary and flight options.
4. Evidence-backed recommendations.
5. Advertisement Slot A.
6. Route-specific practical planning.
7. Contextual sponsored services.
8. FAQ, reverse route, related routes and data provenance.
9. Shared footer.

## Hero

- Eyebrow: `CITY-PAIR ROUTE`.
- H1: `Flights from Bangkok to London`.
- Never prefix the default H1 with `Direct` or `Nonstop`.
- Use one concise sentence confirming that the page covers both nonstop and connecting options.
- Show origin city and airport set, destination city and airport set, and data freshness.
- Show four compact facts: nonstop availability, fastest practical duration, lowest eligible estimated one-way Economy fare and number of airport-pair options.
- Primary CTA scrolls to flight options. Secondary CTA focuses the airport-pair comparison.

## Discovery workspace

### Desktop layout

- Left column: sticky filter sidebar using the same visual grammar as the City Hub sidebar.
- Right column: route map above the result summary and option list.
- The sidebar begins level with the top of the map.
- The map and results remain visually part of one discovery surface.

### Filters

- Departure airport: All, BKK, DMK.
- Arrival airport: All and every eligible London airport.
- Stops: Any, Nonstop, 1 stop.
- Maximum total duration.
- Estimated one-way Economy price range.
- Departure-time band when coverage is sufficient.
- Sort: Recommended, Fastest, Lowest estimated fare, Fewest stops.

Do not include City Hub-only controls such as Domestic only, International only, Country/Region or broad destination search.

Every filter updates all three outputs together:

1. visible routes on the map;
2. result count and summary metrics;
3. option rows below the map.

## Route map

- Show origin airports, destination airports and eligible transit hubs.
- Use solid arcs for nonstop options and segmented arcs for connecting options.
- Selecting or hovering a route exposes airport pair, stop count, typical duration and estimated one-way fare.
- A text summary below the map reports visible options, nonstop options, one-stop options and the lowest eligible estimated fare.
- The map is not the sole source of any essential fact.

## Flight option list

Heading: `Flight options from Bangkok to London`.

Tabs: All options, Nonstop, 1 stop.

Each row or card contains:

- origin and destination airport pair;
- nonstop status or transit airport;
- airline as an itinerary attribute, not a standalone promotional card;
- typical total duration;
- weekly frequency when publishable;
- estimated one-way Economy fare with observation date;
- a contextual `View option` or `Compare live fares` action.

The list must include both nonstop and connecting options by default. Remove the standalone `Scheduled Nonstop Carriers` section and the separate airline-card gallery.

## Recommendations

Display recommendation chips or cards only when the backend provides the required evidence:

- Fastest option.
- Lowest estimated fare.
- Best airport access.
- Best duration-price balance.

Every recommendation exposes its comparison criterion. Hide the module when evidence is insufficient; never synthesize an unsupported “best” claim.

## Fare language

- Default to estimated one-way Economy fares.
- Attach the estimate to an option or airport pair rather than presenting only one route-wide range.
- Label observation date, currency and methodology.
- Never imply live availability.
- Use `Check live fares` only as an outbound affiliate action.

## Advertisement and affiliate placements

- Keep exactly one display placement: `Advertisement Slot A` after the primary option list and recommendations.
- Do not insert display ads between option rows.
- Place flight-search affiliate actions beside relevant options.
- Place airport-transfer offers after airport-access guidance.
- Place hotel offers after arrival guidance.
- Place eSIM and travel-insurance offers in one clearly labelled sponsored module.
- Keep organic recommendations and sponsored content visually distinct and include an affiliate disclosure.

## Practical planning

Keep this section route-specific and compact:

- getting to the selected Bangkok airport;
- getting from the selected London airport;
- connection considerations for the selected transit hub;
- time-zone difference;
- entry or transit requirement links to official sources.

Content changes with the selected airport pair or connection. Hide unavailable content instead of using generic filler.

## SEO and internal linking

- Default title and H1 target `{origin} to {destination} flights`, not direct-only queries.
- Treat direct/nonstop keywords as sub-intent content and filter landing behavior only when indexability rules allow it.
- Keep one H1.
- Include FAQ for nonstop and connecting journeys.
- Link to the reverse route, origin City Hub, destination City Hub, relevant Airport Hubs and eligible airport-pair routes.
- Expose data source, observed date, freshness and fare disclaimer.

## Responsive behavior

- Desktop uses the City Hub sidebar plus map/results layout.
- Mobile converts filters to a labelled drawer or sheet and keeps an always-visible result summary.
- Option cards preserve stop count, duration and estimated fare before secondary attributes.
- Map interaction must not block access to the equivalent result list.

## Data states

- No nonstop: retain the page and show connecting options; do not render an empty direct section.
- No connecting data: show verified nonstop options only and omit the connecting tab.
- No fare coverage: remove price filters, fare sorting and fare claims while preserving schedules.
- Stale data: show freshness warning and suppress unsupported recommendation claims.
- No useful route evidence: page is not indexable and should not render a thin comparison shell.

## Acceptance criteria

- The screen visually follows the City Hub sidebar, map and results hierarchy.
- The default H1 is `Flights from Bangkok to London`.
- Nonstop and connecting options are visible within the primary discovery flow.
- Filters update map, counts and results as one system.
- There is no standalone airline section.
- Every visible fare is explicitly estimated, one-way and Economy.
- Exactly one Advertisement Slot A exists.
- Sponsored modules are labelled and separated from organic content.
- The screen preserves existing Stitch screens and is created as a new revision.

## Verification

- Inspect the rendered Stitch DOM for one H1, one advertisement slot and the required headings.
- Visually verify the sidebar aligns with the map and that the result list is directly below it.
- Confirm that `Direct flights from Bangkok to London` is absent from the default H1.
- Confirm that `Scheduled Nonstop Carriers` is absent.
- Confirm that both `Nonstop` and `1 stop` appear in the main discovery controls or result list.
