import Link from "next/link";
import { POPULAR_ROUTES, type PopularRouteCard } from "../domain/homepage-routes-data";

export function PopularRoutesSection({
  routes = POPULAR_ROUTES,
}: {
  routes?: readonly PopularRouteCard[];
}) {
  return (
    <section className="home-popular-routes-section" aria-label="Popular nonstop routes">
      <div className="pseo-container">
        <div className="home-popular-routes__header">
          <div className="home-popular-routes__title-wrap">
            <h2 className="home-popular-routes__title">Popular nonstop routes</h2>
            <p className="home-popular-routes__intro">
              Explore well-connected city pairs and compare airlines, distance, and typical
              flight time.
            </p>
          </div>
          <span className="home-preview-badge">ILLUSTRATIVE PREVIEW DATA</span>
        </div>

        <div className="home-popular-routes__grid">
          {routes.map((route) => (
            <Link
              key={`${route.originIata}-${route.destinationIata}`}
              href={route.routePath}
              className="home-route-card"
            >
              <div className="home-route-card__airports">
                <div className="home-route-airport-node">
                  <span className="home-route-iata">{route.originIata}</span>
                  <small className="home-route-city">{route.originCity}</small>
                </div>
                <div className="home-route-arrow">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
                <div className="home-route-airport-node home-route-airport-node--dest">
                  <span className="home-route-iata">{route.destinationIata}</span>
                  <small className="home-route-city">{route.destinationCity}</small>
                </div>
              </div>

              <div className="home-route-card__details">
                <div className="home-route-detail-row">
                  <span className="home-route-detail-label">Airlines</span>
                  <span className="home-route-detail-value">
                    {route.airlines.join(", ")}
                  </span>
                </div>
                <div className="home-route-detail-row">
                  <span className="home-route-detail-label">Distance</span>
                  <span className="home-route-detail-value">
                    {route.distanceKm.toLocaleString()} km
                  </span>
                </div>
                <div className="home-route-detail-row">
                  <span className="home-route-detail-label">Duration</span>
                  <span className="home-route-detail-value">{route.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
