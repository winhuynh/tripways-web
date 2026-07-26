import type { CityAirport } from "../domain/models";

/**
 * Renders the destination-search shell and airport-aware quick links for the
 * current city.
 */
export function CityRouteSearch({
  airports,
  cityName,
}: {
  airports: readonly CityAirport[];
  cityName: string;
}) {
  return (
    <section className="route-search section-card" id="route-search">
      <form action="#destinations" method="get">
        <label className="sr-only" htmlFor="destination">
          Search direct destinations from {cityName}
        </label>
        <span aria-hidden="true" className="route-search__icon">
          ⌕
        </span>
        <input
          id="destination"
          name="q"
          placeholder={`Where can you fly direct from ${cityName}?`}
          type="search"
        />
        <button type="submit">
          Find flights <span aria-hidden="true">→</span>
        </button>
      </form>
      <div className="quick-links">
        <span>Quick search</span>
        {airports.slice(0, 3).map((airport) => (
          <a href={`?airport=${airport.iata}#destinations`} key={airport.iata}>
            {airport.iata} departures
          </a>
        ))}
        <a href="?duration=180#destinations">Short-haul</a>
        <a href="?duration=360#destinations">Long-haul</a>
        <a href="#insights">Travel insights</a>
      </div>
    </section>
  );
}

/**
 * Renders URL-driven route filters from sanitized selected values and the
 * current destination result count.
 */
export function CityFilterToolbar({
  airports,
  selectedAirport = "",
  selectedDeparture = "",
  selectedDuration = "",
  total,
}: {
  airports: readonly CityAirport[];
  selectedAirport?: string;
  selectedDeparture?: string;
  selectedDuration?: string;
  total: number;
}) {
  return (
    <section aria-label="Route filters" className="filter-toolbar">
      <form action="#destinations" method="get">
        <label>
          <span className="sr-only">Airport</span>
          <select defaultValue={selectedAirport} name="airport">
            <option value="">All airports</option>
            {airports.map((airport) => (
              <option key={airport.iata} value={airport.iata}>
                {airport.iata}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Duration</span>
          <select defaultValue={selectedDuration} name="duration">
            <option value="">Any duration</option>
            <option value="180">Under 3 hours</option>
            <option value="360">Under 6 hours</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Departure</span>
          <select defaultValue={selectedDeparture} name="departure">
            <option value="">Any time</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </label>
        <button type="submit">Apply</button>
      </form>
      <p>
        <strong>{total}</strong> direct destinations
      </p>
    </section>
  );
}
