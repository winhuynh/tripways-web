import { Breadcrumbs, FaqAccordion, FreshnessBadge, InternalLinkGroups, PageHero, StatGrid } from "@/shared/ui";
import type { RouteSearchModel } from "@/features/route-search/domain/route-search-model";
import { AIRPORT_ROUTE_FILTER_FIELDS, getUsableNextCursor, type RouteFilterValues } from "@/features/route-search/domain/route-filter";
import { MasterRouteFilter } from "@/features/route-search/presentation/master-route-filter";
import { RouteResults } from "@/features/route-search/presentation/route-results";

import type { AirportPageModel, JourneyStep } from "../domain/airport-page-model";
import "./airport-page.css";

export function AirportPageScreen({ model, routes, filterValues, clearHref }: { model: AirportPageModel; routes: RouteSearchModel; filterValues: RouteFilterValues; clearHref: string }) {
  const code=model.airport.iata;
  return <main className="pseo-page airport-page"><div className="pseo-container">
    <Breadcrumbs items={[{label:model.airport.country.name,href:"/"},{label:model.airport.city.name,href:`/flights-from/${model.airport.city.slug}`},{label:code}]} />
    <PageHero eyebrow={code} title={model.seo.h1} intro={model.orientation.intro} meta={model.provenance.freshnessAt?<FreshnessBadge value={formatDate(model.provenance.freshnessAt)}/>:null}/>
    <div className="airport-actions"><a href="#arriving">I&apos;m arriving</a><a href="#departing">I&apos;m departing</a></div>
    <nav className="airport-anchor-nav" aria-label="Airport guide sections"><a href="#arriving">Arriving</a><a href="#transport">Transport</a><a href="#departing">Departing</a><a href="#direct-flights">Direct flights</a><a href="#terminals">Terminals</a><a href="#facilities">Facilities</a></nav>
    <StatGrid items={[{label:"Default transport",value:model.quickAnswers.defaultTransport??"Unknown"},{label:"Time to centre",value:model.quickAnswers.transportMinutes?`${model.quickAnswers.transportMinutes.min}–${model.quickAnswers.transportMinutes.max} min`:"Unknown"},{label:"Distance to centre",value:model.quickAnswers.cityDistanceKm===null?"Unknown":`${model.quickAnswers.cityDistanceKm} km`},{label:"Terminals",value:model.quickAnswers.terminalCount}]}/>
    <JourneySection id="arriving" title={`Arriving at ${code}`} summary={model.arrival.summary} steps={model.arrival.steps}/>
    <section id="transport" className="pseo-section"><h2>{code} to central {model.airport.city.name}</h2><div className="airport-card-grid">{model.transport.map(option=><article key={`${option.type}:${option.name}`}><p className="pseo-eyebrow">{option.type}</p><h3>{option.name}</h3><p>{option.summary}</p><dl><dt>Typical time</dt><dd>{option.duration.minMinutes??"?"}–{option.duration.maxMinutes??"?"} min</dd><dt>Estimated price</dt><dd>{option.price.min===null?"Unknown":`${option.price.min}–${option.price.max} ${option.price.currency}`}</dd></dl></article>)}</div></section>
    <JourneySection id="departing" title={`Departing from ${code}`} summary={model.departure.summary} steps={model.departure.steps}/>
    <section id="direct-flights" className="pseo-section airport-flight-explorer"><h2>Verified direct flights to and from {code}</h2><p>Search direct routes in either direction using verified route data.</p><MasterRouteFilter fields={AIRPORT_ROUTE_FILTER_FIELDS} values={filterValues} facets={routes.facets} clearHref={clearHref} nextCursor={getUsableNextCursor({total:routes.total,pageSize:routes.pageSize,optionCount:routes.options.length,nextCursor:routes.nextCursor})} airportCode={code} heading="Filter direct flights"/><RouteResults model={routes}/></section>
    {model.terminals.length?<section id="terminals" className="pseo-section"><h2>Terminals &amp; connections</h2><div className="airport-card-grid">{model.terminals.map(item=><article key={item.code}><p className="pseo-eyebrow">{item.code}</p><h3>{item.name}</h3></article>)}</div></section>:null}
    {model.facilities.length?<section id="facilities" className="pseo-section"><h2>Useful facilities</h2><div className="airport-card-grid">{model.facilities.map(item=><article key={`${item.category}:${item.name}`}><p className="pseo-eyebrow">{item.category}</p><h3>{item.name}</h3><p>{item.summary}</p></article>)}</div></section>:null}
    <FaqAccordion items={model.faqs}/><InternalLinkGroups groups={model.links}/>
    <aside className="airport-provenance"><strong>About this airport data</strong><p>{model.orientation.summary}</p>{model.provenance.freshnessAt?<FreshnessBadge value={formatDate(model.provenance.freshnessAt)}/>:null}</aside>
  </div></main>;
}

function JourneySection({id,title,summary,steps}:{id:string;title:string;summary:string;steps:JourneyStep[]}){return <section id={id} className="pseo-section"><h2>{title}</h2><p>{summary}</p><ol className="airport-steps">{steps.map((step,index)=><li key={`${step.audience}:${step.title}`}><span>{index+1}</span><div><p className="pseo-eyebrow">{step.audience}</p><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></section>}
function formatDate(value:string){return new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(value))}
