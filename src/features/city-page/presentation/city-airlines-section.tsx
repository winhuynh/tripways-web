import type { CityAirline } from "../domain/models";

export function CityAirlinesSection({ airlines }: { airlines: readonly CityAirline[] }) {
  return (
    <section id="airlines">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Operating carriers</p>
          <h2>Airlines flying direct from Bangkok</h2>
        </div>
      </div>
      <div className="airline-grid">
        {airlines.map((airline) => (
          <a className="airline-card" href={airline.pagePath} key={airline.iata}>
            <span className="airline-logo">{airline.iata}</span>
            <strong>{airline.name}</strong>
            <small>{airline.originAirports.join(" + ")}</small>
            <span>{airline.directDestinationCount} destinations</span>
          </a>
        ))}
      </div>
    </section>
  );
}
