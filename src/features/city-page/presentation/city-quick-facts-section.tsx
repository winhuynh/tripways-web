import type { CityQuickFacts, CityRouteExtreme } from "../domain/models";

/**
 * Renders the dedicated City Quick Facts read model used in the destination
 * sidebar.
 */
export function CityQuickFactsSection({
  cityName,
  quickFacts,
}: {
  cityName: string;
  quickFacts: CityQuickFacts;
}) {
  return (
    <section aria-labelledby="city-quick-facts-heading" className="aside-card quick-facts-card">
      <h3 id="city-quick-facts-heading">Quick facts</h3>
      <dl>
        <QuickFact label={`${cityName} airports`} value={quickFacts.airportCount} />
        <QuickFact label="Direct destinations" value={quickFacts.directDestinationCount} />
        <QuickFact label="Countries" value={quickFacts.directCountryCount} />
        <QuickFact label="Airlines" value={quickFacts.airlineCount} />
        <RouteQuickFact label="Shortest route" route={quickFacts.shortestRoute} />
        <RouteQuickFact label="Longest route" route={quickFacts.longestRoute} />
      </dl>
    </section>
  );
}

/**
 * Preserves the Quick Facts sidebar slot while its read model streams.
 */
export function CityQuickFactsFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Quick facts loading"
      className="aside-card quick-facts-card quick-facts-card--loading"
    >
      Loading quick facts…
    </section>
  );
}

/**
 * Keeps the sidebar layout stable when the Quick Facts read fails.
 */
export function CityQuickFactsUnavailable() {
  return (
    <section className="aside-card quick-facts-card">
      <h3>Quick facts</h3>
      <p>City facts are temporarily unavailable.</p>
    </section>
  );
}

function QuickFact({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function RouteQuickFact({
  label,
  route,
}: {
  label: string;
  route: CityRouteExtreme | null;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {route ? <a href={route.routePath}>{route.destinationName}</a> : "Unknown"}
      </dd>
    </div>
  );
}
