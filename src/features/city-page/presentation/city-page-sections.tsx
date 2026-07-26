import { Suspense } from "react";

import { AdSlot } from "@/features/advertising";
import { RouteMap } from "@/features/route-map";
import { routeMap } from "@/features/route-map/server";

import {
  createCityDestinationQuery,
  readSelectedCityFilters,
} from "../application/city-page-query";
import type {
  CityOverview,
  CityPageIdentity,
} from "../domain/models";
import { cityPage } from "../server";
import { buildCityRouteMapQuery } from "../application/build-city-route-map-query";
import { CityAirportsSection } from "./city-airports-section";
import { CityAlternateOriginsSection } from "./city-alternate-origins-section";
import { CityDestinationsSection } from "./city-destinations-section";
import { CityFilterToolbar, CityRouteSearch } from "./city-discovery-tools";
import { CityFaqSection, FaqStructuredData } from "./city-faq-section";
import { CityInsightsSection } from "./city-insights-section";
import { CityLinksSection } from "./city-links-section";
import {
  CityQuickFactsFallback,
  CityQuickFactsSection,
  CityQuickFactsUnavailable,
} from "./city-quick-facts-section";
import { SectionUnavailable } from "./section-state";

type SearchParameters = Record<
  string,
  string | string[] | undefined
>;

type InternalLinksPromise = ReturnType<typeof cityPage.getInternalLinks>;

/**
 * Loads airport navigation options independently from destination results and
 * renders the route-search UI even when airport metadata is unavailable.
 */
export async function CityRouteSearchLoader({
  cityName,
  identity,
}: {
  cityName: string;
  identity: CityPageIdentity;
}) {
  const result = await cityPage.getAirports(identity);

  return (
    <CityRouteSearch
      airports={result.status === "available" ? result.data : []}
      cityName={cityName}
    />
  );
}

/**
 * Loads the reusable route-map read model with the current URL filters. Map
 * failures remain local so the rest of the pSEO page can still render.
 */
export async function CityRouteMapLoader({
  filters,
  identity,
}: {
  filters: SearchParameters;
  identity: CityPageIdentity;
}) {
  const result = await routeMap.getRouteMap(
    buildCityRouteMapQuery(identity, filters),
  );

  if (result.status !== "available") {
    return <SectionUnavailable title="Direct route map" />;
  }

  return (
    <section className="city-route-map">
      <RouteMap readModel={result.data} />
    </section>
  );
}

/**
 * Loads airport options and the filtered destination total together so the
 * toolbar always describes the same destination query as the result grid.
 */
export async function CityFilterLoader({
  filters,
  identity,
}: {
  filters: SearchParameters;
  identity: CityPageIdentity;
}) {
  const [airports, destinations] = await Promise.all([
    cityPage.getAirports(identity),
    cityPage.getDestinations(createCityDestinationQuery(identity, filters)),
  ]);

  if (
    airports.status !== "available" ||
    destinations.status !== "available"
  ) {
    return null;
  }

  const selected = readSelectedCityFilters(filters);

  return (
    <CityFilterToolbar
      airports={airports.data}
      selectedAirport={selected.airport}
      selectedDeparture={selected.departure}
      selectedDuration={selected.duration}
      total={destinations.data.total}
    />
  );
}

/**
 * Loads the destination catalogue and isolates the Quick Facts read model in
 * a nested Suspense boundary so sidebar failure cannot block route cards.
 */
export async function CityDestinationsLoader({
  cityName,
  filters,
  identity,
}: {
  cityName: string;
  filters: SearchParameters;
  identity: CityPageIdentity;
}) {
  const result = await cityPage.getDestinations(
    createCityDestinationQuery(identity, filters),
  );

  if (result.status === "unavailable") {
    return <SectionUnavailable title={`Destinations from ${cityName}`} />;
  }

  if (result.status === "empty") {
    return (
      <section className="section-card section-message">
        <h2>No matching destinations</h2>
      </section>
    );
  }

  return (
    <CityDestinationsSection
      cityName={cityName}
      quickFactsSlot={
        <Suspense fallback={<CityQuickFactsFallback />}>
          <CityQuickFactsLoader cityName={cityName} identity={identity} />
        </Suspense>
      }
      result={result.data}
    />
  );
}

/**
 * Loads the dedicated Quick Facts projection used by the destination sidebar.
 */
export async function CityQuickFactsLoader({
  cityName,
  identity,
}: {
  cityName: string;
  identity: CityPageIdentity;
}) {
  const result = await cityPage.getQuickFacts(identity);

  if (result.status !== "available") {
    return <CityQuickFactsUnavailable />;
  }

  return (
    <CityQuickFactsSection cityName={cityName} quickFacts={result.data} />
  );
}

/**
 * Loads aggregate route insights without coupling them to destination cards.
 */
export async function CityInsightsLoader({
  cityName,
  identity,
}: {
  cityName: string;
  identity: CityPageIdentity;
}) {
  const result = await cityPage.getInsights(identity);

  if (result.status !== "available") {
    return <SectionUnavailable title={`${cityName} travel insights`} />;
  }

  return <CityInsightsSection cityName={cityName} insights={result.data} />;
}

/**
 * Loads airport route statistics and combines them with the reviewed airport
 * summary already present in the required overview model.
 */
export async function CityAirportsLoader({
  identity,
  overview,
}: {
  identity: CityPageIdentity;
  overview: CityOverview;
}) {
  const result = await cityPage.getAirports(identity);

  if (result.status !== "available") {
    return <SectionUnavailable title="Direct flight hubs" />;
  }

  return (
    <CityAirportsSection
      airportSummary={overview.content.airportSummary}
      airports={result.data}
      cityName={overview.city.name}
    />
  );
}

/**
 * Projects the shared internal-link read model into alternate departure city
 * cards. Empty or unavailable link graphs intentionally omit this section.
 */
export async function CityAlternateOriginsLoader({
  cityName,
  resultPromise,
}: {
  cityName: string;
  resultPromise: InternalLinksPromise;
}) {
  const result = await resultPromise;

  if (result.status !== "available") return null;

  return (
    <CityAlternateOriginsSection cityName={cityName} groups={result.data} />
  );
}

/**
 * Loads reviewed FAQ copy, its structured data, and the reserved post-FAQ ad
 * placement as one semantic section.
 */
export async function CityFaqLoader({
  identity,
}: {
  identity: CityPageIdentity;
}) {
  const result = await cityPage.getFaqs(identity);

  if (result.status !== "available") {
    return <SectionUnavailable title="Frequently asked questions" />;
  }

  return (
    <>
      <CityFaqSection faqs={result.data} />
      <AdSlot format="leaderboard" placement="city_after_faq" />
      <FaqStructuredData faqs={result.data} />
    </>
  );
}

/**
 * Projects the shared internal-link read model into crawlable route
 * directories while preserving an unavailable state for transport failures.
 */
export async function CityLinksLoader({
  resultPromise,
}: {
  resultPromise: InternalLinksPromise;
}) {
  const result = await resultPromise;

  if (result.status !== "available") {
    return <SectionUnavailable title="Related flight pages" />;
  }

  return <CityLinksSection groups={result.data} />;
}
