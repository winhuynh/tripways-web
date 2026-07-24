import type { CityDestinationResult } from "../domain/models";
import { AdSlot } from "@/features/advertising";

export function CityDestinationsSection({
  result,
  cityName,
}: {
  result: CityDestinationResult;
  cityName: string;
}) {
  return (
    <section id="destinations">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Route discovery</p>
          <h2>Destinations from {cityName}</h2>
        </div>
        <span>{result.total} routes found</span>
      </div>
      <div className="content-with-aside">
        <div className="destination-grid">
          {result.destinations.map((destination) => (
            <article className="destination-card" key={destination.citySlug}>
              <div className="destination-card__image" aria-hidden="true">
                {destination.cityName.slice(0, 1)}
              </div>
              <p className="route-status">Direct route · reviewed data</p>
              <h3>{destination.cityName}</h3>
              <p>
                {destination.countryName} · {destination.destinationAirports.join(", ")}
              </p>
              <dl>
                <div>
                  <dt>From</dt>
                  <dd>{destination.originAirports.join(", ")}</dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>{formatMinutes(destination.shortestDurationMinutes)}</dd>
                </div>
                <div>
                  <dt>Airlines</dt>
                  <dd>{destination.airlines.join(", ")}</dd>
                </div>
                <div>
                  <dt>Frequency</dt>
                  <dd>
                    {destination.frequencyPerWeek === null
                      ? "Unknown"
                      : `${destination.frequencyPerWeek}/week`}
                  </dd>
                </div>
              </dl>
              <a className="card-link" href={destination.routePath}>
                View route
              </a>
            </article>
          ))}
        </div>
        <aside className="page-aside">
          <div className="aside-card">
            <h3>Quick facts</h3>
            <p>Use the filters above to compare direct destinations by airport and duration.</p>
          </div>
          <div className="newsletter-card">
            <p className="eyebrow">Travel deals</p>
            <h3>Weekly route inspiration</h3>
            <p>Newsletter integration will be connected after the discovery experience.</p>
            <button disabled type="button">
              Coming later
            </button>
          </div>
          <AdSlot format="rectangle" placement="city_destination_sidebar" />
        </aside>
      </div>
    </section>
  );
}

function formatMinutes(value: number): string {
  return `${Math.floor(value / 60)}h ${value % 60}m`;
}
