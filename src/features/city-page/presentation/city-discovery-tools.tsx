import type { CityAirport, CityDestination } from "../domain/models";

export function CityRouteSearch({ cityName }: { cityName: string }) {
  return (
    <section className="route-search section-card" id="route-search">
      <p className="eyebrow">Where do you want to fly direct?</p>
      <form action="#destinations" method="get">
        <label className="sr-only" htmlFor="destination">
          Search direct destinations from {cityName}
        </label>
        <input
          id="destination"
          name="q"
          placeholder={`Where can you fly direct from ${cityName}?`}
          type="search"
        />
        <button type="submit">Find direct flights</button>
      </form>
      <div className="quick-links">
        <a href="?airport=BKK#destinations">BKK departures</a>
        <a href="?airport=DMK#destinations">DMK departures</a>
        <a href="#insights">Travel insights</a>
      </div>
    </section>
  );
}

export function CityRouteMap({
  airports,
  destinations,
}: {
  airports: readonly CityAirport[];
  destinations: readonly CityDestination[];
}) {
  return (
    <section aria-label="Direct route map" className="draft-map">
      <div className="map-grid" aria-hidden="true" />
      <div className="map-copy">
        <strong>{airports.map((airport) => airport.iata).join(" + ")} direct network</strong>
        <span>{destinations.length} featured routes shown</span>
      </div>
      <span className="map-origin">Bangkok</span>
      <span className="map-destination map-destination--one">Europe</span>
      <span className="map-destination map-destination--two">East Asia</span>
      <span className="map-destination map-destination--three">Oceania</span>
    </section>
  );
}

export function CityFilterToolbar({
  airports,
  total,
}: {
  airports: readonly CityAirport[];
  total: number;
}) {
  return (
    <section aria-label="Route filters" className="filter-toolbar">
      <form action="#destinations" method="get">
        <label>
          <span>Airport</span>
          <select defaultValue="" name="airport">
            <option value="">All airports</option>
            {airports.map((airport) => (
              <option key={airport.iata} value={airport.iata}>
                {airport.iata}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Duration</span>
          <select defaultValue="" name="duration">
            <option value="">Any duration</option>
            <option value="180">Under 3 hours</option>
            <option value="360">Under 6 hours</option>
          </select>
        </label>
        <label>
          <span>Departure</span>
          <select defaultValue="" name="departure">
            <option value="">Any time</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </label>
        <button type="submit">Apply filters</button>
      </form>
      <strong>{total} direct destinations</strong>
    </section>
  );
}
