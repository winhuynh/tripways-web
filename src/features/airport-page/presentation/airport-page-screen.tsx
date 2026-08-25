import {
  Breadcrumbs,
  FaqAccordion,
  FreshnessBadge,
  InternalLinkGroups,
  PageHero,
  StatGrid,
} from "@/shared/ui";
import type { RouteSearchModel } from "@/features/route-search/domain/route-search-model";
import {
  AIRPORT_ROUTE_FILTER_FIELDS,
  getUsableNextCursor,
  type RouteFilterValues,
} from "@/features/route-search/domain/route-filter";
import { MasterRouteFilter } from "@/features/route-search/presentation/master-route-filter";
import { RouteResults } from "@/features/route-search/presentation/route-results";

import type {
  AirportLounge,
  AirportPageModel,
  AirportTransportOption,
  JourneyStep,
  JourneyType,
  TransportDirection,
} from "../domain/airport-page-model";
import "./airport-page.css";

type Props = Readonly<{
  model: AirportPageModel;
  routes: RouteSearchModel;
  filterValues: RouteFilterValues;
  clearHref: string;
  initialJourney: JourneyType;
  transportDirection: TransportDirection;
}>;

export function AirportPageScreen({
  model,
  routes,
  filterValues,
  clearHref,
  initialJourney,
  transportDirection,
}: Props) {
  const code = model.airport.iata;
  const journey = initialJourney === "departing" ? model.departure : model.arrival;
  const transport = model.transport.filter(
    (option) => option.direction === transportDirection || option.direction === "both",
  );

  return <main className="pseo-page airport-page"><div className="pseo-container">
    <Breadcrumbs items={[
      { label: model.airport.country.name, href: "/" },
      { label: model.airport.city.name, href: `/flights-from/${model.airport.city.slug}` },
      { label: code },
    ]} />
    <PageHero
      eyebrow={code}
      title={model.seo.h1}
      intro={model.orientation.intro}
      meta={model.provenance.reviewedAt
        ? <FreshnessBadge value={formatDate(model.provenance.reviewedAt)} />
        : null}
    />

    <section id="overview" className="airport-overview" aria-labelledby="overview-heading">
      <div>
        <p className="pseo-eyebrow">Overview</p>
        <h2 id="overview-heading">About {model.airport.name}</h2>
        <p>{model.orientation.summary}</p>
      </div>
      <StatGrid items={[
        { label: "Default connection", value: model.quickAnswers.defaultTransport ?? "Check current options" },
        { label: `Time to ${model.airport.city.name}`, value: model.quickAnswers.transportMinutes ? `${model.quickAnswers.transportMinutes.min}–${model.quickAnswers.transportMinutes.max} min` : "Varies" },
        { label: `Distance to ${model.airport.city.name}`, value: model.quickAnswers.cityDistanceKm === null ? "Unknown" : `${model.quickAnswers.cityDistanceKm} km` },
        { label: "Terminals", value: model.quickAnswers.terminalCount },
      ]} />
    </section>

    <nav className="airport-anchor-nav" aria-label="Airport guide sections">
      <a href="#overview">Overview</a>
      <a href="#connections">Bangkok connections</a>
      <a href="#journey-guide">Journey guide</a>
      <a href="#direct-flights">Verified flights</a>
      <a href="#airport-essentials">Airport essentials</a>
      <a href="#faq-heading">FAQs</a>
    </nav>

    <section id="connections" className="pseo-section airport-connections">
      <p className="pseo-eyebrow">Ground transport</p>
      <h2>{model.airport.city.name} and airport connections</h2>
      <p>Compare typical journey times and estimated prices before choosing how to travel.</p>
      <div className="airport-segmented-control" aria-label="Connection direction">
        <a aria-current={transportDirection === "from_airport" ? "page" : undefined} href={`${clearHref}?transport=from_airport#connections`}>Airport → {model.airport.city.name}</a>
        <a aria-current={transportDirection === "to_airport" ? "page" : undefined} href={`${clearHref}?transport=to_airport#connections`}>{model.airport.city.name} → Airport</a>
      </div>
      <div className="airport-transport-grid">
        {transport.map((option) => <TransportCard key={`${option.direction}:${option.type}:${option.name}`} option={option} />)}
      </div>
    </section>

    <section id="journey-guide" className="pseo-section airport-journey">
      <p className="pseo-eyebrow">Journey guide</p>
      <div className="airport-journey-tabs" role="tablist" aria-label="Airport journey">
        <a role="tab" aria-selected={initialJourney === "arriving"} href={`${clearHref}?journey=arriving#journey-guide`}>Arriving at {code}</a>
        <a role="tab" aria-selected={initialJourney === "departing"} href={`${clearHref}?journey=departing&transport=to_airport#journey-guide`}>Departing from {code}</a>
      </div>
      <div role="tabpanel" aria-label={initialJourney === "arriving" ? `Arriving at ${code}` : `Departing from ${code}`}>
        <h2>{initialJourney === "arriving" ? `Arriving at ${code}` : `Departing from ${code}`}</h2>
        <p>{journey.summary}</p>
        <JourneySteps steps={journey.steps} />
        {initialJourney === "departing" && model.lounges.length > 0
          ? <LoungeUtility lounges={model.lounges} />
          : null}
      </div>
    </section>

    <section id="direct-flights" className="pseo-section airport-flight-explorer">
      <p className="pseo-eyebrow">Operated nonstop services</p>
      <h2>Verified direct flights to and from {model.airport.name}</h2>
      <p>Browse confirmed operated nonstop services using {code}. Routes shown are not calculated or connected by Tripways.</p>
      <MasterRouteFilter
        fields={AIRPORT_ROUTE_FILTER_FIELDS}
        values={filterValues}
        facets={routes.facets}
        clearHref={clearHref}
        nextCursor={getUsableNextCursor({
          total: routes.total,
          pageSize: routes.pageSize,
          optionCount: routes.options.length,
          nextCursor: routes.nextCursor,
        })}
        airportCode={code}
        heading="Find a verified direct route"
      />
      <RouteResults
        model={routes}
        includePrice={false}
        filterValues={filterValues}
        clearHref={clearHref}
      />
      <p className="airport-data-note">Route coverage reflects the verified dataset available to Tripways and may not include every recently announced or seasonal service.</p>
      {model.provenance.routeDataRefreshedAt
        ? <FreshnessBadge value={formatDate(model.provenance.routeDataRefreshedAt)} />
        : null}
    </section>

    <section id="airport-essentials" className="pseo-section">
      <p className="pseo-eyebrow">Airport essentials</p>
      <h2>Useful information at {code}</h2>
      <div className="airport-card-grid">
        {model.terminals.map((item) => <article key={item.code}><p className="pseo-eyebrow">{item.code}</p><h3>{item.name}</h3></article>)}
        {model.facilities.map((item) => <article key={`${item.category}:${item.name}`}><p className="pseo-eyebrow">{item.category}</p><h3>{item.name}</h3><p>{item.summary}</p></article>)}
      </div>
    </section>

    <FaqAccordion items={model.faqs} />
    <InternalLinkGroups groups={model.links} />
    <aside className="airport-provenance">
      <strong>About this airport guide</strong>
      <p>Times and prices are estimates. Confirm flight-specific requirements with the operating airline and current transport details with the operator.</p>
      {model.provenance.freshnessAt ? <FreshnessBadge value={formatDate(model.provenance.freshnessAt)} /> : null}
    </aside>
  </div></main>;
}

function JourneySteps({ steps }: { steps: JourneyStep[] }) {
  return <ol className="airport-steps">{steps.map((step, index) => <li key={`${step.audience}:${step.title}`}>
    <span>{index + 1}</span>
    <div><p className="pseo-eyebrow">{step.audience}</p><h3>{step.title}</h3><p>{step.body}</p></div>
  </li>)}</ol>;
}

function TransportCard({ option }: { option: AirportTransportOption }) {
  return <article>
    <div><p className="pseo-eyebrow">{option.type.replaceAll("_", " ")}</p><h3>{option.name}</h3></div>
    <p>{option.summary}</p>
    <dl>
      <dt>Typical time</dt><dd>{formatMinutes(option.duration)}</dd>
      <dt>Estimated price</dt><dd>{formatPrice(option.price)}</dd>
      <dt>Operating window</dt><dd>{option.operatingHours ?? "Check operator"}</dd>
      <dt>Best for</dt><dd>{option.bestFor ?? "Depends on journey"}</dd>
      <dt>Where to board</dt><dd>{option.pickupLocation ?? option.destinationLabel}</dd>
    </dl>
  </article>;
}

function LoungeUtility({ lounges }: { lounges: AirportLounge[] }) {
  return <aside className="airport-lounge" aria-labelledby="lounge-heading">
    <div><p className="pseo-eyebrow">Optional departure utility</p><h3 id="lounge-heading">Explore lounge access</h3><p>Access conditions, opening windows and facilities vary. Tripways does not operate or guarantee these lounges.</p></div>
    <div className="airport-lounge__cards">{lounges.slice(0, 3).map((lounge) => <article key={lounge.name}>
      <h4>{lounge.name}</h4>
      <p>{lounge.location} · {lounge.locationType}</p>
      <p>{lounge.access}</p>
      {lounge.operatingHours ? <p><strong>Opening window:</strong> {lounge.operatingHours}</p> : null}
      {lounge.estimatedPrice ? <p><strong>Estimated entry:</strong> {formatPrice(lounge.estimatedPrice)}</p> : null}
      <p><strong>Facilities:</strong> {lounge.amenities.join(", ")}</p>
      <p><a href={lounge.sourceUrl}>Source and access conditions</a> · Verified {formatDate(lounge.lastVerifiedAt)}</p>
      {lounge.affiliateUrl ? <a className="airport-lounge__cta" href={lounge.affiliateUrl} rel="sponsored nofollow">Check lounge access</a> : null}
    </article>)}</div>
    <small><strong>Affiliate disclosure:</strong> Tripways may earn a commission if you book through a marked link.</small>
  </aside>;
}

function formatMinutes(duration: { minMinutes: number | null; maxMinutes: number | null }) {
  if (duration.minMinutes === null || duration.maxMinutes === null) return "Varies";
  return `${duration.minMinutes}–${duration.maxMinutes} min`;
}

function formatPrice(price: { min: number | null; max: number | null; currency: string | null }) {
  if (price.min === null || price.max === null || price.currency === null) return "Check operator";
  return `${price.min.toLocaleString("en-GB")}–${price.max.toLocaleString("en-GB")} ${price.currency} estimated`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
