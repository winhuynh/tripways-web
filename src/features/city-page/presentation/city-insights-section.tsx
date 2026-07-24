import type { CityInsights } from "../domain/models";

export function CityInsightsSection({ insights }: { insights: CityInsights }) {
  const items = [
    ["Most popular", insights.mostPopularDestination],
    ["Shortest route", insights.shortestDestination],
    ["Longest route", insights.longestDestination],
    ["Top airline", insights.topAirline],
    [
      "Average duration",
      insights.averageDurationMinutes === null
        ? null
        : `${Math.floor(insights.averageDurationMinutes / 60)}h ${
            insights.averageDurationMinutes % 60
          }m`,
    ],
    ["Countries served", insights.directCountryCount.toString()],
  ];

  return (
    <section className="insights-section" id="insights">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Route facts</p>
          <h2>Bangkok travel insights</h2>
        </div>
      </div>
      <dl className="insights-grid">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value ?? "Not enough data"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
