import Link from "next/link";
import { AirlineBadgeGroup } from "@/shared/ui";
import {
  getHubRouteNetwork,
  type HubAirport,
} from "../domain/homepage-routes-data";

type LocalHubDestinationsSectionProps = {
  currentHub: HubAirport;
};

export function LocalHubDestinationsSection({
  currentHub,
}: LocalHubDestinationsSectionProps) {
  const network = getHubRouteNetwork(currentHub);
  const destinations = network.destinations.slice(0, 6);

  if (destinations.length === 0) {
    return null;
  }

  return (
    <section
      className="home-local-hub-section"
      aria-label={`Direct flights from ${currentHub.cityName}`}
    >
      <div className="pseo-container">
        <div className="home-local-hub__header">
          <div className="home-local-hub__title-wrap">
            <span className="home-section-eyebrow">
              Nonstop from {currentHub.cityName}
            </span>
            <h2 className="home-local-hub__title">
              Direct flights from {currentHub.cityName} ({currentHub.iata})
            </h2>
            <p className="home-local-hub__intro">
              Explore direct flight routes operated from {currentHub.name}.
            </p>
          </div>
          <Link
            href={`/flights-from/${currentHub.citySlug}`}
            className="home-local-hub__view-all"
          >
            All flights from {currentHub.cityName} &rarr;
          </Link>
        </div>

        <div className="home-local-hub__grid">
          {destinations.map((dest) => (
            <Link
              key={`${currentHub.iata}-${dest.iata}`}
              href={dest.routePath}
              className="home-local-dest-card"
            >
              <div className="home-local-dest-card__top">
                <div className="home-local-dest-card__city-wrap">
                  <span className="home-local-dest-card__city">{dest.cityName}</span>
                  <span className="home-local-dest-card__country">{dest.countryName}</span>
                </div>
                <span className="home-local-dest-card__iata">{dest.iata}</span>
              </div>

              <div className="home-local-dest-card__meta">
                <div className="home-local-dest-card__meta-item">
                  <span className="home-local-dest-card__meta-label">Flight time</span>
                  <span className="home-local-dest-card__meta-value">{dest.typicalDuration}</span>
                </div>
                <div className="home-local-dest-card__meta-item">
                  <span className="home-local-dest-card__meta-label">Distance</span>
                  <span className="home-local-dest-card__meta-value">
                    {dest.distanceKm.toLocaleString()} km
                  </span>
                </div>
              </div>

              <div className="home-local-dest-card__footer">
                <AirlineBadgeGroup
                  airlines={dest.airlines}
                  size={14}
                  textClassName="home-local-dest-card__airline-text"
                />
                <span className="home-local-dest-card__cta">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
