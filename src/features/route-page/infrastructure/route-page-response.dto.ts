import type {
  ObservedPrice,
  RouteAffiliateOffer,
  RouteInternalLinkGroup,
  RoutePageModel,
  RouteRecommendation,
} from "../domain/route-page-model";

export function parseRoutePageResponse(
  value: unknown,
  meta?: { canonicalPath?: string; freshnessAt?: string; sourceFreshnessAt?: string },
): RoutePageModel {
  try {
    const root = record(value);
    const route = record(root.route);
    const origin = record(route.origin);
    const destination = record(route.destination);

    const originModel = {
      name: text(origin.name),
      slug: text(origin.slug),
      iataCode: optionalText(origin.iata_code) ?? optionalText(origin.iata) ?? undefined,
      latitude: optionalNumber(origin.latitude) ?? undefined,
      longitude: optionalNumber(origin.longitude) ?? undefined,
    };

    const destinationModel = {
      name: text(destination.name),
      slug: text(destination.slug),
      iataCode: optionalText(destination.iata_code) ?? optionalText(destination.iata) ?? undefined,
      latitude: optionalNumber(destination.latitude) ?? undefined,
      longitude: optionalNumber(destination.longitude) ?? undefined,
    };

    const content = optionalRecord(root.content);
    const contentSeo = optionalRecord(content?.seo);
    const legacySeo = optionalRecord(root.seo);
    const h1 =
      optionalText(contentSeo?.h1) ??
      optionalText(legacySeo?.h1) ??
      `Flights from ${originModel.name} to ${destinationModel.name}`;
    const intro =
      optionalText(content?.intro) ??
      optionalText(legacySeo?.intro) ??
      `Comparing nonstop and connecting flight options from ${originModel.name} to ${destinationModel.name}.`;

    const summary = optionalRecord(root.summary);
    const routeOptions = optionalArray(root.route_options);

    const directRoutes = routeOptions.filter(
      (opt) =>
        typeof opt === "object" &&
        opt !== null &&
        optionalNumber((opt as Record<string, unknown>).stops) === 0,
    );
    const indirectRoutes = routeOptions.filter(
      (opt) =>
        typeof opt === "object" &&
        opt !== null &&
        optionalNumber((opt as Record<string, unknown>).stops) === 1,
    );

    const directOptions =
      optionalNumber(summary?.direct_options) ??
      optionalNumber(summary?.directOptions) ??
      directRoutes.length;
    const indirectOptions =
      optionalNumber(summary?.indirect_options) ??
      optionalNumber(summary?.indirectOptions) ??
      indirectRoutes.length;

    const fastestDirectMinutes =
      nullableNumber(summary?.fastest_direct_minutes) ??
      nullableNumber(summary?.fastestDirectMinutes) ??
      (directRoutes.length > 0
        ? Math.min(
            ...directRoutes.map(
              (r) =>
                optionalNumber(
                  (r as Record<string, unknown>).total_duration_minutes,
                ) ?? 9999,
            ),
          )
        : null);

    const fastestIndirectMinutes =
      nullableNumber(summary?.fastest_indirect_minutes) ??
      nullableNumber(summary?.fastestIndirectMinutes) ??
      (indirectRoutes.length > 0
        ? Math.min(
            ...indirectRoutes.map(
              (r) =>
                optionalNumber(
                  (r as Record<string, unknown>).total_duration_minutes,
                ) ?? 9999,
            ),
          )
        : null);

    const weeklyDirectFlights =
      optionalNumber(summary?.weekly_direct_flights) ??
      optionalNumber(summary?.weekly_flights) ??
      optionalNumber(summary?.weeklyDirectFlights) ??
      (directRoutes.length > 0
        ? directRoutes.reduce(
            (sum: number, r: unknown) =>
              sum +
              (optionalArray((r as Record<string, unknown>).days_of_week)
                .length || 7),
            0,
          )
        : null);



    const observedPrices = optionalArray(root.observations).map(parseObservation);

    // Calculate or parse minimum fare
    const minFareObj = optionalRecord(summary?.min_fare) ?? optionalRecord(summary?.minFare);
    let minFare: { amount: number; currency: string } | null = null;
    if (minFareObj) {
      minFare = {
        amount: number(minFareObj.amount),
        currency: text(minFareObj.currency),
      };
    } else if (observedPrices.length > 0) {
      const sortedByPrice = [...observedPrices].sort((a, b) => a.amount - b.amount);
      const lowest = sortedByPrice[0]!;
      minFare = { amount: lowest.amount, currency: lowest.currencyCode };
    }

    // Parse or build recommendations
    const rawRecommendations = optionalArray(root.recommendations);
    const recommendations: RouteRecommendation[] =
      rawRecommendations.length > 0
        ? rawRecommendations.map(parseRecommendation)
        : buildDefaultRecommendations({
            originName: originModel.name,
            destinationName: destinationModel.name,
            directOptions,
            fastestDirectMinutes,
            observedPrices,
          });

    const links: RouteInternalLinkGroup[] = optionalArray(
      root.internal_link_groups ?? root.links,
    ).map(parseLinkGroup);

    return {
      route: {
        origin: originModel,
        destination: destinationModel,
        distanceMiles:
          optionalNumber(route.distance_miles) ??
          optionalNumber(root.distance_miles) ??
          null,
        distanceKm:
          optionalNumber(route.distance_km) ??
          optionalNumber(root.distance_km) ??
          null,
      },
      seo: {
        h1,
        subheadline:
          optionalText(legacySeo?.subheadline) ??
          "Compare recent route observations",
        title: optionalText(legacySeo?.title) ?? h1,
        description:
          optionalText(legacySeo?.meta_description) ??
          optionalText(contentSeo?.description) ??
          intro,
        intro,
        isIndexable: optionalBoolean(root.is_indexable) ?? true,
        noindexReason: optionalText(root.noindex_reason) ?? undefined,
      },
      summary: {
        directOptions,
        indirectOptions,
        fastestDirectMinutes,
        fastestIndirectMinutes,
        weeklyDirectFlights,
        minFare,
      },
      recommendations,
      facts: optionalArray(root.travel_facts).map(parseFact),
      sections: optionalArray(root.editorial_sections).map(parseSection),
      faqs: optionalArray(root.faqs).map(parseFaq),
      affiliateOffers: optionalArray(
        optionalRecord(root.affiliate)?.offers ?? root.affiliate_offers,
      ).map(parseOffer),
      affiliateDisclosure:
        optionalText(optionalRecord(root.affiliate)?.disclosure) ??
        optionalText(root.affiliate_disclosure) ??
        optionalText(root.disclosure) ??
        "Cached prices are not live offers; final price and availability are confirmed by the booking partner.",
      observedPrices,
      links: links.length > 0 ? links : undefined,
      freshnessAt:
        meta?.freshnessAt ??
        meta?.sourceFreshnessAt ??
        optionalText(root.freshness_at) ??
        optionalText(root.source_freshness_at),
      canonicalPath: meta?.canonicalPath ?? optionalText(root.canonical_path),
    };
  } catch {
    throw new Error("ERR_ROUTE_PAGE_CONTRACT");
  }
}

function buildDefaultRecommendations({
  originName,
  destinationName,
  directOptions,
  fastestDirectMinutes,
  observedPrices,
}: {
  originName: string;
  destinationName: string;
  directOptions: number;
  fastestDirectMinutes: number | null;
  observedPrices: readonly ObservedPrice[];
}): RouteRecommendation[] {
  const list: RouteRecommendation[] = [];

  if (directOptions > 0 && fastestDirectMinutes) {
    const hours = Math.floor(fastestDirectMinutes / 60);
    const mins = fastestDirectMinutes % 60;
    const durStr = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    list.push({
      badge: "FASTEST OPTION",
      variant: "fastest",
      title: `${durStr} direct (${originName} to ${destinationName})`,
    });
  }

  if (observedPrices.length > 0) {
    const lowest = [...observedPrices].sort((a, b) => a.amount - b.amount)[0]!;
    list.push({
      badge: "LOWEST FARE",
      variant: "lowest",
      title: `${lowest.currencyCode} ${lowest.amount.toLocaleString("en-GB")} (${lowest.direct ? "direct" : "connecting"})`,
    });
  }

  return list;
}

function parseObservation(value: unknown): ObservedPrice {
  const row = record(value);
  return {
    reference: observationReference(row.observation_ref),
    amount: number(row.observed_amount),
    currencyCode: text(row.currency_code),
    departureDate: nullableText(row.departure_date),
    direct: nullableBoolean(row.direct),
    observedAt: text(row.observed_at),
    validUntil: text(row.valid_until),
  };
}

function parseFact(value: unknown) {
  const row = record(value);
  return {
    type: text(row.fact_type ?? row.type),
    title: text(row.title),
    body: text(row.body),
    ...(typeof row.primary_source_url === "string"
      ? { sourceUrl: row.primary_source_url }
      : {}),
  };
}

function parseSection(value: unknown) {
  const row = record(value);
  return {
    type: text(row.section_type ?? row.type),
    heading: text(row.heading),
    body: text(row.body),
  };
}

function parseFaq(value: unknown) {
  const row = record(value);
  return {
    question: text(row.question),
    answer: text(row.answer),
  };
}

function parseOffer(value: unknown): RouteAffiliateOffer {
  const row = record(value);
  return {
    title: text(row.title),
    href: text(row.href),
    type: (optionalText(row.type) as RouteAffiliateOffer["type"]) ?? undefined,
    description: optionalText(row.description) ?? undefined,
  };
}

function parseRecommendation(value: unknown): RouteRecommendation {
  const row = record(value);
  return {
    badge: text(row.badge),
    title: text(row.title),
    variant: (optionalText(row.variant) as RouteRecommendation["variant"]) ?? "default",
    description: optionalText(row.description) ?? undefined,
  };
}

function parseLinkGroup(value: unknown): RouteInternalLinkGroup {
  const row = record(value);
  return {
    title: text(row.title ?? row.cluster),
    links: optionalArray(row.links).map((l) => {
      const link = record(l);
      return {
        label: text(link.label ?? link.anchor_text),
        href: text(link.href ?? link.path),
        secondaryText: optionalText(link.secondary_text) ?? undefined,
      };
    }),
  };
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw 0;
  return value as Record<string, unknown>;
}

function optionalRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function optionalArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(value: unknown): string {
  if (typeof value !== "string" || !value) throw 0;
  return value;
}

function optionalText(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function nullableText(value: unknown): string | null {
  return value === null || value === undefined ? null : text(value);
}

function number(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw 0;
  return value;
}

function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nullableNumber(value: unknown): number | null {
  return value === null || value === undefined ? null : number(value);
}

function nullableBoolean(value: unknown): boolean | null {
  return value === null || value === undefined
    ? null
    : typeof value === "boolean"
      ? value
      : (() => {
          throw 0;
        })();
}

function optionalBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function observationReference(value: unknown): string {
  const reference = text(value);
  if (!/^obs_[0-9a-f]{32}$/.test(reference)) throw 0;
  return reference;
}
