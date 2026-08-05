# Airport Journey pSEO Page Design

## 1. Purpose

The Airport Page is an independent, practical guide for travellers who already know which airport they will use. It helps them:

- arrive at the airport and continue to the city or another destination;
- depart from the airport with the correct terminal, transport, parking, and process context;
- understand terminal transfers, pickup, drop-off, car rental, and useful facilities;
- view verified direct flights both from and to the airport.

The page is not primarily a flight-discovery page. City Hub owns broad city-level flight discovery such as `flights from Bangkok`. Airport Page owns airport-specific journey intent such as `arriving at Suvarnabhumi Airport`, `BKK airport to Bangkok`, and `parking at BKK`.

### Product statement

> An independent guide to arriving at, departing from, and getting around an airport, with verified direct flights to and from that airport.

### Content balance

- 55–60% arrival and departure guidance.
- 20–25% transport, transfer, car rental, pickup, drop-off, and parking.
- 10–15% airport orientation, facilities, and FAQs.
- 10–15% verified direct flights from and to the airport.

## 2. Non-goals

- Live arrivals, departures, gates, delays, queues, or operational alerts.
- A complete airport directory of every shop, restaurant, and service.
- Booking flights directly on the Airport Page.
- Generating routes by joining multiple flight legs.
- Giving itinerary-specific visa, immigration, customs, security, or legal advice.
- Maintaining exact transport or parking prices without a reliable review process.
- Creating thin URLs for every keyword variation or UI filter state.

## 3. Route and ownership

Canonical route:

```text
/airports/[airport-slug]
```

Examples:

```text
/airports/suvarnabhumi-bkk
/airports/don-mueang-dmk
/airports/singapore-changi-sin
```

The backend supplies the canonical path. The frontend validates the requested slug and redirects or returns `notFound()` according to the canonical identity rules.

Arrival/departure navigation and flight direction may use query parameters for interaction:

```text
/airports/suvarnabhumi-bkk?journey=arriving
/airports/suvarnabhumi-bkk?journey=departing
/airports/suvarnabhumi-bkk?flights=from
/airports/suvarnabhumi-bkk?flights=to
```

These states canonicalise to the base airport URL. They are not separate sitemap entries.

## 4. Search intent and keyword ownership

### Primary page intent

> I am using this airport and need to know what to expect, what to do, and how to continue my journey.

Primary patterns:

- `[airport name] airport guide`
- `[IATA] airport guide`
- `[airport name] airport information`
- `[airport name] arrivals and departures guide`
- `what to know about [airport name]`

Recommended metadata:

```text
Title: [Airport Name] ([IATA]) Guide: Arrivals, Departures & Transport
H1: [Airport Name] ([IATA]) Airport Guide
Description: Plan your arrival or departure at [Airport Name]. Compare transport, estimated costs, parking, terminal transfers, facilities, and verified direct flights to and from [IATA].
```

### Journey clusters

Arrival:

- `arriving at [airport]`
- `[airport] arrival guide`
- `what to do after landing at [airport]`
- `[airport] arrival process step by step`
- `[airport] baggage claim`
- `[airport] immigration on arrival`
- `[airport] customs process`
- `[airport] arrivals pickup point`
- `late night arrival at [airport]`

Departure:

- `departing from [airport]`
- `[airport] departure guide`
- `[airport] departure process step by step`
- `how early should I arrive at [airport]`
- `[airport] check in and bag drop`
- `[airport] security process`
- `[airport] departures drop off`
- `[airport] early morning flight`

Transport and commercial intent:

- `[airport] to [city centre]`
- `best way from [airport] to [city]`
- `cheapest way from [airport] to [city]`
- `fastest way from [airport] to [city]`
- `[airport] train/bus/taxi to city`
- `[airport] transport after midnight`
- `private transfer from [airport]`
- `car rental at [airport]`
- `[airport] parking`
- `[airport] pickup and drop-off`

Airport experience:

- `[airport] terminals`
- `[airport] terminal transfer`
- `connecting at [airport]`
- `[airport] wifi/lounges/showers/luggage storage`
- `[airport] accessible travel`

Verified flights:

- `direct flights from [airport]`
- `where can I fly direct from [IATA]`
- `direct flights to [airport]`
- `which cities fly direct to [IATA]`
- `airlines flying to/from [airport]`

Airport Page targets one physical airport. City Hub targets all airports serving a city and remains the main route-discovery surface.

## 5. Page layout and content

### 5.1 Site header

Use the shared Tripways navigation. The Airport Page must not introduce airport-only global navigation.

### 5.2 Airport identity hero

Purpose: confirm that the traveller is viewing the correct airport and expose the two main journeys.

Content:

- Country and served city breadcrumb.
- IATA code as the strongest visual identity.
- Full airport name.
- Concise airport role and location context.
- Distance and direction from the primary city area when sourced.
- Terminal count when meaningful.
- `Last reviewed` date.
- Primary controls: `Arriving` and `Departing`.

The hero must not contain a flight search form, route map, direct-flight table, or large route counts.

Desktop layout:

- Left: identity, H1, introduction, reviewed date.
- Right: compact orientation facts and the Arriving/Departing selector.

Mobile layout:

- One column.
- IATA and H1 first.
- Full-width Arriving/Departing controls.
- Facts shown as a compact two-column grid.

### 5.3 Sticky section navigation

Provide anchor navigation after the hero:

```text
Overview | Arriving | Transport | Departing | Parking & cars | Terminals | Facilities | Direct flights | FAQs
```

Only show anchors for rendered sections. On mobile, use a horizontally scrollable but keyboard-accessible navigation row with visible focus states.

### 5.4 Quick answers

Purpose: resolve common decisions without requiring a long read.

Possible facts:

- Best default transport option to the primary city area.
- Typical journey-time range.
- Estimated price range.
- Distance to the primary city area.
- Number of terminals.
- Overnight-operation summary when sourced.

Each answer links to its detailed section. `Best`, `fastest`, or `cheapest` may only be used when Tripways has compared all material options with sufficiently current sources.

### 5.5 Arriving at the airport

Purpose: explain the journey from aircraft to landside without pretending every passenger follows the same legal process.

Recommended sequence:

1. Follow arrival or connection signs.
2. Complete immigration when applicable.
3. Collect checked baggage.
4. Complete customs when applicable.
5. Enter the arrivals hall.
6. Continue by public transport, pickup, transfer, taxi, or rental car.

Content rules:

- Split domestic and international flows only where they materially differ.
- Explain exceptions and decision factors instead of absolute instructions.
- Do not publish live or guaranteed immigration wait times.
- Link official immigration and customs guidance.
- Show baggage, SIM, currency, pickup, or late-night information only when maintained.

Contextual commercial actions:

- Compare airport transfers.
- Compare car rental.
- View late-night transport.

Commercial content must follow the useful answer and must not interrupt safety or legal guidance.

### 5.6 Airport-to-city transport

Purpose: help the traveller choose the right ground journey after arrival.

Begin with a comparison table:

| Option | Typical time | Estimated price | Operating window | Best for | Pickup point |
|---|---:|---:|---|---|---|
| Rail/metro | Range | Range | Summary | Predictable journey | Location summary |
| Bus | Range | Range | Summary | Budget | Location summary |
| Taxi/rideshare | Range | Range | Summary | Groups/luggage | Location summary |
| Private transfer | Range | Range | By booking | Door-to-door certainty | Meeting method |
| Rental car | Variable | Range | Desk summary | Trips beyond the city | Desk/lot summary |

Each transport option includes:

- type and name;
- origin and primary destination label;
- typical duration range;
- estimated price range and currency;
- operating-hours summary;
- pickup location summary;
- ticket or booking method;
- luggage and accessibility notes when known;
- official or approved source;
- last verified date.

Recommendation summaries may identify:

- best for most travellers;
- lowest-cost practical option;
- most predictable journey;
- best for late-night arrival;
- best for groups, luggage, children, or reduced mobility.

Hide unsupported recommendations. Prices and durations are estimates, never live quotes.

### 5.7 Departing from the airport

Purpose: help travellers plan the ground journey and airport process before their flight.

Content order:

1. Confirm airport and departure terminal.
2. Choose transport to the airport.
3. Use drop-off or parking.
4. Complete check-in and bag drop.
5. Complete security and departure immigration when applicable.
6. Allow time to reach the gate.

The `How early should I arrive?` answer must:

- cite official airport or airline guidance;
- distinguish domestic and international guidance when sourced;
- explain that airline deadlines and passenger circumstances differ;
- tell readers to confirm with the operating airline;
- avoid any guarantee that a given buffer is sufficient.

Contextual commercial actions:

- Compare transfers to the airport.
- Reserve parking.
- Explore lounge access.

### 5.8 Verified direct flights

Place this supporting utility immediately after the Departing section. This gives verified flights meaningful visibility without allowing flight discovery to dominate the hero, arrival guidance, ground transport, or departure planning.

Heading:

> Verified direct flights to and from [Airport Name]

Modes:

- `From [IATA]`: confirmed nonstop destinations where the selected airport is the operating origin.
- `To [IATA]`: confirmed nonstop origins where the selected airport is the operating destination.

Use one compact horizontal filter bar rather than a City Hub-style sidebar:

```text
[From IATA | To IATA] [Search city or airport] [All | Domestic | International] [Airline] [Region or country]
```

Filter rules:

- `From/To` is required and always exposes the current state.
- Search matches the counterpart city, airport name, or IATA.
- Domestic/International is available only when the classification is reliable.
- Airline filters use eligible operating airlines; marketing airlines do not silently qualify a route.
- Region or country uses the counterpart airport geography.
- Seasonality may be added only when the source provides a trustworthy operating period.
- Do not add estimated fare, maximum duration, connecting-flight, or complex multi-select filters.
- Do not add a filter sidebar or route map.
- Filtered states are URL-backed and canonicalise to the base airport page.
- Results and facets come from the same eligible direct-route relation.

Show six to ten initial results in a bounded editorial table or accessible mobile cards. Use `Show more verified routes` or link to the relevant City Hub rather than recreating the complete City Hub explorer.

Result content:

- counterpart city and airport;
- IATA and country;
- operating airline or airlines;
- duration when sourced;
- frequency when known;
- operating period or seasonality when known;
- route-data refresh date;
- link to a published Route Page or City Hub.

Data rules:

- Use licensed route or schedule records that represent an actual operated nonstop service.
- Never create a route by joining flight legs or applying a graph connection algorithm.
- Keep operating and marketing airlines distinct.
- Do not convert missing frequency to zero.
- Do not default missing seasonality to `year-round`.
- Expired, historical, unverified, or rights-restricted records are not shown as current routes.
- When no confirmed route is available, describe the dataset limitation rather than claiming no flight exists.

The section answers which verified direct services use this physical airport. Broader discovery across every airport serving the city remains owned by City Hub.

### 5.9 Parking, pickup, drop-off, and car rental

Render these as distinct task panels within one section.

Parking:

- short-stay and long-stay types;
- terminal proximity or shuttle model;
- reservation availability;
- estimated price band when maintained;
- suitable use case;
- official booking link;
- last verified date.

Pickup and drop-off:

- permitted zone summary;
- waiting restrictions;
- terminal-specific exceptions;
- official source.

Car rental:

- on-airport desk or shuttle model;
- pickup and return summary;
- after-hours caveat;
- approved partners or official operator list;
- clearly labelled sponsored placements.

Do not reproduce large exact parking-fee tables unless there is an automated and reliable source.

### 5.10 Terminals and connections

Purpose: provide enough orientation to make the airport journey understandable.

Content:

- terminal names and broad purpose;
- broad airline allocation only when sourced;
- landside and airside transfer options;
- transfer-time range when officially available;
- whether security, immigration, baggage collection, or re-check may apply;
- airport-confusion notice, such as BKK versus DMK.

Connection guidance must explain that the process depends on the airline, ticket, baggage, citizenship, origin/destination, and terminal. Tripways must not calculate a guaranteed minimum connection time.

### 5.11 Facilities that solve traveller problems

Prioritise practical facilities:

- Wi-Fi and charging.
- Luggage storage.
- Showers and rest areas.
- Late or early food availability.
- Family facilities.
- Accessibility and assistance.
- Lounges.
- Airport hotels.

Do not create a complete directory. Hide a facility when location, access conditions, source, or verification status is missing.

### 5.12 Airport-specific FAQs

Select six to ten questions supported by the page data. Do not render the same FAQ set on every airport page.

Priority:

1. Best way to or from the city.
2. Arrival process.
3. Departure process and how early to arrive.
4. Terminal transfer.
5. Late-night transport.
6. Pickup, drop-off, or parking.
7. Connection caveats.
8. Airport confusion.
9. A facility with demonstrated demand.
10. Verified flights from or to the airport.

### 5.13 Trust and provenance

End the editorial content with:

- last editorial review date;
- route-data refresh date;
- official airport, immigration, transport, and parking sources;
- explanation that times and prices are estimates;
- reminder to verify flight-specific instructions with the operating airline;
- explanation of sponsored links where applicable.

### 5.14 Related content and footer

Internal links may include:

- the served City Hub;
- published Route Pages;
- nearby or alternative airports;
- airport-to-airport transfer guides;
- destination guides where available.

Never render links to unpublished pages.

## 6. Responsive and interaction design

### Desktop

- Editorial reading column with a wider comparison area for tables.
- Hero uses a two-column composition.
- Journey selector remains prominent but does not hide content from the document.
- Transport comparisons and verified flights may use tables when scannability is better than cards.
- Contextual affiliate cards stay visually subordinate to the answer.

### Mobile

- Single-column reading flow.
- Arriving/Departing selector uses full-width controls.
- Wide comparison tables become accessible stacked comparison cards or controlled horizontal regions with clear affordance.
- Sticky navigation must not cover anchored headings.
- No essential information appears only on hover.
- Controls meet touch-target, keyboard, visible-focus, and screen-reader requirements.

### Progressive enhancement

All primary content is server-rendered and readable without client JavaScript. Client components may own:

- journey-tab state and anchor scrolling;
- expanding comparisons or FAQs;
- flight direction and filter interaction;
- lightweight analytics events.

URL-backed states remain shareable and recoverable.

## 7. Backend design

### 7.1 Responsibility

The backend is the source of truth for:

- airport identity and canonical path;
- publishability and content completeness;
- reviewed editorial facts and sources;
- transport, parking, terminal, facility, and process records;
- confirmed nonstop route eligibility;
- route ranking, facets, and bounded pagination;
- data version and verification timestamps.

The frontend must not infer missing facts, derive route connectivity, or decide that unknown means false or zero.

### 7.2 Read model boundary

Expose an Airport Page read model optimised for rendering. Keep raw provider payloads and database rows behind backend adapters.

Suggested envelope:

```ts
type AirportPageResponse = Readonly<{
  data: AirportPageModel | null;
  error: Readonly<{ code: string; message?: string }> | null;
}>;
```

Core model:

```ts
type AirportPageModel = Readonly<{
  meta: AirportPageMeta;
  airport: AirportIdentity;
  content: AirportEditorialContent;
  quickAnswers: readonly QuickAnswer[];
  arrival: JourneyGuide | null;
  departure: JourneyGuide | null;
  transport: readonly TransportOption[];
  parking: readonly ParkingOption[];
  pickupDropoff: PickupDropoffGuide | null;
  carRental: CarRentalGuide | null;
  terminals: readonly TerminalGuide[];
  connections: ConnectionGuide | null;
  facilities: readonly Facility[];
  faqs: readonly AirportFaq[];
  relatedLinks: readonly RelatedLinkGroup[];
  provenance: PageProvenance;
}>;
```

Every volatile item supports:

```ts
type SourcedFact = Readonly<{
  sourceUrl: string;
  sourceName: string;
  lastVerifiedAt: string;
  validUntil?: string | null;
  confidence?: "official" | "partner" | "editorially_reviewed";
}>;
```

Prices and durations use ranges:

```ts
type EstimateRange = Readonly<{
  min: number | null;
  max: number | null;
  unit: "minute" | "currency";
  currency?: string | null;
  qualifier?: string | null;
}>;
```

Unknown values remain `null`; they must not be coerced to `0`, `false`, or an editorial conclusion.

### 7.3 Journey content model

Arrival and departure content should use reviewed structured steps, not one large generated HTML field:

```ts
type JourneyGuide = Readonly<{
  summary: string;
  domesticSteps: readonly JourneyStep[];
  internationalSteps: readonly JourneyStep[];
  exceptions: readonly JourneyException[];
  officialLinks: readonly OfficialLink[];
  lastReviewedAt: string;
}>;
```

This allows the frontend to render sequences accessibly while content editors retain control of caveats and sources.

### 7.4 Verified route model

The flight repository must query confirmed direct operations independently of the editorial page payload.

```ts
type AirportFlightQuery = Readonly<{
  airportIata: string;
  direction: "from" | "to";
  airlines?: readonly string[];
  countries?: readonly string[];
  seasonality?: readonly string[];
  limit: number;
  cursor?: string;
}>;
```

Eligibility requires an approved source record with:

- origin airport;
- destination airport;
- nonstop/direct classification;
- operating airline when available under the source contract;
- a current or eligible operating period;
- production and SEO usage rights;
- route-data version.

The query is a direct relation filter:

- `from`: `origin_airport_id = selected_airport_id`;
- `to`: `destination_airport_id = selected_airport_id`.

It must not run route discovery, graph traversal, connection search, or join two flight legs.

Suggested result:

```ts
type AirportFlightResult = Readonly<{
  direction: "from" | "to";
  routes: readonly VerifiedAirportRoute[];
  total: number;
  nextCursor: string | null;
  facets: AirportFlightFacets;
  dataVersion: string;
  refreshedAt: string;
}>;
```

### 7.5 Publishability

An airport page is indexable only when it has enough unique journey utility.

Minimum recommended package:

- verified airport identity and canonical path;
- unique reviewed overview;
- useful arrival guidance;
- useful departure guidance;
- at least two sourced transport options, or a reviewed explanation where fewer exist;
- at least one airport-specific section such as parking, terminals, connections, or facilities;
- airport-specific FAQs;
- provenance and review metadata.

Verified flight data improves the page but does not compensate for a thin airport guide.

Backend publishability states:

```text
draft → review_required → publishable → stale → archived
```

`stale` content may remain visible with careful fallbacks but should be excluded from automated expansion until reviewed. Safety-critical or materially misleading stale facts must be hidden.

### 7.6 API/RPC operations

Required server operations:

1. Get airport journey page by slug or IATA.
2. Get verified direct routes by airport and direction.
3. Get route facets derived from the same eligible relation as the results.

The backend returns stable public error codes:

- `ERR_AIRPORT_NOT_FOUND`
- `ERR_AIRPORT_NOT_PUBLISHABLE`
- `ERR_AIRPORT_PAGE_UNAVAILABLE`
- `ERR_AIRPORT_FLIGHTS_UNAVAILABLE`
- `ERR_INVALID_AIRPORT_FILTER`

Do not leak database, provider, stack, or secret information.

### 7.7 Caching and refresh

- Cache the editorial page by airport identity and editorial version.
- Cache verified flights by airport, direction, normalized filters, cursor, and route-data version.
- Editorial review and route-data refresh have separate timestamps.
- Invalidation must be possible per airport.
- Never label cached schedule data as live.

## 8. Frontend architecture

Create or restore an independent `src/features/airport-page` vertical slice:

```text
src/features/airport-page/
  domain/
    models.ts
    errors.ts
  application/
    get-airport-page.ts
    get-airport-flights.ts
    airport-page-repository.ts
    airport-flight-repository.ts
  infrastructure/
    airport-page-response.dto.ts
    airport-flight-response.dto.ts
    edge-airport-page-repository.ts
    edge-airport-flight-repository.ts
  presentation/
    airport-page.tsx
    airport-hero.tsx
    airport-section-nav.tsx
    airport-quick-answers.tsx
    airport-journey-guide.tsx
    airport-transport-comparison.tsx
    airport-parking-and-cars.tsx
    airport-terminals.tsx
    airport-facilities.tsx
    airport-flights.tsx
    airport-faqs.tsx
    airport-provenance.tsx
    airport-page-metadata.ts
```

Boundaries:

- Server Components load and render the airport read model.
- Client Components own only browser interaction and navigation.
- Infrastructure validates every external envelope before it reaches presentation.
- Airport Page does not import City Hub domain or application modules.
- Shared UI is limited to proven generic primitives and site chrome.
- Supabase service-role credentials remain server-only.

### Route composition

```text
Next.js airport route
→ parse and validate slug/query
→ get Airport Page model
→ render server-side journey content
→ load verified flight results for selected direction
→ hydrate only interactive controls
```

The page route must use the canonical path from the validated model for metadata and links.

### Component behaviour

- `AirportHero`: identity and journey selection only.
- `AirportSectionNav`: derives links from sections actually present.
- `AirportJourneyGuide`: renders reviewed domestic/international steps and caveats.
- `AirportTransportComparison`: uses semantic table markup on wide layouts and an accessible mobile representation.
- `AirportFlights`: appears immediately after Departing and owns `from/to`, counterpart search, domestic/international, operating-airline, and region/country filters without becoming the page hero or duplicating City Hub.
- `AirportProvenance`: visibly distinguishes editorial review from route refresh.

## 9. SEO and structured data

- One canonical URL per airport guide.
- Filtered and tab states canonicalise to the base airport path.
- Sitemap includes only publishable canonical airport pages.
- Metadata comes from validated backend fields and uses airport name plus IATA.
- Internal links are emitted only for published targets.
- Breadcrumb structured data may describe Home → Country/City → Airport.
- FAQ structured data is emitted only when the exact FAQ is visible and eligible under current search-engine rules.
- Do not use structured data to compensate for thin, duplicated, or automatically generated content.
- Images need airport-specific descriptive alt text and known dimensions.
- Do not change the displayed review date unless content was actually reviewed.

## 10. Advertising and affiliate rules

- Affiliate placement must be contextual to the current task.
- Transfer and car-rental offers belong after transport guidance.
- Parking offers belong in the departure or parking section.
- Lounge offers belong in the facilities or departure section.
- Sponsored results are labelled clearly.
- Editorial ordering must not silently depend on affiliate payout.
- Ads must not mimic immigration, security, airport, or airline instructions.
- The guide remains useful without clicking a commercial offer.

## 11. Empty, error, and stale states

- Unknown airport or non-publishable page returns `notFound()`.
- Malformed payload renders a safe unavailable state without raw provider details.
- A verified-flight failure does not remove the airport journey guide.
- Missing optional data hides the corresponding section or field.
- No filtered flight result suggests broadening filters and explains dataset scope.
- Stale estimates show their last verified date or are hidden according to backend policy.
- Loading UI preserves major page geometry to reduce layout shift.

## 12. Accessibility requirements

- Semantic heading order and landmark structure.
- Arrival/departure and from/to controls expose current state.
- All tabs remain operable with keyboard and are represented by URL state.
- Tables use captions and header associations.
- Mobile comparison alternatives preserve the same information relationships.
- Details/FAQ controls expose expanded state.
- Focus is visible and not obscured by sticky navigation.
- Status changes and filtered result counts are announced where appropriate.
- Colour is never the only indicator of direction, availability, sponsorship, or warnings.

## 13. Testing

### Domain and application

- Slug and IATA normalization.
- Journey and flight query parsing.
- Direction defaults and canonicalization.
- Nullable estimate handling.
- Publishability states.
- Direct-route eligibility rejects inferred, expired, restricted, or connecting records.
- `from` queries only origin relation; `to` queries only destination relation.

### DTO and repository

- Accept complete valid envelopes.
- Accept valid nullable optional data.
- Reject malformed nested content, timestamps, sources, and estimates.
- Verify RPC/Edge operation names and normalized payloads.
- Normalize stable public errors.
- Verify route facets and results use the same eligible relation.

### Presentation

- Hero prioritises identity and Arriving/Departing.
- Flight search is absent from the hero.
- Optional sections are omitted cleanly.
- Price and time are labelled as estimates.
- `From [IATA]` and `To [IATA]` expose correct states and links.
- The lightweight flight filters produce URL-backed states and never expose fare, duration, connection, map, or City Hub-style sidebar controls.
- Route refresh and editorial review dates are distinct.
- No unpublished internal link is rendered.
- Sponsored content is labelled.

### Browser verification

- Desktop and mobile layouts for airports with different data completeness.
- Keyboard-only navigation and focus visibility.
- Screen-reader names for journey and flight direction controls.
- No horizontal page overflow.
- Table or comparison-card equivalence.
- URL state restoration and canonical metadata.
- No client console errors.
- Journey content remains available if the verified-flight request fails.

## 14. Acceptance criteria

The redesign is accepted when:

1. The hero communicates Airport Guide intent rather than Flight Finder intent.
2. Arriving and Departing are the two primary user journeys.
3. Transport comparison supports time, estimated price, operating window, pickup point, and suitability.
4. Parking, pickup/drop-off, car rental, terminals, connections, and facilities render only when sourced.
5. The flight section supports both `From [IATA]` and `To [IATA]`.
6. The flight section appears immediately after Departing and before parking, terminals, and facilities.
7. Flight filtering is limited to counterpart search, domestic/international, operating airline, and region/country, with seasonality only when trustworthy.
8. Every displayed flight is backed by an eligible direct operating record; no connected route is inferred.
9. City Hub and Airport Page do not compete for the same primary flight-discovery intent.
10. Editorial review and route-data refresh are independently visible.
11. The page is useful without live operational data or affiliate clicks.
12. Indexable pages meet the minimum unique-content package.

## 15. Delivery sequence

1. Finalise backend content and verified-route contracts.
2. Implement DTO validation and repository tests.
3. Build the server-rendered Airport Page shell and metadata.
4. Implement hero, quick answers, arrival, transport, and departure sections.
5. Implement verified flights with `from/to` direction and the approved lightweight filter bar.
6. Implement parking/cars, terminals/connections, and facilities.
7. Add FAQs, provenance, internal links, and contextual commercial placements.
8. Complete responsive, accessibility, SEO, and failure-state verification.
