type CityQuickFactsProps = {
  destinations: number;
  countries: number;
  airlines: number;
  airports: number;
};

export function CityQuickFacts({
  destinations,
  countries,
  airlines,
  airports,
}: CityQuickFactsProps) {
  return (
    <section className="city-quick-facts" aria-label="City flight network facts">
      <div className="city-fact-card">
        <strong className="city-fact-value">{destinations}</strong>
        <span className="city-fact-label">DESTINATIONS</span>
      </div>
      <div className="city-fact-card">
        <strong className="city-fact-value">{countries}</strong>
        <span className="city-fact-label">COUNTRIES</span>
      </div>
      <div className="city-fact-card">
        <strong className="city-fact-value">{airlines}</strong>
        <span className="city-fact-label">AIRLINES</span>
      </div>
      <div className="city-fact-card">
        <strong className="city-fact-value">{airports}</strong>
        <span className="city-fact-label">AIRPORTS</span>
      </div>
    </section>
  );
}
