import Link from "next/link";
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
  totalCount = 182,
}: CityDestinationsTableProps) {
  return (
    <div className="city-destinations-section">
      <div className="city-table-header">
        <h2 className="city-table-title">Nonstop destinations from {cityName}</h2>
        <span className="city-table-count">
          Showing {destinations.length} of {totalCount} nonstop destinations
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
              <th>FARE</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((dest) => {
              const regionText = dest.region ? `${dest.country} / ${dest.region}` : dest.country;
              const durationText = formatDuration(dest.minDuration);
              const freqText =
                typeof dest.frequency === "number" && dest.frequency > 0
                  ? `${dest.frequency}/week`
                  : "Varies";
              const currency = dest.fareCurrency ?? "£";
              const fareText =
                typeof dest.fareMin === "number" && typeof dest.fareMax === "number"
                  ? `${currency}${dest.fareMin} - ${currency}${dest.fareMax}`
                  : "—";

              return (
                <tr key={dest.path}>
                  <td className="city-dest-col">
                    <Link href={dest.path} className="city-dest-link">
                      <strong className="city-dest-name">{dest.city}</strong>
                      <small className="city-dest-airports">
                        {dest.airports.join(", ")}
                      </small>
                    </Link>
                  </td>
                  <td className="city-region-col">{regionText}</td>
                  <td className="city-origin-col">
                    <div className="city-origin-badges">
                      {dest.originAirports.map((iata) => (
                        <span key={iata} className="city-origin-badge">
                          {iata}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="city-airlines-col">
                    <span className="city-airlines-text">{dest.airlines.join(", ")}</span>
                  </td>
                  <td className="city-time-col">
                    <div className="city-time-group">
                      <span className="city-duration">{durationText}</span>
                      <small className="city-frequency">{freqText}</small>
                    </div>
                  </td>
                  <td className="city-fare-col">
                    <span className="city-fare-range">{fareText}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="city-table-actions">
        <button type="button" className="city-show-more-btn">
          SHOW MORE RESULTS
        </button>
      </div>

      <p className="city-table-disclaimer">
        Estimated frequency &amp; fares for nonstop flights only. Check airline and airport
        schedules for the latest verified flight status, operational changes, and seasonal frequency.
      </p>
    </div>
  );
}
