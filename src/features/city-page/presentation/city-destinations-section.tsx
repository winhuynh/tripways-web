import type { ReactNode } from "react";

import type { CityDestinationResult } from "../domain/models";
import { AdSlot } from "@/features/advertising";
import { CityNewsletterCard } from "./city-newsletter-card";

/**
 * Renders the filtered destination catalogue and accepts Quick Facts as an
 * independent server slot so sidebar loading cannot block route cards.
 */
export function CityDestinationsSection({
  result,
  cityName,
  quickFactsSlot,
}: {
  result: CityDestinationResult;
  cityName: string;
  quickFactsSlot: ReactNode;
}) {
  return (
    <section className="city-destinations" id="destinations">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Route discovery</p>
          <h2>
            <span>Destinations</span> <em>from {cityName}</em>
          </h2>
        </div>
        <a className="city-section-link" href="#route-search">
          Refine search
        </a>
      </div>
      <div className="content-with-aside">
        <div className="destination-grid">
          {result.destinations.map((destination, index) => (
            <article className="destination-card" key={destination.citySlug}>
              <div
                aria-hidden="true"
                className={`destination-card__media destination-card__media--${(index % 4) + 1}`}
              >
                <span>Year-round</span>
                <span>Direct route</span>
              </div>
              <div className="destination-card__body">
                <div className="destination-card__identity">
                  <p>
                    {destination.countryName} · {destination.countryIso2}
                  </p>
                  <span aria-hidden="true">
                    {destination.destinationAirports[0] ?? destination.cityName.slice(0, 3)}
                  </span>
                </div>
                <h3>{destination.cityName}</h3>
                <p className="destination-card__airports">
                  {destination.destinationAirports.join(" · ")}
                </p>
                <p className="route-status">
                  <span aria-hidden="true">✣</span>
                  From {destination.originAirports.join(" & ")}
                </p>
                <dl>
                  <div>
                    <dt>Carriers</dt>
                    <dd>{destination.airlines.join(", ") || "Published route"}</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>{formatMinutes(destination.shortestDurationMinutes)}</dd>
                  </div>
                  <div>
                    <dt>Frequency</dt>
                    <dd>
                      {destination.frequencyPerWeek === null
                        ? "Seasonal"
                        : formatFrequency(destination.frequencyPerWeek)}
                    </dd>
                  </div>
                </dl>
                <a className="card-link" href={destination.routePath}>
                  View route
                </a>
              </div>
            </article>
          ))}
          <a className="destination-catalogue-link" href="#route-search">
            View all {result.total} destinations <span aria-hidden="true">→</span>
          </a>
        </div>
        <aside className="page-aside">
          {quickFactsSlot}
          <CityNewsletterCard cityName={cityName} />
          <AdSlot format="rectangle" placement="city_destination_sidebar" />
        </aside>
      </div>
    </section>
  );
}

function formatMinutes(value: number): string {
  return `${Math.floor(value / 60)}h ${value % 60}m`;
}

function formatFrequency(value: number): string {
  const daily = value / 7;
  if (Number.isInteger(daily) && daily > 0) return `${daily} daily`;
  return `${value} weekly`;
}
