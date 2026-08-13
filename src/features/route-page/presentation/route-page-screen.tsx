import { Breadcrumbs, FaqAccordion, PageHero } from "@/shared/ui";
import type { RoutePageModel } from "../domain/route-page-model";
import { ObservedPriceCard } from "./observed-price-card";
import "./route-page.css";

export function RoutePageScreen({ model }: { model: RoutePageModel }) {
  const origin=model.route.origin,destination=model.route.destination;
  return <main className="pseo-page route-page"><div className="pseo-container">
    <Breadcrumbs items={[{label:"Home",href:"/"},{label:`Flights from ${origin.name}`,href:`/flights-from/${origin.slug}`},{label:`${origin.name} to ${destination.name}`}]}/>
    <PageHero eyebrow="City-pair route" title={model.seo.h1} intro={model.seo.intro}/>
    <section className="pseo-section observed-prices"><h2>Recent price observations</h2>
      {model.observedPrices.length?<><div>{model.observedPrices.slice(0,3).map(price=><ObservedPriceCard key={price.id} price={price}/>)}</div><p>{model.affiliateDisclosure}</p></>:<p>No recent price observation is available. Check again after the next provider refresh.</p>}
    </section>
    {model.sections.length?<section className="pseo-section"><h2>Plan your {origin.name}–{destination.name} journey</h2><div className="route-facts">{model.sections.map(section=><article key={section.type}><h3>{section.heading}</h3><p>{section.body}</p></article>)}{model.facts.map(fact=><article key={fact.type}><h3>{fact.title}</h3><p>{fact.body}</p>{fact.sourceUrl?<a href={fact.sourceUrl} rel="noreferrer">Official source</a>:null}</article>)}</div></section>:null}
    <FaqAccordion items={model.faqs}/>
  </div></main>;
}
