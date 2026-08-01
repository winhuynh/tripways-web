import { CityPageError } from "../domain/city-page-error";
import type {
  CityAirline,
  CityAirport,
  CityDestination,
  CityDestinationResult,
  CityFaq,
  CityInsights,
  CityInternalLinkGroup,
  CityOverview,
  CityQuickFacts,
  CityRouteExtreme,
} from "../domain/models";

/**
 * Validates and maps the required City Hub overview Edge envelope.
 */
export function parseCityOverviewResponse(value: unknown): CityOverview {
  const envelope = parseEnvelope(value);
  const data = record(envelope.data);
  const city = record(data.city);
  const country = record(data.country);
  const content = record(data.content);
  const seo = record(data.seo);
  const facts = record(data.quick_facts);

  return {
    city: {
      name: string(city.name),
      slug: string(city.slug),
      latitude: number(city.latitude),
      longitude: number(city.longitude),
      timezone: string(city.timezone),
    },
    country: {
      iso2: string(country.iso2),
      name: string(country.name),
      slug: string(country.slug),
      region: nullableString(country.region),
    },
    content: {
      h1: string(content.h1),
      subheadline: string(content.subheadline),
      intro: string(content.intro),
      airportSummary: string(content.airport_summary),
    },
    seo: {
      title: string(seo.title),
      description: string(seo.description),
      canonicalPath: string(seo.canonical_path),
      ogTitle: string(seo.og_title),
      ogDescription: string(seo.og_description),
      ogImagePath: nullableString(seo.og_image_path),
      isIndexable: boolean(seo.is_indexable),
      noindexReason: nullableString(seo.noindex_reason),
    },
    quickFacts: {
      airportCount: integer(facts.airport_count),
      directDestinationCount: integer(
        facts.direct_destination_count ?? facts.direct_counterpart_city_count,
      ),
      directCountryCount: integer(
        facts.direct_country_count ?? facts.direct_counterpart_country_count,
      ),
      airlineCount: integer(facts.airline_count),
      shortestRouteMinutes: nullableInteger(facts.shortest_route_minutes),
      longestRouteMinutes: nullableInteger(facts.longest_route_minutes),
    },
    dataVersion: string(envelope.meta.data_version),
  };
}

/**
 * Validates and maps airport identities, editorial copy, and route statistics
 * returned by the airport read RPC.
 */
export function parseCityAirportsResponse(value: unknown): readonly CityAirport[] {
  return array(parseEnvelope(value).data).map((item) => {
    const data = record(item);
    return {
      iata: string(data.iata),
      icao: nullableString(data.icao),
      name: string(data.name),
      slug: string(data.slug),
      imagePath: nullableString(data.image_path),
      airportType: string(data.airport_type),
      latitude: number(data.latitude),
      longitude: number(data.longitude),
      timezone: string(data.timezone),
      isPrimary: boolean(data.is_primary),
      hubLabel: nullableString(data.hub_label),
      description: nullableString(data.description),
      displayOrder: nullableInteger(data.display_order),
      directDestinationCount: integer(data.direct_destination_count),
      domesticDestinationCount: integer(data.domestic_destination_count),
      internationalDestinationCount: integer(data.international_destination_count),
      domesticDestinationPercentage: percentage(data.domestic_destination_percentage),
      internationalDestinationPercentage: percentage(data.international_destination_percentage),
      airlineCount: integer(data.airline_count),
      dominantAirlineBusinessModel: string(data.dominant_airline_business_model),
      pagePath: string(data.page_path),
    };
  });
}

/**
 * Validates and maps the filtered destination catalogue and its facets.
 */
export function parseCityDestinationsResponse(value: unknown): CityDestinationResult {
  const envelope = parseEnvelope(value);
  const meta = envelope.meta;
  const facets = record(meta.facets);
  return {
    destinations: array(envelope.data).map(parseDestination),
    total: integer(meta.total),
    facets: {
      airports: array(facets.airports).map(parseCountFacet),
      airlines: array(facets.airlines).map(parseLabelFacet),
      countries: array(facets.countries).map(parseLabelFacet),
    },
  };
}

/**
 * Validates and maps the optional City Hub airline directory.
 */
export function parseCityAirlinesResponse(value: unknown): readonly CityAirline[] {
  return array(parseEnvelope(value).data).map((item) => {
    const data = record(item);
    return {
      iata: string(data.iata),
      icao: nullableString(data.icao),
      name: string(data.name),
      slug: string(data.slug),
      logoPath: nullableString(data.logo_path),
      originAirports: stringArray(data.origin_airports),
      directDestinationCount: integer(data.direct_destination_count),
      pagePath: string(data.page_path),
    };
  });
}

/**
 * Validates and maps aggregate City Hub route insights.
 */
export function parseCityInsightsResponse(value: unknown): CityInsights {
  const data = record(parseEnvelope(value).data);
  return {
    mostPopularDestination: nullableString(data.most_popular_destination),
    shortestDestination: nullableString(data.shortest_destination),
    longestDestination: nullableString(data.longest_destination),
    topAirline: nullableString(data.top_airline),
    averageDurationMinutes: nullableInteger(data.average_duration_minutes),
    directCountryCount: integer(data.direct_country_count),
  };
}

/**
 * Validates and maps the dedicated Quick Facts read model.
 */
export function parseCityQuickFactsResponse(value: unknown): CityQuickFacts {
  const envelope = parseEnvelope(value);
  const data = record(envelope.data);
  return {
    airportCount: integer(data.airport_count),
    directDestinationCount: integer(data.direct_destination_count),
    directCountryCount: integer(data.direct_country_count),
    airlineCount: integer(data.airline_count),
    shortestRoute: nullableRouteExtreme(data.shortest_route),
    longestRoute: nullableRouteExtreme(data.longest_route),
    dataVersion: string(envelope.meta.data_version),
  };
}

/**
 * Validates and maps semantic internal links grouped by backend cluster.
 */
export function parseCityInternalLinksResponse(value: unknown): readonly CityInternalLinkGroup[] {
  return array(parseEnvelope(value).data).map((item) => {
    const group = record(item);
    return {
      cluster: string(group.cluster),
      links: array(group.links).map((linkValue) => {
        const link = record(linkValue);
        return {
          title: string(link.title),
          path: string(link.path),
          anchorText: string(link.anchor_text),
          secondaryText: nullableString(link.secondary_text),
          isFeatured: boolean(link.is_featured),
        };
      }),
    };
  });
}

/**
 * Validates and maps reviewed FAQ content used by UI and structured data.
 */
export function parseCityFaqsResponse(value: unknown): readonly CityFaq[] {
  return array(parseEnvelope(value).data).map((item) => {
    const data = record(item);
    return {
      question: string(data.question),
      answer: string(data.answer),
      answerType: string(data.answer_type),
    };
  });
}

function parseDestination(value: unknown): CityDestination {
  const data = record(value);
  const city = record(data.city);
  const country = record(data.country);
  return {
    cityName: string(city.name),
    citySlug: string(city.slug),
    countryIso2: string(country.iso2),
    countryName: string(country.name),
    originAirports: stringArray(data.origin_airports),
    destinationAirports: stringArray(data.destination_airports),
    airlines: stringArray(data.airlines),
    directRouteCount: integer(data.direct_route_count),
    frequencyPerWeek: nullableInteger(data.frequency_per_week),
    shortestDurationMinutes: integer(data.shortest_duration_minutes),
    longestDurationMinutes: integer(data.longest_duration_minutes),
    routePath: string(data.route_path),
  };
}

function parseEnvelope(value: unknown) {
  const envelope = record(value);
  if (envelope.status !== "success" || envelope.error !== null) contractError();
  return {
    data: envelope.data,
    meta: record(envelope.meta),
  };
}

function parseCountFacet(value: unknown) {
  const facet = record(value);
  return { value: string(facet.value), count: integer(facet.count) };
}

function parseLabelFacet(value: unknown) {
  const facet = record(value);
  return {
    value: string(facet.value),
    label: string(facet.label),
    count: integer(facet.count),
  };
}

function nullableRouteExtreme(value: unknown): CityRouteExtreme | null {
  if (value === null) return null;
  const route = record(value);
  return {
    destinationName: string(route.destination_name),
    destinationSlug: string(route.destination_slug),
    routePath: string(route.route_path),
    durationMinutes: integer(route.duration_minutes),
  };
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) contractError();
  return value as Record<string, unknown>;
}

function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) contractError();
  return value;
}

function string(value: unknown): string {
  if (typeof value !== "string") contractError();
  return value;
}

function nullableString(value: unknown): string | null {
  if (value === null) return null;
  return string(value);
}

function number(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) contractError();
  return value;
}

function integer(value: unknown): number {
  const parsed = number(value);
  if (!Number.isInteger(parsed) || parsed < 0) contractError();
  return parsed;
}

function nullableInteger(value: unknown): number | null {
  if (value === null) return null;
  return integer(value);
}

function percentage(value: unknown): number {
  const parsed = integer(value);
  if (parsed > 100) contractError();
  return parsed;
}

function boolean(value: unknown): boolean {
  if (typeof value !== "boolean") contractError();
  return value;
}

function stringArray(value: unknown): string[] {
  return array(value).map(string);
}

function contractError(): never {
  throw new CityPageError(
    "ERR_CITY_PAGE_CONTRACT",
    "City Page returned an invalid response.",
  );
}
