import Link from "next/link";
import { AirlineBadgeGroup } from "@/shared/ui";
import type { CityPageAirport, CityPageDestination } from "../domain/city-page-model";

type CityAirportsComparisonProps = {
  cityName: string;
  airports: readonly CityPageAirport[];
  destinations?: readonly CityPageDestination[];
};

export function CityAirportsComparison({
  cityName,
  airports,
  destinations = [],
}: CityAirportsComparisonProps) {
  if (!airports || airports.length === 0) return null;

  // Single Airport Layout: Spotlight Gateway
  if (airports.length === 1) {
    const airport = airports[0];
    const routes = destinations.filter((d) => d.originAirports.includes(airport.iata));

    let minFare: number | undefined = undefined;
    let currency = "£";
    for (const r of routes) {
      if (typeof r.fareMin === "number") {
        if (minFare === undefined || r.fareMin < minFare) {
          minFare = r.fareMin;
          if (r.fareCurrency) currency = r.fareCurrency;
        }
      }
    }

    const airlineCounts = new Map<string, number>();
    for (const r of routes) {
      for (const a of r.airlines) {
        airlineCounts.set(a, (airlineCounts.get(a) ?? 0) + 1);
      }
    }
    const topAirlines = Array.from(airlineCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([code]) => code);

    const sampleDests = routes.slice(0, 4).map((d) => d.city).join(", ");
    const defaultDescription = `${airport.name} (${airport.iata}) is the primary commercial gateway connecting ${cityName} with direct domestic and international flights.`;

    return (
      <section className="city-airports-section" aria-label="Airport gateway details">
        <div className="city-airports-header">
          <h2 className="city-airports-heading">
            Airport gateway for {cityName}
          </h2>
          <p className="city-airports-subheadline">
            {airport.name} ({airport.iata}) is the main commercial airport connecting {cityName} to nonstop regional and international destinations.
          </p>
        </div>

        <div className="city-airport-spotlight-card">
          <div className="city-airport-spotlight-main">
            <div className="city-airport-badge-row">
              <span className="city-airport-pill city-airport-pill--primary">
                ✈️ Primary Gateway
              </span>
              <span className="city-airport-iata-pill">{airport.iata}</span>
            </div>

            <h3 className="city-airport-spotlight-title">{airport.name}</h3>
            <p className="city-airport-description">
              {airport.description ?? defaultDescription}
            </p>

            <div className="city-airport-stats-bar">
              <div className="city-airport-stat">
                <strong className="city-airport-stat__val">{airport.destinations}</strong>
                <span className="city-airport-stat__label">Direct destinations</span>
              </div>
              <div className="city-airport-stat">
                <strong className="city-airport-stat__val">{airport.airlines}</strong>
                <span className="city-airport-stat__label">Operating airlines</span>
              </div>
              {typeof minFare === "number" && (
                <div className="city-airport-stat">
                  <strong className="city-airport-stat__val">{currency}{minFare}</strong>
                  <span className="city-airport-stat__label">Starting fare</span>
                </div>
              )}
            </div>

            {topAirlines.length > 0 && (
              <div className="city-airport-meta-row">
                <span className="city-airport-meta-label">Top airlines:</span>
                <div className="city-airport-meta-val">
                  <AirlineBadgeGroup airlines={topAirlines} maxLogos={4} size={20} showNames={true} />
                </div>
              </div>
            )}

            {sampleDests && (
              <div className="city-airport-meta-row">
                <span className="city-airport-meta-label">Popular direct routes:</span>
                <span className="city-airport-meta-val">{sampleDests}</span>
              </div>
            )}
          </div>

          <div className="city-airport-spotlight-sidebar">
            <div className="city-airport-transit-box">
              <h4 className="city-airport-transit-title">Airport Information</h4>
              <p className="city-airport-transit-text">
                Check terminal maps, real-time arrival and departure schedules, baggage policies, and ground transportation into {cityName}.
              </p>
              <Link
                href={`/airports/${airport.iata.toLowerCase()}`}
                className="city-airport-cta-btn"
              >
                Explore {airport.iata} Airport Guide &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Multi-Airport Layout (>= 2 airports): Side-by-Side Matchup
  return (
    <section className="city-airports-section" aria-label="Airport hub comparison">
      <div className="city-airports-header">
        <h2 className="city-airports-heading">
          Choose the {cityName} airport that fits your route
        </h2>
        <p className="city-airports-subheadline">
          {cityName} is served by {airports.length} commercial airports: {airports.map((a) => `${a.name} (${a.iata})`).join(" and ")}.
          Compare key strengths to pick the best departure point for your budget, schedule, and airline preference.
        </p>
      </div>

      <div className="city-airports-matchup-grid">
        {airports.map((airport) => {
          const isPrimary = airport.primary;
          const routes = destinations.filter((d) => d.originAirports.includes(airport.iata));

          let minFare: number | undefined = undefined;
          let currency = "£";
          for (const r of routes) {
            if (typeof r.fareMin === "number") {
              if (minFare === undefined || r.fareMin < minFare) {
                minFare = r.fareMin;
                if (r.fareCurrency) currency = r.fareCurrency;
              }
            }
          }

          const airlineCounts = new Map<string, number>();
          for (const r of routes) {
            for (const a of r.airlines) {
              airlineCounts.set(a, (airlineCounts.get(a) ?? 0) + 1);
            }
          }
          const topAirlines = Array.from(airlineCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([code]) => code);

          const sampleDests = routes.slice(0, 3).map((d) => d.city).join(", ");

          const roleBadgeText = isPrimary ? "👑 Primary International Hub" : "⚡ Budget & Regional Hub";
          const bestForText = isPrimary
            ? "Long-haul intercontinental routes, full-service carriers & global airline alliances."
            : "Budget-conscious travelers, regional short-haul hops & domestic flight connections.";

          const defaultDescription = isPrimary
            ? `${cityName}'s primary international gateway for long-haul and full-service flights.`
            : `${cityName}'s primary base for low-cost carriers, budget connections, and domestic travel.`;

          return (
            <article
              key={airport.iata}
              className={`city-airport-matchup-card ${
                isPrimary ? "city-airport-matchup-card--primary" : "city-airport-matchup-card--secondary"
              }`}
            >
              <div className="city-airport-card__top">
                <div className="city-airport-badge-row">
                  <span
                    className={`city-airport-pill ${
                      isPrimary ? "city-airport-pill--primary" : "city-airport-pill--budget"
                    }`}
                  >
                    {roleBadgeText}
                  </span>
                  <span className="city-airport-iata-pill">{airport.iata}</span>
                </div>

                <h3 className="city-airport-matchup-title">{airport.name}</h3>
                <p className="city-airport-description">
                  {airport.description ?? defaultDescription}
                </p>
              </div>

              {/* Stat triad bar */}
              <div className="city-airport-stats-bar">
                <div className="city-airport-stat">
                  <strong className="city-airport-stat__val">{airport.destinations}</strong>
                  <span className="city-airport-stat__label">Direct destinations</span>
                </div>
                <div className="city-airport-stat">
                  <strong className="city-airport-stat__val">{airport.airlines}</strong>
                  <span className="city-airport-stat__label">Operating airlines</span>
                </div>
                {typeof minFare === "number" ? (
                  <div className="city-airport-stat">
                    <strong className="city-airport-stat__val">{currency}{minFare}</strong>
                    <span className="city-airport-stat__label">Fares from</span>
                  </div>
                ) : (
                  <div className="city-airport-stat">
                    <strong className="city-airport-stat__val">{isPrimary ? "Full service" : "Budget"}</strong>
                    <span className="city-airport-stat__label">Focus</span>
                  </div>
                )}
              </div>

              {/* Decision criteria checklist */}
              <div className="city-airport-decision-box">
                <div className="city-airport-decision-row">
                  <span className="city-airport-decision-label">🎯 Best for:</span>
                  <p className="city-airport-decision-val">{bestForText}</p>
                </div>

                {topAirlines.length > 0 && (
                  <div className="city-airport-decision-row">
                    <span className="city-airport-decision-label">✈️ Top airlines:</span>
                    <div className="city-airport-decision-val">
                      <AirlineBadgeGroup airlines={topAirlines} maxLogos={4} size={18} showNames={true} />
                    </div>
                  </div>
                )}

                {sampleDests && (
                  <div className="city-airport-decision-row">
                    <span className="city-airport-decision-label">📍 Key routes:</span>
                    <p className="city-airport-decision-val">{sampleDests}</p>
                  </div>
                )}
              </div>

              <div className="city-airport-card__footer">
                <Link
                  href={`/airports/${airport.iata.toLowerCase()}`}
                  className="city-airport-link"
                >
                  Explore {airport.iata} airport guide &rarr;
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {airports.length === 2 && (
        <div className="city-airport-transit-advisory">
          <span className="city-airport-transit-icon" aria-hidden="true">💡</span>
          <div className="city-airport-transit-content">
            <strong className="city-airport-transit-lead">Self-transferring between {airports[0].iata} and {airports[1].iata}?</strong>
            <p className="city-airport-transit-desc">
              Allow at least 3.5 to 4 hours between connecting flights to clear immigration, collect baggage, and complete ground transfer between terminals across {cityName}.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
