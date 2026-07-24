import Link from "next/link";

import type { CityOverview } from "../domain/models";

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
        <span>/</span>
        <span>Flights from {overview.city.name}</span>
      </nav>
      <div className="hero-heading">
        <div>
          <p className="eyebrow">City direct-flight hub</p>
          <h1>{overview.content.h1}</h1>
          <p className="hero-subheadline">{overview.content.subheadline}</p>
          <p className="hero-intro">{overview.content.intro}</p>
        </div>
        <span className="data-badge">◉ Reviewed route data</span>
      </div>
      <dl className="quick-facts" aria-label="Bangkok direct flight facts">
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
