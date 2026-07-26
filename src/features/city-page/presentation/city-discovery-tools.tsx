import type { CityAirport } from "../domain/models";

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
          <span>Airport</span>
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
          <span>Duration</span>
          <select defaultValue={selectedDuration} name="duration">
            <option value="">Any duration</option>
            <option value="180">Under 3 hours</option>
            <option value="360">Under 6 hours</option>
          </select>
        </label>
        <label>
          <span>Departure</span>
          <select defaultValue={selectedDeparture} name="departure">
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
