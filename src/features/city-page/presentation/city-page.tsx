import { Suspense } from "react";

import {
  RouteInformationDisclaimer,
  SiteFooter,
  SiteHeader,
} from "@/shared/ui";

import type { CityOverview, CityPageIdentity } from "../domain/models";
import type { CityPageSearchParameters } from "../application/city-page-query";
import { cityPage } from "../server";
import { CityHero } from "./city-hero";
import {
  CityAirportsLoader,
  CityAlternateOriginsLoader,
  CityDestinationsLoader,
  CityFaqLoader,
  CityFilterLoader,
  CityInsightsLoader,
  CityLinksLoader,
  CityRouteMapLoader,
  CityRouteSearchLoader,
} from "./city-page-sections";
import { SectionFallback } from "./section-state";

/**
 * Composes one dynamic City Hub from a required overview and independently
 * suspended optional read models. The shared internal-link promise prevents
 * duplicate Edge requests while each visual projection retains its own
 * loading boundary.
 */
export function CityPage({
  filters,
  identity,
  overview,
}: {
  filters: CityPageSearchParameters;
  identity: CityPageIdentity;
  overview: CityOverview;
}) {
  const internalLinksPromise = cityPage.getInternalLinks(identity);

  return (
    <div className="city-editorial-shell">
      <SiteHeader />
      <main className="page-shell city-page">
        <CityHero overview={overview} />
        <Suspense fallback={<SectionFallback label="route search" />}>
          <CityRouteSearchLoader
            cityName={overview.city.name}
            identity={identity}
          />
        </Suspense>
        <Suspense fallback={<SectionFallback label="route map" />}>
          <CityRouteMapLoader filters={filters} identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="route filters" />}>
          <CityFilterLoader filters={filters} identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="destinations" />}>
          <CityDestinationsLoader
            cityName={overview.city.name}
            filters={filters}
            identity={identity}
          />
        </Suspense>
        <Suspense fallback={<SectionFallback label="travel insights" />}>
          <CityInsightsLoader
            cityName={overview.city.name}
            identity={identity}
          />
        </Suspense>
        <Suspense fallback={<SectionFallback label="airport hubs" />}>
          <CityAirportsLoader identity={identity} overview={overview} />
        </Suspense>
        <Suspense
          fallback={<SectionFallback label="alternate departure cities" />}
        >
          <CityAlternateOriginsLoader
            cityName={overview.city.name}
            resultPromise={internalLinksPromise}
          />
        </Suspense>
        <Suspense
          fallback={<SectionFallback label="frequently asked questions" />}
        >
          <CityFaqLoader identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="related routes" />}>
          <CityLinksLoader resultPromise={internalLinksPromise} />
        </Suspense>
      </main>
      <RouteInformationDisclaimer />
      <SiteFooter />
    </div>
  );
}
