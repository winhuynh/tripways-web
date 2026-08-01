import type {
  AirportPageModel,
  AirportRouteResult,
} from "../domain/models";

type RecordValue = Record<string, unknown>;

export function parseAirportPageResponse(value: unknown): AirportPageModel {
  const envelope = record(value);
  if (envelope.error !== null) throw contractError();
  const data = record(envelope.data);
  const airport = record(data.airport);
  const city = record(airport.city);
  const country = record(airport.country);
  const seo = record(data.seo);
  const content = record(data.content);
  const facts = record(data.quick_facts);
  const meta = record(envelope.meta);

  return {
    airport: {
      iata: text(airport.iata),
      icao: nullableText(airport.icao),
      name: text(airport.name),
      slug: text(airport.slug),
      imagePath: nullableText(airport.image_path),
      timezone: nullableText(airport.timezone),
      city: { name: text(city.name), slug: text(city.slug) },
      country: {
        code: text(country.code),
        name: text(country.name),
        slug: text(country.slug),
      },
    },
    seo: {
      h1: text(seo.h1),
      subheadline: text(seo.subheadline),
      title: text(seo.title),
      description: text(seo.meta_description),
      ogTitle: text(seo.og_title),
      ogDescription: text(seo.og_description),
    },
    content: {
      intro: text(content.intro),
      routeSummary: text(content.route_summary),
      accessSummary: nullableText(content.access_summary),
      parkingSummary: nullableText(content.parking_summary),
      loungeSummary: nullableText(content.lounge_summary),
    },
    quickFacts: {
      outboundDestinations: integer(facts.outbound_destinations),
      outboundCountries: integer(facts.outbound_countries),
      inboundOrigins: integer(facts.inbound_origins),
      inboundCountries: integer(facts.inbound_countries),
      airlines: integer(facts.airlines),
      shortestRouteMinutes: nullableInteger(facts.shortest_route_minutes),
      longestRouteMinutes: nullableInteger(facts.longest_route_minutes),
    },
    airlines: array(data.airlines).map((item) => {
      const airline = record(item);
      return {
        iata: nullableText(airline.iata),
        name: text(airline.name),
        slug: text(airline.slug),
        logoPath: nullableText(airline.logo_path),
        routeCount: integer(airline.route_count),
      };
    }),
    accessOptions: array(data.access_options).map((item) => {
      const access = record(item);
      return {
        type: text(access.type),
        name: text(access.name),
        destinationLabel: text(access.destination_label),
        summary: text(access.summary),
        durationMinMinutes: nullableInteger(access.duration_min_minutes),
        durationMaxMinutes: nullableInteger(access.duration_max_minutes),
      };
    }),
    parking: data.parking === null
      ? null
      : { summary: text(record(data.parking).summary) },
    lounges: array(data.lounges).map((item) => {
      const lounge = record(item);
      return {
        name: text(lounge.name),
        locationSummary: text(lounge.location_summary),
        accessSummary: text(lounge.access_summary),
        amenities: array(lounge.amenities).map(text),
      };
    }),
    notices: array(data.notices).map((item) => {
      const notice = record(item);
      return {
        title: text(notice.title),
        body: text(notice.body),
        severity: text(notice.severity),
      };
    }),
    faqs: array(data.faqs).map((item) => {
      const faq = record(item);
      return { question: text(faq.question), answer: text(faq.answer) };
    }),
    meta: {
      canonicalPath: text(meta.canonical_path),
      isIndexable: booleanValue(meta.is_indexable),
      noindexReason: nullableText(meta.noindex_reason),
    },
  };
}

export function parseAirportRoutesResponse(value: unknown): AirportRouteResult {
  const envelope = record(value);
  if (envelope.error !== null) throw contractError();
  const meta = record(envelope.meta);
  return {
    direction: direction(meta.direction),
    total: integer(meta.total),
    routes: array(envelope.data).map((item) => {
      const route = record(item);
      return {
        airportIata: text(route.counterpart_airport_iata),
        airportName: text(route.counterpart_airport_name),
        cityName: text(route.counterpart_city_name),
        citySlug: text(route.counterpart_city_slug),
        countryCode: text(route.counterpart_country_code),
        countryName: text(route.counterpart_country_name),
        routeCount: integer(route.route_count),
        airlineCount: integer(route.airline_count),
        airlines: array(route.airlines).map(text),
        frequencyPerWeek: nullableNumber(route.frequency_per_week),
        shortestDurationMinutes: integer(route.shortest_duration_minutes),
        longestDurationMinutes: integer(route.longest_duration_minutes),
      };
    }),
  };
}

function record(value: unknown): RecordValue {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw contractError();
  return value as RecordValue;
}
function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw contractError();
  return value;
}
function text(value: unknown): string {
  if (typeof value !== "string") throw contractError();
  return value;
}
function nullableText(value: unknown): string | null {
  return value === null ? null : text(value);
}
function integer(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value)) throw contractError();
  return value;
}
function nullableInteger(value: unknown): number | null {
  return value === null ? null : integer(value);
}
function nullableNumber(value: unknown): number | null {
  if (value === null) return null;
  if (typeof value !== "number") throw contractError();
  return value;
}
function booleanValue(value: unknown): boolean {
  if (typeof value !== "boolean") throw contractError();
  return value;
}
function direction(value: unknown): "outbound" | "inbound" {
  if (value !== "outbound" && value !== "inbound") throw contractError();
  return value;
}
function contractError(): Error {
  return new Error("ERR_AIRPORT_PAGE_CONTRACT");
}
