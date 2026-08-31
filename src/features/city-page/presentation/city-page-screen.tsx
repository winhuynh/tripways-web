import { AdSlot } from "@/features/advertising";
import {
  CITY_ROUTE_FILTER_FIELDS,
  getUsableNextCursor,
  type RouteFilterValues,
} from "@/features/route-search/domain/route-filter";
import type { RouteSearchModel } from "@/features/route-search/domain/route-search-model";
import { RouteResults } from "@/features/route-search/presentation/route-results";
import {
  Breadcrumbs,
  FaqAccordion,
  InternalLinkGroups,
  MasterRouteFilter,
  PageHero,
} from "@/shared/ui";
import type { CityPageModel } from "../domain/city-page-model";
import { CityQuickFacts } from "./city-quick-facts";
import { CityRouteMap } from "./city-route-map";
import { CityDestinationsTable } from "./city-destinations-table";
import { CityAirportsComparison } from "./city-airports-comparison";
import { filterCityDestinations } from "../domain/city-page-filters";
import "./city-page.css";

export function CityPageScreen({
  model,
  routes,
  filterValues,
}: {
  model: CityPageModel;
  routes: RouteSearchModel;
  filterValues: RouteFilterValues;
}) {
  const verifiedDate = model.freshnessAt
    ? new Date(model.freshnessAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "August 2026";

  return (
    <main className="pseo-page city-page-main">
      <div className="pseo-container">
        {/* 1. Breadcrumbs (Shared component) */}
        <Breadcrumbs
          items={[
            {
              label: (model.country.region ?? "Asia").toUpperCase(),
              href: "/",
            },
            { label: model.country.name.toUpperCase() },
            { label: model.city.name.toUpperCase() },
          ]}
        />

        {/* 2. Editorial Hero (Shared component) */}
        <PageHero
          title={model.seo.h1}
          intro={model.seo.intro}
          meta={
            <div className="city-hero__verified">
              <span>Data verified {verifiedDate}</span>
            </div>
          }
        />

        {/* 3. Quick Facts Overview Bar */}
        <CityQuickFacts
          destinations={model.quickFacts.destinations}
          countries={model.quickFacts.countries}
          airlines={model.quickFacts.airlines}
          airports={model.quickFacts.airports}
        />

        {/* 4. Main Discovery: 2-Column Section (Sidebar Filter + Map & Table) */}
        <section
          className="city-discovery-layout pseo-section"
          aria-label="Find nonstop flights"
        >
          {/* Left Sidebar Filter (Shared MasterRouteFilter) */}
          <div className="city-sidebar-wrap">
            <MasterRouteFilter
              fields={CITY_ROUTE_FILTER_FIELDS}
              values={filterValues}
              facets={routes.facets}
              departureAirports={model.airports.map((airport) => airport.iata)}
              clearHref={`/flights-from/${model.city.slug}`}
              nextCursor={getUsableNextCursor({
                total: routes.total,
                pageSize: routes.pageSize,
                optionCount: routes.options.length,
                nextCursor: routes.nextCursor,
              })}
              heading="Find the nonstop flight that fits"
            />
          </div>

          {/* Right Main Column: Map + Table */}
          <div className="city-main-content">
            {(() => {
              const filteredDestinations = filterCityDestinations(
                model.destinations,
                filterValues,
                model.country.name,
              );
              return (
                <>
                  <CityRouteMap
                    cityName={model.city.name}
                    destinations={filteredDestinations}
                  />

                  {filteredDestinations.length > 0 ? (
                    <CityDestinationsTable
                      cityName={model.city.name}
                      destinations={filteredDestinations}
                      totalCount={model.quickFacts.destinations}
                    />
                  ) : (
                    <RouteResults
                      model={routes}
                      filterValues={filterValues}
                      clearHref={`/flights-from/${model.city.slug}`}
                    />
                  )}
                </>
              );
            })()}
          </div>
        </section>

        {/* 5. Advertisement Slot */}
        <AdSlot format="leaderboard" placement="city_destination_sidebar" />

        {/* 6. Airport Hub Comparison */}
        <CityAirportsComparison
          cityName={model.city.name}
          airports={model.airports}
        />

        {/* 7. FAQ Accordion */}
        {model.faqs.length > 0 && <FaqAccordion items={model.faqs} />}

        {/* 8. Related Flight Networks & Provenance */}
        {model.links.length > 0 && <InternalLinkGroups groups={model.links} />}
      </div>
    </main>
  );
}
