# Airport pSEO Page Design

## Goal

Add a responsive airport landing page for BKK, DMK, and SIN that matches the established Tripways
city-page visual language while prioritizing inbound/outbound direct routes, airlines, and concise
airport planning guidance.

## Routes

```text
/airports/suvarnabhumi-bkk
/airports/don-mueang-dmk
/airports/singapore-changi-sin
```

The final slug segment contains the IATA code. The application validates the slug, derives the IATA
identity, calls the airport RPC, and uses the RPC canonical path for metadata.

## Architecture

Create an independent `src/features/airport-page` vertical slice with domain models, query parsing,
repository contract, Edge/Supabase transport, DTO validation, server use cases, metadata, and
presentation components.

The feature reuses only existing shared site chrome and generic UI primitives. It does not import
city-page domain or application modules. Airport components remain local until a second real
consumer proves an identical shared contract.

Data flow:

```text
Next.js airport route
→ airport-page use cases
→ airport-page repository
→ backend airport RPC
→ validated domain model
→ airport presentation
```

The server page loads the airport shell. A thin same-origin route handler accepts URL-backed route
filters and calls the airport direct-route RPC. Client interaction owns only direction/filter URL
changes.

## Page structure

### Hero

Display IATA, airport name, city/country, reviewed subheadline, outbound destinations, inbound
origins, airline count, and route duration range. Keep the editorial navy/off-white composition
used by city pages without copying city-only airport-hub content.

### Route explorer

Place immediately after the hero. Include:

- outbound/inbound segmented links backed by the `direction` query parameter;
- airline, country, maximum-duration, and seasonality filters;
- route cards with counterpart airport/city/country, airlines, frequency when known, and duration;
- facets and bounded pagination;
- deterministic empty, unavailable, and invalid-filter states.

Filtered URLs canonicalize to the airport base path.

### Essentials

Render focused sections for:

- getting to/from the airport;
- parking overview;
- lounges;
- reviewed notices.

Unknown values remain absent or explicitly unknown. The UI never invents prices, hours, or
availability.

### Related content and FAQs

Render published internal-link groups and FAQs from the page payload. Do not create links to
unpublished targets.

## Visual design

- Reuse the city page's navy, blue, off-white, typography scale, borders, radius, and focus style.
- Give the IATA code strong editorial prominence in the hero.
- Make route discovery the dominant section.
- Use compact cards for access, parking, and lounges so the page does not resemble an official
  airport directory.
- Use a warm accent for durable notices without presenting them as live operational alerts.
- On mobile, use one-column cards and stacked filters; keep controls keyboard accessible and avoid
  horizontal overflow.

## Error and loading states

- Invalid or missing airport pages return Next.js `notFound()`.
- Transport or malformed payload failures render an honest unavailable state without leaking raw
  provider/database errors.
- Route-filter failures do not remove the airport overview or essential guidance.
- Loading UI preserves the hero and route-section layout to limit layout shift.

## Testing

- Domain/query tests cover slug-to-IATA parsing and normalized URL filters.
- DTO tests accept valid page/search envelopes and reject malformed boundaries.
- Repository tests verify RPC names, payloads, and error normalization.
- Presentation tests verify BKK/DMK/SIN content, direction links, accessible labels, empty states,
  and metadata.
- Architecture tests keep server loading outside client components.
- Browser verification covers desktop and mobile layouts, focus navigation, overflow, and console
  errors for all three preview URLs.

## Exclusions

- Terminal maps and detailed terminal/service directories.
- Live departures, arrivals, fares, or availability.
- Booking, authentication, CMS, newsletter persistence, or deployment.
- A generic pSEO page framework or shared repository abstraction.
