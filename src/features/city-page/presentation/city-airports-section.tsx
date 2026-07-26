import Image from "next/image";

import type { CityAirport } from "../domain/models";

/**
 * Presents airport-level route statistics and reviewed hub copy for the
 * current City Hub.
 */
export function CityAirportsSection({
  airportSummary,
  airports,
  cityName,
}: {
  airportSummary: string;
  airports: readonly CityAirport[];
  cityName: string;
}) {
  const leadingNetworkShare = Math.max(
    ...airports.map((airport) => airport.internationalDestinationPercentage),
    0,
  );

  return (
    <section
      aria-label={`${cityName} airport operations`}
      className="highlight-section airport-operations"
      id="airports"
    >
      <div className="airport-operations__content">
        <div className="airport-operations__story">
          <p className="eyebrow">Airport operations</p>
          <h2>
            {airports.length > 1 ? "The Dual Airport" : "The Airport"}
            <br />
            Operations
          </h2>
          <p className="airport-operations__summary">{airportSummary}</p>
          <div className="airport-grid">
            {airports.map((airport) => (
              <article className="airport-card" key={airport.iata}>
                <div className="airport-card__heading">
                  <div>
                    <h3>{airport.iata}</h3>
                    <p>{shortAirportName(airport.name)}</p>
                  </div>
                  <span>
                    {airport.hubLabel ??
                      (airport.isPrimary ? "Primary hub" : "City hub")}
                  </span>
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
                      {airport.airlineCount}{" "}
                      {pluralize(airport.airlineCount, "airline")}
                    </dd>
                  </div>
                  <div>
                    <dt>Network</dt>
                    <dd>{networkShare(airport)}</dd>
                  </div>
                  <div>
                    <dt>Carrier type</dt>
                    <dd>
                      {formatBusinessModel(airport.dominantAirlineBusinessModel)}
                    </dd>
                  </div>
                </dl>
                {airport.description ? (
                  <p className="airport-card__description">{airport.description}</p>
                ) : null}
                <a className="primary-button" href={airport.pagePath}>
                  View {airport.iata} routes
                </a>
              </article>
            ))}
          </div>
        </div>
        <div className="airport-operations__media">
          <Image
            alt={`Direct-flight operations serving ${cityName}`}
            fill
            sizes="(max-width: 980px) 100vw, 45vw"
            src="/figma/home/corridor-flight.jpg"
            unoptimized
          />
          <div>
            <strong>{leadingNetworkShare}%</strong>
            <span>of the leading hub&apos;s network is international</span>
          </div>
        </div>
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

function shortAirportName(value: string): string {
  return value
    .replace(/\s+International\s+Airport$/i, "")
    .replace(/\s+Airport$/i, "");
}
