import Link from "next/link";

import { AdSlot } from "@/features/advertising";
import { CITY_ROUTE_FILTER_FIELDS, getUsableNextCursor, type RouteFilterValues } from "@/features/route-search/domain/route-filter";
import type { RouteSearchModel } from "@/features/route-search/domain/route-search-model";
import { MasterRouteFilter } from "@/features/route-search/presentation/master-route-filter";
import { RouteResults } from "@/features/route-search/presentation/route-results";
import { formatDuration } from "@/shared/domain/route-values";
import { Breadcrumbs, FaqAccordion, InternalLinkGroups, PageHero, StatGrid } from "@/shared/ui";
import type { CityPageModel } from "../domain/city-page-model";
import "./city-page.css";

export function CityPageScreen({ model, routes, filterValues }: { model: CityPageModel; routes: RouteSearchModel; filterValues: RouteFilterValues }) {
  const top = model.destinations[0];
  return <main className="pseo-page city-page"><div className="pseo-container">
    <Breadcrumbs items={[{ label: "Cities", href: "/" }, { label: model.country.name }, { label: model.city.name }]} />
    <PageHero eyebrow="City hub" title={model.seo.h1} intro={model.seo.intro} />
    <StatGrid items={[{ label: "Destinations", value: model.quickFacts.destinations }, { label: "Countries", value: model.quickFacts.countries }, { label: "Airlines", value: model.quickFacts.airlines }, { label: "Airports", value: model.quickFacts.airports }]} />
    <section className="city-discovery pseo-section">
      <MasterRouteFilter fields={CITY_ROUTE_FILTER_FIELDS} values={filterValues} facets={routes.facets} departureAirports={model.airports.map((airport) => airport.iata)} clearHref={`/flights-from/${model.city.slug}`} nextCursor={getUsableNextCursor({ total: routes.total, pageSize: routes.pageSize, optionCount: routes.options.length, nextCursor: routes.nextCursor })} heading="Find the nonstop flight that fits" />
      <div>
        {top ? <article className="city-top-route"><p className="pseo-eyebrow">Top route</p><h3>{top.city}</h3><p>{top.airports.join(", ")} · {formatDuration(top.minDuration)}</p><p>{top.airlines.join(", ")}{top.frequency === null ? "" : ` · ${top.frequency}/week`}</p><Link href={top.path}>Explore route</Link></article> : null}
        <h2>Nonstop destinations from {model.city.name}</h2>
        <div className="city-table-wrap"><table><thead><tr><th>Destination</th><th>Country</th><th>Origin</th><th>Airlines</th><th>Time &amp; frequency</th><th></th></tr></thead><tbody>{model.destinations.map((destination) => <tr key={destination.path}><td><strong>{destination.city}</strong><small>{destination.airports.join(", ")}</small></td><td>{destination.country}</td><td>{destination.originAirports.join(", ")}</td><td>{destination.airlines.join(", ")}</td><td>{formatDuration(destination.minDuration)}{destination.frequency === null ? "" : ` · ${destination.frequency}/week`}</td><td><Link href={destination.path}>Explore</Link></td></tr>)}</tbody></table></div>
        <RouteResults model={routes} />
      </div>
    </section>
    <AdSlot format="leaderboard" placement="city_destination_sidebar" />
    <section className="pseo-section"><h2>Choose the {model.city.name} airport that fits your route</h2><div className="city-airports">{model.airports.map((airport) => <article key={airport.iata}><p className="pseo-eyebrow">{airport.iata}{airport.primary ? " · Primary hub" : ""}</p><h3>{airport.name}</h3><p>{airport.destinations} destinations · {airport.airlines} airlines</p><Link href={`/airports/${airport.iata.toLowerCase()}`}>Explore flights from {airport.iata}</Link></article>)}</div></section>
    <FaqAccordion items={model.faqs} /><InternalLinkGroups groups={model.links} />
  </div></main>;
}
