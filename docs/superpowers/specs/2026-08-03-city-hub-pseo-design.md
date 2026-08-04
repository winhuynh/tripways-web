# City Hub pSEO Page Design

## Goal

Make the City Hub a complete entity page for users who want to understand a city's flight network and discover every direct flight from that city. The page should combine useful city-airport information, route discovery, and clear navigation to Route Pages.

## Page hierarchy

1. Header and breadcrumb
2. Hero: "Direct flights from Bangkok"
3. City Flight Snapshot
4. Route Finder
5. Interactive Route Map
6. Popular Direct Flights table showing 10–20 routes
7. "View all direct flights" expansion on the same page
8. Airports serving Bangkok
9. Airlines flying from Bangkok
10. Bangkok Flight Network Insights
11. Ground transport and airport access
12. Other departure cities in Thailand
13. FAQ
14. Related links, data disclaimer, and footer

## City Flight Snapshot

Show:

- Direct destinations
- Countries served
- Airlines operating
- Domestic routes
- International routes
- Airports serving the city
- Shortest direct flight
- Longest direct flight
- Most frequent route
- Lowest estimated return fare
- Last verified date

Mobile may show the five most important metrics first and reveal the remaining facts through "View all network facts".

## Direct-flight table

Replace the existing destination cards with a clickable data table. Each row contains:

- Destination city
- Destination airport and IATA code
- Departure airport: BKK, DMK, or both
- Country or region
- Airlines
- Direct-flight duration
- Weekly frequency
- Estimated return price range
- "View route" CTA

Clicking a row or its CTA navigates to the corresponding Route Page. Show 10–20 routes initially. "View all direct flights" expands the complete route list without leaving the City Hub.

## Filters and map synchronization

Use shared filter state across the table and map:

- Destination search
- Departure airport
- Country or region
- Domestic or international
- Airline
- Flight duration
- Estimated price range
- Weekly frequency

Selecting a map destination opens a preview with duration, airlines, estimated return price range, and a Route Page CTA.

## Price presentation

Display price as an estimated range, for example: "Estimated return fare: £180–£260".

Every price module must include a concise qualification: "Estimated fare range based on recently observed economy fares. Prices vary by dates, availability and booking provider."

Do not present estimated prices as live or guaranteed fares.

## Content principles

- Do not include historical flight data.
- Do not include year-round or seasonal route fields or filters.
- Prioritize current network facts and information that helps users understand the city as a departure hub.
- Keep city editorial content relevant to flight decisions: airport comparison, access, airline network, and alternative departure cities.
- Preserve the existing TripWays visual system and desktop/mobile parity.

## Acceptance criteria

- Existing destination cards are replaced by a clickable direct-flight table.
- Table and map share the same filters.
- Estimated price ranges appear in the snapshot, table, filter, and map preview.
- The page contains no historical or seasonality module.
- Both desktop and mobile contain the same information architecture.
- Existing Airport Hub and Homepage screens remain unchanged.
