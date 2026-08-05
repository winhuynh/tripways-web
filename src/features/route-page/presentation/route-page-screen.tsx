import { getUsableNextCursor, ROUTE_PAGE_FILTER_FIELDS, type RouteFilterValues } from "@/features/route-search/domain/route-filter";
import type { RouteSearchModel } from "@/features/route-search/domain/route-search-model";
import { MasterRouteFilter } from "@/features/route-search/presentation/master-route-filter";
import { RouteResults } from "@/features/route-search/presentation/route-results";
import { formatDuration } from "@/shared/domain/route-values";
import { Breadcrumbs, FaqAccordion, PageHero, StatGrid } from "@/shared/ui";
import type { RoutePageModel } from "../domain/route-page-model";
import "./route-page.css";

export function RoutePageScreen({ model, routes, filterValues }: { model: RoutePageModel; routes: RouteSearchModel; filterValues: RouteFilterValues }) {
  const origin = model.route.origin;
  const destination = model.route.destination;
  const clearHref = `/flights/${origin.slug}-to-${destination.slug}`;
  return <main className="pseo-page route-page"><div className="pseo-container">
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: `Flights from ${origin.name}`, href: `/flights-from/${origin.slug}` }, { label: `${origin.name} to ${destination.name}` }]} />
    <PageHero eyebrow="City-pair route" title={model.seo.h1} intro={model.seo.intro} />
    <StatGrid items={[{ label: "Nonstop options", value: model.summary.directOptions }, { label: "Connecting options", value: model.summary.indirectOptions }, { label: "Fastest nonstop", value: model.summary.fastestDirectMinutes === null ? "Unknown" : formatDuration(model.summary.fastestDirectMinutes) }, { label: "Fastest connection", value: model.summary.fastestIndirectMinutes === null ? "Unknown" : formatDuration(model.summary.fastestIndirectMinutes) }]} />
    <section className="route-workspace pseo-section">
      <MasterRouteFilter fields={ROUTE_PAGE_FILTER_FIELDS} values={filterValues} facets={routes.facets} clearHref={clearHref} nextCursor={getUsableNextCursor({ total: routes.total, pageSize: routes.pageSize, optionCount: routes.options.length, nextCursor: routes.nextCursor })} heading="Find the flight option that fits" />
      <div><h2>Flight options from {origin.name} to {destination.name}</h2><RouteResults model={routes} /></div>
    </section>
    {model.sections.length ? <section className="pseo-section"><h2>Plan your {origin.name}–{destination.name} journey</h2><div className="route-facts">{model.sections.map((section) => <article key={section.type}><h3>{section.heading}</h3><p>{section.body}</p></article>)}{model.facts.map((fact) => <article key={fact.type}><h3>{fact.title}</h3><p>{fact.body}</p>{fact.sourceUrl ? <a href={fact.sourceUrl} rel="noreferrer">Official source</a> : null}</article>)}</div></section> : null}
    {model.affiliateOffers.length ? <section className="pseo-section"><h2>Sponsored Travel Services</h2><p>{model.affiliateDisclosure}</p>{model.affiliateOffers.map((offer) => <a key={offer.href} href={offer.href} rel="sponsored nofollow">{offer.title}</a>)}</section> : null}
    <FaqAccordion items={model.faqs} />
  </div></main>;
}
