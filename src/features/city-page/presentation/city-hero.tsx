import Link from "next/link";

import type { CityOverview } from "../domain/models";

/**
 * Renders the required City Hub overview content and aggregate facts supplied
 * by the overview read model.
 */
export function CityHero({ overview }: { overview: CityOverview }) {
  const facts = [
    ["Direct destinations", overview.quickFacts.directDestinationCount],
    ["Countries", overview.quickFacts.directCountryCount],
    ["Airlines", overview.quickFacts.airlineCount],
    ["Airports", overview.quickFacts.airportCount],
    ["Shortest route", formatMinutes(overview.quickFacts.shortestRouteMinutes)],
    ["Longest route", formatMinutes(overview.quickFacts.longestRouteMinutes)],
  ];

  return (
    <section className="city-hero">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <a href={`/flights-from/${overview.country.slug}`}>
          {overview.country.name}
        </a>
        <span>›</span>
        <span>{overview.city.name} flights</span>
      </nav>
      <div className="hero-heading">
        <div>
          <span className="city-hero__rule" aria-hidden="true" />
          <h1 aria-label={overview.content.h1}>
            <span>Direct</span> <em>flights</em>
            <br />
            <em>from</em>
            <br />
            <span>{overview.city.name}</span>
          </h1>
          <p className="hero-subheadline">{overview.content.subheadline}</p>
          <p className="hero-intro">{overview.content.intro}</p>
        </div>
        <span className="data-badge">
          <span aria-hidden="true">◉</span> Reviewed route data
        </span>
      </div>
      <dl
        className="quick-facts"
        aria-label={`${overview.city.name} direct flight facts`}
      >
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function formatMinutes(value: number | null): string {
  if (value === null) return "Unknown";
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}
