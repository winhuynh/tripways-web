import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/shared/ui";

import type {
  AirportPageModel,
  AirportRouteFilters,
  AirportRouteResult,
} from "../domain/models";
import "./airport-page.css";

export function AirportPage({
  filters,
  model,
  routes,
}: {
  filters: AirportRouteFilters;
  model: AirportPageModel;
  routes: AirportRouteResult;
}) {
  const base = model.meta.canonicalPath;
  return (
    <div className="airport-editorial-shell">
      <SiteHeader />
      <main className="airport-page">
        <section className="airport-hero">
          <div className="airport-hero__eyebrow">
            <span>{model.airport.country.code}</span>
            <span>{model.airport.city.name}</span>
            <span>{model.airport.timezone ?? "Local time"}</span>
          </div>
          <div className="airport-hero__grid">
            <div>
              <p className="airport-hero__code">{model.airport.iata}</p>
              <h1>{model.seo.h1}</h1>
              <p className="airport-hero__lead">{model.seo.subheadline}</p>
              <p className="airport-hero__intro">{model.content.intro}</p>
            </div>
            <dl className="airport-hero__facts">
              <Fact label="Direct from here" value={model.quickFacts.outboundDestinations} />
              <Fact label="Direct origins" value={model.quickFacts.inboundOrigins} />
              <Fact label="Airlines" value={model.quickFacts.airlines} />
              <Fact label="Countries served" value={model.quickFacts.outboundCountries} />
            </dl>
          </div>
        </section>

        <section className="airport-routes" id="routes">
          <div className="airport-section-heading">
            <div>
              <p className="airport-kicker">FLIGHT NETWORK</p>
              <h2>Direct route explorer</h2>
              <p>{model.content.routeSummary}</p>
            </div>
            <nav aria-label="Route direction" className="airport-direction">
              <Link
                aria-current={filters.direction === "outbound" ? "page" : undefined}
                href={`${base}?direction=outbound#routes`}
              >
                From {model.airport.iata}
              </Link>
              <Link
                aria-current={filters.direction === "inbound" ? "page" : undefined}
                href={`${base}?direction=inbound#routes`}
              >
                To {model.airport.iata}
              </Link>
            </nav>
          </div>

          <form action={base} className="airport-filter-bar">
            <input name="direction" type="hidden" value={filters.direction} />
            <label>
              Airline code
              <input defaultValue={filters.airlines?.[0]} maxLength={2} name="airline" placeholder="TG" />
            </label>
            <label>
              Country code
              <input defaultValue={filters.countries?.[0]} maxLength={2} name="country" placeholder="SG" />
            </label>
            <label>
              Max duration
              <select defaultValue={filters.maxDurationMinutes ?? ""} name="duration">
                <option value="">Any duration</option>
                <option value="180">Up to 3 hours</option>
                <option value="360">Up to 6 hours</option>
                <option value="720">Up to 12 hours</option>
              </select>
            </label>
            <button type="submit">Apply filters</button>
          </form>

          <p className="airport-route-count">
            {routes.total} direct {routes.direction === "outbound" ? "destination" : "origin"}
            {routes.total === 1 ? "" : "s"}
          </p>
          <div className="airport-route-grid">
            {routes.routes.map((route) => (
              <article className="airport-route-card" key={`${route.airportIata}-${route.citySlug}`}>
                <div>
                  <span>{route.countryCode}</span>
                  <strong>{route.airportIata}</strong>
                </div>
                <h3>{route.cityName}</h3>
                <p>{route.airportName}</p>
                <dl>
                  <div><dt>Airlines</dt><dd>{route.airlines.join(", ")}</dd></div>
                  <div><dt>Flight time</dt><dd>{duration(route.shortestDurationMinutes)}</dd></div>
                  <div><dt>Weekly</dt><dd>{route.frequencyPerWeek ?? "Unknown"}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          {routes.routes.length === 0 ? (
            <p className="airport-empty">No routes match these filters. Try a broader search.</p>
          ) : null}
        </section>

        <section className="airport-essentials">
          <div className="airport-section-heading">
            <div>
              <p className="airport-kicker">PLAN THE GROUND LEG</p>
              <h2>Airport essentials</h2>
              <p>Useful context for getting there, parking and waiting before a flight.</p>
            </div>
          </div>
          <div className="airport-essential-grid">
            {model.accessOptions.map((access) => (
              <article key={access.name}>
                <span>{access.type.toUpperCase()}</span>
                <h3>{access.name}</h3>
                <strong>{access.destinationLabel}</strong>
                <p>{access.summary}</p>
                {access.durationMinMinutes ? (
                  <small>{access.durationMinMinutes}–{access.durationMaxMinutes} min</small>
                ) : null}
              </article>
            ))}
            {model.parking ? (
              <article>
                <span>PARKING</span>
                <h3>Leave a car at {model.airport.iata}</h3>
                <p>{model.parking.summary}</p>
              </article>
            ) : null}
          </div>
        </section>

        <section className="airport-lounge-section">
          <div>
            <p className="airport-kicker">BEFORE DEPARTURE</p>
            <h2>Lounges at {model.airport.iata}</h2>
            <p>{model.content.loungeSummary}</p>
          </div>
          <div className="airport-lounge-list">
            {model.lounges.map((lounge) => (
              <article key={lounge.name}>
                <h3>{lounge.name}</h3>
                <p>{lounge.locationSummary}</p>
                <p>{lounge.accessSummary}</p>
                <ul>
                  {lounge.amenities.map((amenity) => <li key={amenity}>{amenity.replace("_", " ")}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {model.notices.map((notice) => (
          <aside className="airport-notice" key={notice.title}>
            <span>GOOD TO KNOW</span>
            <div><h2>{notice.title}</h2><p>{notice.body}</p></div>
          </aside>
        ))}

        <section className="airport-faqs">
          <p className="airport-kicker">QUICK ANSWERS</p>
          <h2>Frequently asked questions</h2>
          {model.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Fact({ label, value }: { label: string; value: number }) {
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}

function duration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h${remainder ? ` ${remainder}m` : ""}`;
}
