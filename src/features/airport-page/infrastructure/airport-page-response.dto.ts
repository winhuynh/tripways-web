import type {
  AirportLounge,
  AirportPageModel,
  AirportTransportOption,
  EstimatedPrice,
  JourneyStep,
  TransportDirection,
} from "../domain/airport-page-model";

export function parseAirportPageResponse(value: unknown): AirportPageModel {
  try {
    const root = record(value);
    const airport = record(root.airport);
    const city = record(airport.city);
    const country = record(airport.country);
    const seo = record(root.seo);
    const orientation = record(root.orientation);
    const quick = record(root.quick_answers);
    const defaultTransport = quick.default_transport === null ? null : record(quick.default_transport);
    const provenance = record(root.provenance);

    return {
      airport: {
        iata: text(airport.iata),
        name: text(airport.name),
        city: { name: text(city.name), slug: text(city.slug) },
        country: { name: text(country.name), slug: text(country.slug) },
      },
      seo: {
        h1: text(seo.h1),
        subheadline: text(seo.subheadline),
        title: text(seo.title),
        description: text(seo.meta_description),
      },
      orientation: {
        intro: text(orientation.intro),
        summary: text(orientation.summary),
        cityDistanceKm: nullableNumber(orientation.city_distance_km),
        terminalCount: numberValue(orientation.terminal_count),
      },
      quickAnswers: {
        defaultTransport: defaultTransport ? text(defaultTransport.name) : null,
        transportMinutes: defaultTransport
          ? {
              min: numberValue(record(defaultTransport.typical_minutes).min),
              max: numberValue(record(defaultTransport.typical_minutes).max),
            }
          : null,
        cityDistanceKm: nullableNumber(quick.city_distance_km),
        terminalCount: numberValue(quick.terminal_count),
      },
      arrival: parseJourney(root.arrival),
      departure: parseJourney(root.departure),
      transport: array(root.transport).map(parseTransport),
      terminals: array(root.terminals).map((item) => {
        const entry = record(item);
        return { code: text(entry.code), name: text(entry.name) };
      }),
      facilities: array(root.facilities).map((item) => {
        const entry = record(item);
        return {
          category: text(entry.category),
          name: text(entry.name),
          summary: text(entry.summary),
        };
      }),
      lounges: array(root.lounges).map(parseLounge),
      notices: array(root.notices).map((item) => {
        const entry = record(item);
        return { title: nullableText(entry.title) ?? "Airport notice", body: text(entry.body) };
      }),
      faqs: array(root.faqs).map((item) => {
        const entry = record(item);
        return { question: text(entry.question), answer: text(entry.answer) };
      }),
      links: array(root.internal_link_groups).map((item) => {
        const group = record(item);
        return {
          title: text(group.cluster),
          links: array(group.links).map((link) => {
            const entry = record(link);
            const secondaryText = nullableText(entry.secondary_text);
            return {
              label: text(entry.anchor_text),
              href: text(entry.path),
              ...(secondaryText ? { secondaryText } : {}),
            };
          }),
        };
      }),
      provenance: {
        reviewedAt: nullableText(provenance.last_editorial_review),
        freshnessAt: nullableText(provenance.source_freshness_at),
        routeDataRefreshedAt: nullableText(provenance.route_data_refreshed_at),
        dataVersion: nullableText(provenance.data_version),
      },
    };
  } catch {
    throw new Error("ERR_AIRPORT_PAGE_CONTRACT");
  }
}

function parseJourney(value: unknown): { summary: string; steps: JourneyStep[] } {
  const item = record(value);
  return {
    summary: text(item.summary),
    steps: array(item.steps).map((step) => {
      const entry = record(step);
      return { audience: text(entry.audience), title: text(entry.title), body: text(entry.body) };
    }),
  };
}

function parseTransport(value: unknown): AirportTransportOption {
  const entry = record(value);
  const duration = record(entry.duration);
  const price = record(entry.estimated_price);
  const direction = text(entry.direction);
  if (!isTransportDirection(direction)) throw new Error();
  return {
    direction,
    type: text(entry.type),
    name: text(entry.name),
    destinationLabel: text(entry.destination_label),
    summary: text(entry.summary),
    duration: {
      minMinutes: nullableNumber(duration.min_minutes),
      maxMinutes: nullableNumber(duration.max_minutes),
    },
    price: {
      min: nullableNumber(price.min),
      max: nullableNumber(price.max),
      currency: nullableText(price.currency),
    },
    operatingHours: nullableText(entry.operating_hours_summary),
    pickupLocation: nullableText(entry.pickup_location_summary),
    bestFor: nullableText(entry.best_for_label),
    luggageSummary: nullableText(entry.luggage_summary),
    accessibilitySummary: nullableText(entry.accessibility_summary),
    bookingUrl: nullableText(entry.booking_url),
    sourceUrl: text(entry.source_url),
    lastVerifiedAt: text(entry.last_verified_at),
  };
}

function parseLounge(value: unknown): AirportLounge {
  const entry = record(value);
  return {
    name: text(entry.name),
    location: text(entry.location_summary),
    locationType: text(entry.location_type),
    access: text(entry.access_summary),
    operatingHours: nullableText(entry.operating_hours_summary),
    amenities: stringArray(entry.amenities),
    estimatedPrice: parseEstimatedPrice(entry.estimated_price),
    affiliateUrl: nullableText(entry.affiliate_url),
    sourceUrl: text(entry.source_url),
    lastVerifiedAt: text(entry.last_verified_at),
  };
}

function parseEstimatedPrice(value: unknown): EstimatedPrice | null {
  if (value === null || value === undefined) return null;
  const price = record(value);
  return {
    min: numberValue(price.min),
    max: numberValue(price.max),
    currency: text(price.currency),
  };
}

function isTransportDirection(value: string): value is TransportDirection | "both" {
  return value === "from_airport" || value === "to_airport" || value === "both";
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error();
  return value as Record<string, unknown>;
}

function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error();
  return value;
}

function stringArray(value: unknown): string[] {
  return array(value).map(text);
}

function text(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") throw new Error();
  return value;
}

function nullableText(value: unknown): string | null {
  return value === null || value === undefined ? null : text(value);
}

function numberValue(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error();
  return value;
}

function nullableNumber(value: unknown): number | null {
  return value === null || value === undefined ? null : numberValue(value);
}
