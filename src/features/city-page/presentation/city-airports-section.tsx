import type { CityAirport } from "../domain/models";

export function CityAirportsSection({
  airportSummary,
  airports,
}: {
  airportSummary: string;
  airports: readonly CityAirport[];
}) {
  return (
    <section className="highlight-section" id="airports">
      <div className="section-heading section-heading--center">
        <div>
          <p className="eyebrow">Choose your departure airport</p>
          <h2>Direct flight hubs</h2>
          <p>{airportSummary}</p>
        </div>
      </div>
      <div className="airport-grid">
        {airports.map((airport) => (
          <article className="airport-card" key={airport.iata}>
            <div className="airport-card__heading">
              <div>
                <p>{airport.name}</p>
                <h3>{airport.iata}</h3>
              </div>
              <span>{airport.hubLabel ?? (airport.isPrimary ? "Primary hub" : "City hub")}</span>
            </div>
            <dl className="airport-card__facts">
              <div>
                <dt>Destinations</dt>
                <dd>
                  {airport.directDestinationCount}{" "}
                  {pluralize(airport.directDestinationCount, "destination")}
                </dd>
              </div>
              <div>
                <dt>Airlines</dt>
                <dd>
                  {airport.airlineCount} {pluralize(airport.airlineCount, "airline")}
                </dd>
              </div>
              <div>
                <dt>Network</dt>
                <dd>{networkShare(airport)}</dd>
              </div>
              <div>
                <dt>Carrier type</dt>
                <dd>{formatBusinessModel(airport.dominantAirlineBusinessModel)}</dd>
              </div>
            </dl>
            {airport.description ? (
              <p className="airport-card__description">{airport.description}</p>
            ) : null}
            <a className="primary-button" href={airport.pagePath}>
              View {airport.iata} departures
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function networkShare(airport: CityAirport): string {
  if (airport.domesticDestinationPercentage > airport.internationalDestinationPercentage) {
    return `${airport.domesticDestinationPercentage}% domestic`;
  }
  return `${airport.internationalDestinationPercentage}% international`;
}

function formatBusinessModel(value: string): string {
  return value
    .split("_")
    .map((part, index) =>
      index === 0 ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part,
    )
    .join(" ");
}

function pluralize(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`;
}
