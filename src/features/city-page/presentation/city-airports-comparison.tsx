import Link from "next/link";
import type { CityPageAirport } from "../domain/city-page-model";

type CityAirportsComparisonProps = {
  cityName: string;
  airports: readonly CityPageAirport[];
};

export function CityAirportsComparison({
  cityName,
  airports,
}: CityAirportsComparisonProps) {
  return (
    <section className="city-airports-section" aria-label="Airport hub comparison">
      <h2 className="city-airports-heading">
        Choose the {cityName} airport that fits your route
      </h2>

      <div className="city-airports-grid">
        {airports.map((airport) => {
          const isPrimary = airport.primary;
          const roleLabel =
            airport.role ?? (isPrimary ? "Primary Hub" : "LCC Hub");
          const defaultDescription = isPrimary
            ? `${cityName}'s main long-haul and full-service international gateway.`
            : `${cityName}'s main domestic and regional low-cost carrier terminal.`;

          return (
            <article key={airport.iata} className="city-airport-card">
              <div className="city-airport-card__header">
                <div>
                  <h3 className="city-airport-card__title">
                    {airport.name.replace(/\s+(International\s+)?Airport$/i, "")}
                  </h3>
                  <p className="city-airport-card__role">
                    {airport.iata} · {roleLabel}
                  </p>
                </div>
                <div className="city-airport-icon-wrap" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
                  </svg>
                </div>
              </div>

              <div className="city-airport-stats">
                <div className="city-airport-stat">
                  <strong className="city-airport-stat__val">{airport.destinations}</strong>
                  <span className="city-airport-stat__label">DESTINATIONS</span>
                </div>
                <div className="city-airport-stat">
                  <strong className="city-airport-stat__val">{airport.airlines}</strong>
                  <span className="city-airport-stat__label">AIRLINES</span>
                </div>
              </div>

              <p className="city-airport-description">
                {airport.description ?? defaultDescription}
              </p>

              <Link
                href={`/airports/${airport.iata.toLowerCase()}`}
                className="city-airport-link"
              >
                Explore flights from {airport.iata} &rarr;
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
