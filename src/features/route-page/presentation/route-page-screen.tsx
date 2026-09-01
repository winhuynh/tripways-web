import { AdSlot } from "@/features/advertising";
import {
  getUsableNextCursor,
  ROUTE_PAGE_FILTER_FIELDS,
  type RouteFilterValues,
} from "@/features/route-search/domain/route-filter";
import type { RouteSearchModel } from "@/features/route-search/domain/route-search-model";
import { RouteResults } from "@/features/route-search/presentation/route-results";
import { formatDuration } from "@/shared/domain/route-values";
import {
  Breadcrumbs,
  FactBadgesBar,
  type FactBadgeItem,
  FaqAccordion,
  FlightOptionCard,
  InternalLinkGroups,
  MasterRouteFilter,
  PageHero,
  PracticalPlanningGrid,
  RecommendationHighlights,
  RouteInformationDisclaimer,
  SponsoredTravelServices,
} from "@/shared/ui";
import type { RoutePageModel } from "../domain/route-page-model";
import { RouteFlightMap } from "./route-flight-map";
import "./route-page.css";

type RoutePageScreenProps = {
  model: RoutePageModel;
  routes?: RouteSearchModel;
  filterValues?: RouteFilterValues;
};

export function RoutePageScreen({
  model,
  routes,
  filterValues = {},
}: RoutePageScreenProps) {
  const origin = model.route.origin;
  const destination = model.route.destination;
  const clearHref = `/flights/${origin.slug}-to-${destination.slug}`;

  const verifiedDate = model.freshnessAt
    ? new Date(model.freshnessAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "August 2026";

  // Build fact badges for hero
  const factBadges: FactBadgeItem[] = [];

  // 1. Direct status badge
  if (model.summary.directOptions > 0) {
    factBadges.push({
      icon: "plane",
      label: "Nonstop available",
      highlight: true,
    });
  } else {
    factBadges.push({
      icon: "plane",
      label: "Connecting flights only",
    });
  }

  // 2. Typical / fastest duration
  if (model.summary.fastestDirectMinutes) {
    factBadges.push({
      icon: "clock",
      label: `${formatDuration(model.summary.fastestDirectMinutes)} typical`,
    });
  } else if (model.summary.fastestIndirectMinutes) {
    factBadges.push({
      icon: "clock",
      label: `From ${formatDuration(model.summary.fastestIndirectMinutes)}`,
    });
  }

  // 3. Frequency
  if (model.summary.weeklyDirectFlights && model.summary.weeklyDirectFlights > 0) {
    factBadges.push({
      icon: "calendar",
      label: `${model.summary.weeklyDirectFlights} weekly flights`,
    });
  }

  // 4. Distance
  if (model.route.distanceMiles && model.route.distanceKm) {
    factBadges.push({
      icon: "route",
      label: `${model.route.distanceMiles.toLocaleString("en-GB")} mi (${model.route.distanceKm.toLocaleString("en-GB")} km)`,
    });
  } else {
    factBadges.push({
      icon: "route",
      label: "Long-haul flight",
    });
  }

  const visibleOptions = routes?.options;
  const directOptions = visibleOptions
    ? visibleOptions.filter((option) => option.stops === 0).length
    : model.summary.directOptions;
  const indirectOptions = visibleOptions
    ? visibleOptions.filter((option) => option.stops > 0).length
    : model.summary.indirectOptions;
  const availableOptions = visibleOptions?.filter(
    (option) => option.price.state === "available",
  );
  const lowestVisibleOption = availableOptions?.reduce(
    (lowest, option) =>
      lowest === undefined ||
      (option.price.state === "available" &&
        lowest.price.state === "available" &&
        option.price.priceMin < lowest.price.priceMin)
        ? option
        : lowest,
    undefined as RouteSearchModel["options"][number] | undefined,
  );
  const visibleMinFare =
    lowestVisibleOption?.price.state === "available"
      ? {
          amount: lowestVisibleOption.price.priceMin,
          currency: lowestVisibleOption.price.currencyCode,
        }
      : model.summary.minFare;
  const totalOptions = visibleOptions?.length ?? directOptions + indirectOptions;
  const minFareDisplay = visibleMinFare
    ? ` from ${visibleMinFare.currency === "GBP" ? "£" : visibleMinFare.currency}${visibleMinFare.amount}`
    : "";
  const mapOverlayText = `Showing ${totalOptions} flight ${totalOptions === 1 ? "option" : "options"}: ${directOptions} nonstop, ${indirectOptions} connecting${minFareDisplay}`;
  const recommendations: RoutePageModel["recommendations"] = visibleOptions
    ? buildFilteredRecommendations(visibleOptions)
    : model.recommendations;

  return (
    <main className="pseo-page route-page-main">
      <div className="pseo-container">
        {/* 1. Breadcrumbs (Shared component) */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            {
              label: `Flights from ${origin.name}`,
              href: `/flights-from/${origin.slug}`,
            },
            { label: `${origin.name} to ${destination.name}` },
          ]}
        />

        {/* 2. Editorial Hero (Shared component with FactBadgesBar) */}
        <PageHero
          eyebrow="CITY-PAIR ROUTE"
          title={model.seo.h1}
          intro={model.seo.intro}
          meta={
            <FactBadgesBar
              items={factBadges}
              verifiedDate={verifiedDate}
            />
          }
        />

        {/* 3. Main Discovery: 2-Column Section (Sidebar Filter + Map & Cards) */}
        <section
          className="route-discovery-layout pseo-section"
          aria-label="Flight options and comparison"
        >
          {/* Left Sidebar Filter (Shared MasterRouteFilter) */}
          <div className="route-sidebar-wrap">
            <MasterRouteFilter
              fields={ROUTE_PAGE_FILTER_FIELDS}
              values={filterValues}
              facets={routes?.facets ?? { stops: [], countries: [], regions: [], airlines: [], connections: [] }}
              clearHref={clearHref}
              nextCursor={
                routes
                  ? getUsableNextCursor({
                      total: routes.total,
                      pageSize: routes.pageSize,
                      optionCount: routes.options.length,
                      nextCursor: routes.nextCursor,
                    })
                  : null
              }
              heading="Find the flight option that fits"
            />
          </div>

          {/* Right Main Column: Map + Flight Options Cards + Recommendations + Ad */}
          <div className="route-main-content">
            {/* Interactive Flight Map with Floating Overlay */}
            <RouteFlightMap
              origin={origin}
              destination={destination}
              overlayText={mapOverlayText}
            />

            {/* Flight Options List */}
            <div className="route-options-section">
              <div className="route-options-header">
                <h2 className="route-options-title">
                  Flight options from {origin.name} to {destination.name}
                </h2>
              </div>

              {routes && routes.options.length > 0 ? (
                <div className="route-cards-list">
                  {routes.options.map((option) => (
                    <FlightOptionCard
                      key={option.id}
                      option={{
                        id: option.id,
                        from: option.from,
                        to: option.to,
                        stops: option.stops,
                        connectionAirport: option.connections?.[0] ?? null,
                        durationMinutes: option.durationMinutes,
                        airlines: option.airlines,
                        price: option.price,
                        routePath: option.routePath,
                      }}
                    />
                  ))}
                </div>
              ) : routes ? (
                <RouteResults
                  model={routes}
                  filterValues={filterValues}
                  clearHref={clearHref}
                />
              ) : (
                <div className="route-cards-empty">
                  <p>No verified flight options match the selected filters.</p>
                  <a href={clearHref} className="route-cards-empty__reset">
                    Reset filters to view all options
                  </a>
                </div>
              )}
            </div>

            {/* Recommendations (Shared RecommendationHighlights) */}
            {recommendations && recommendations.length > 0 && (
              <RecommendationHighlights items={recommendations} />
            )}

            {/* Advertisement Slot A (Shared AdSlot) */}
            <AdSlot format="leaderboard" placement="route_destination_sidebar" />
          </div>
        </section>

        {/* 4. Practical Route Planning Grid (Shared PracticalPlanningGrid) */}
        {(model.sections.length > 0 || model.facts.length > 0) && (
          <PracticalPlanningGrid
            title={`Plan your ${origin.name} – ${destination.name} journey`}
            sections={model.sections}
            facts={model.facts}
          />
        )}

        {/* 5. Sponsored Travel Services (Shared SponsoredTravelServices) */}
        <SponsoredTravelServices
          offers={model.affiliateOffers.length > 0 ? model.affiliateOffers : undefined}
          destinationCity={destination.name}
          routeLabel={`${origin.name} - ${destination.name}`}
          disclosure={model.affiliateDisclosure}
        />

        {/* 6. FAQ Accordion (Shared FaqAccordion) */}
        {model.faqs.length > 0 && <FaqAccordion items={model.faqs} />}

        {/* 7. Internal Link Groups (Shared InternalLinkGroups) */}
        {model.links && model.links.length > 0 && (
          <InternalLinkGroups groups={model.links} />
        )}

        {/* 8. Disclaimer (Shared RouteInformationDisclaimer) */}
        <RouteInformationDisclaimer />
      </div>
    </main>
  );
}

function buildFilteredRecommendations(
  options: RouteSearchModel["options"],
): NonNullable<RoutePageModel["recommendations"]> {
  if (options.length === 0) return [];

  const fastest = options.reduce((current, option) =>
    option.durationMinutes < current.durationMinutes ? option : current,
  );
  const recommendations: NonNullable<RoutePageModel["recommendations"]> = [
    {
      badge: "FASTEST OPTION",
      variant: "fastest",
      title: `${formatDuration(fastest.durationMinutes)} ${fastest.stops === 0 ? "direct" : `${fastest.stops}-stop`} (${fastest.from} to ${fastest.to})`,
    },
  ];

  let lowest: RouteSearchModel["options"][number] | undefined;
  for (const option of options) {
    if (option.price.state !== "available") continue;
    if (
      lowest === undefined ||
      lowest.price.state !== "available" ||
      option.price.priceMin < lowest.price.priceMin
    ) {
      lowest = option;
    }
  }

  if (lowest?.price.state === "available") {
    recommendations.push({
      badge: "LOWEST FARE",
      variant: "lowest",
      title: `${lowest.price.currencyCode} ${lowest.price.priceMin.toLocaleString("en-GB")} (${lowest.stops === 0 ? "nonstop" : "connecting"})`,
    });
  }

  return recommendations;
}
