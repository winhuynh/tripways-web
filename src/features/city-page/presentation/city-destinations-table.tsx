import Link from "next/link";
import { getAirlineDisplay, getAirportDisplay } from "@/features/route-search/domain/route-filter-labels";
import type { CityPageDestination } from "../domain/city-page-model";

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

type CityDestinationsTableProps = {
  cityName: string;
  destinations: readonly CityPageDestination[];
  totalCount?: number;
};

export function CityDestinationsTable({
  cityName,
  destinations,
  totalCount,
}: CityDestinationsTableProps) {
  const displayTotal = totalCount ?? destinations.length;
  return (
    <div className="city-destinations-section">
      <div className="city-table-header">
        <h2 className="city-table-title">Nonstop destinations from {cityName}</h2>
        <span className="city-table-count">
          Showing {destinations.length} of {displayTotal} nonstop destinations
        </span>
      </div>

      <div className="city-table-wrap">
        <table className="city-destinations-table">
          <thead>
            <tr>
              <th>DESTINATION</th>
              <th>COUNTRY / REGION</th>
              <th>ORIGIN</th>
              <th>AIRLINES</th>
              <th>TIME &amp; FREQ</th>
              <th>ESTIMATED FARE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                  No nonstop destinations match these filters.
                </td>
              </tr>
            ) : (
              destinations.map((dest) => {
                const regionText = dest.region ? `${dest.country} / ${dest.region}` : dest.country;
                const durationText = formatDuration(dest.minDuration);
                const freqText =
                  typeof dest.frequency === "number" && dest.frequency > 0
                    ? `${dest.frequency}/week`
                    : "Varies";
                const currency = dest.fareCurrency ?? "£";
                const hasFare = typeof dest.fareMin === "number" && typeof dest.fareMax === "number";
                const fareText = hasFare
                  ? `${currency}${dest.fareMin} - ${currency}${dest.fareMax}`
                  : "—";
                const airportLabels = dest.airports.map((code) => getAirportDisplay(code)).join(", ");
                const airlineNames = dest.airlines.map(getAirlineDisplay).join(", ");

                return (
                  <tr key={dest.path}>
                    <td className="city-dest-col">
                      <Link href={dest.path} className="city-dest-link">
                        <strong className="city-dest-name">{dest.city}</strong>
                        <small className="city-dest-airports">
                          {airportLabels}
                        </small>
                      </Link>
                    </td>
                    <td className="city-region-col">{regionText}</td>
                    <td className="city-origin-col">
                      <div className="city-origin-badges">
                        {dest.originAirports.map((iata) => (
                          <span key={iata} className="city-origin-badge" title={getAirportDisplay(iata)}>
                            {iata}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="city-airlines-col">
                      <span className="city-airlines-text">{airlineNames}</span>
                    </td>
                    <td className="city-time-col">
                      <div className="city-time-group">
                        <span className="city-duration">{durationText}</span>
                        <small className="city-frequency">{freqText}</small>
                      </div>
                    </td>
                    <td className="city-fare-col">
                      <span className="city-fare-range">{fareText}</span>
                      <small className="city-fare-sub">
                        {hasFare ? "Economy one-way" : "Check live fares"}
                      </small>
                    </td>
                    <td className="city-action-col">
                      <div className="city-dest-actions">
                        <Link
                          href={dest.path}
                          className="city-dest-cta city-dest-cta--primary"
                          aria-label={`Check fares from ${cityName} to ${dest.city}`}
                        >
                          Check fares ↗
                        </Link>
                        <Link
                          href={dest.path}
                          className="city-dest-cta city-dest-cta--secondary"
                          aria-label={`View route guide for ${cityName} to ${dest.city}`}
                        >
                          Route guide →
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="city-table-disclaimer">
        Estimated frequency &amp; fares for nonstop flights only. Check airline and airport
        schedules for the latest verified flight status, operational changes, and seasonal frequency.
      </p>
    </div>
  );
}
