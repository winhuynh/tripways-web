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
  return (
    <main className="pseo-page city-page-main">
      <div className="pseo-container">
        {/* 1. Breadcrumbs */}
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

        {/* 2. Clean Editorial Hero */}
        <PageHero
          title={model.seo.h1}
          intro={model.seo.intro}
        />

        {/* 3. Quick Facts Overview Bar */}
        <CityQuickFacts
          destinations={model.quickFacts.destinations}
          countries={model.quickFacts.countries}
          airlines={model.quickFacts.airlines}
          airports={model.quickFacts.airports}
        />

        {/* 4. Main Discovery: 2-Column Section (Sticky Sidebar Filter + Map & Table) */}
        <section
          className="city-discovery-layout pseo-section"
          aria-label="Find nonstop flights"
        >
          {/* Left Sidebar Filter */}
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
              const hasActiveFilters = Object.keys(filterValues).some((key) => key !== "after");
              let filteredDestinations = hasActiveFilters
                ? model.destinations.filter((destination) =>
                    routes.options.some(
                      (route) =>
                        destination.originAirports.includes(route.from) &&
                        destination.airports.includes(route.to),
                    ),
                  )
                : model.destinations;

              if (filterValues.counterpart_query) {
                const q = filterValues.counterpart_query.toLowerCase().trim();
                filteredDestinations = filteredDestinations.filter(
                  (d) =>
                    d.city.toLowerCase().includes(q) ||
                    d.country.toLowerCase().includes(q) ||
                    d.airports.some((a) => a.toLowerCase().includes(q)) ||
                    d.originAirports.some((a) => a.toLowerCase().includes(q)),
                );
              }

              return (
                <>
                  <CityRouteMap
                    cityName={model.city.name}
                    destinations={filteredDestinations}
                  />

                  {filteredDestinations.length > 0 ? (
                    <CityDestinationsTable
                      cityName={model.city.name}
                      originCountry={model.country.name}
                      originCountryCode={model.country.code}
                      originAirports={model.airports.map((airport) => airport.iata)}
                      destinations={filteredDestinations}
                      totalCount={model.quickFacts.destinations}
                      clearHref={`/flights-from/${model.city.slug}`}
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

        {/* 5. Airport Hub Comparison */}
        <CityAirportsComparison
          cityName={model.city.name}
          airports={model.airports}
          destinations={model.destinations}
        />

        {/* 7. FAQ Accordion */}
        {model.faqs.length > 0 && <FaqAccordion items={model.faqs} />}

        {/* 8. Related Flight Networks & Provenance */}
        {model.links.length > 0 && <InternalLinkGroups groups={model.links} />}
      </div>
    </main>
  );
}
