import type {
  CityDestinationQuery,
  CityPageIdentity,
} from "../domain/models";

export type CityPageSearchParameters = Record<
  string,
  string | string[] | undefined
>;

export type SelectedCityFilters = Readonly<{
  airport: string;
  departure: string;
  duration: string;
}>;

const DEPARTURE_WINDOWS = new Set([
  "morning",
  "afternoon",
  "evening",
  "night",
]);

/**
 * Normalizes an App Router city slug into the localized identity shared by all
 * City Page read models.
 */
export function createCityPageIdentity(
  citySlug: string,
  locale = "en-GB",
): CityPageIdentity {
  return {
    citySlug: citySlug.trim().toLowerCase(),
    locale,
  };
}

/**
 * Projects supported URL filters into the bounded destination read query.
 * Malformed values are omitted so they never cross the Edge/RPC contract.
 */
export function createCityDestinationQuery(
  identity: CityPageIdentity,
  filters: CityPageSearchParameters,
): CityDestinationQuery {
  const airport = normalizedAirport(filters.airport);
  const duration = Number(singleValue(filters.duration));
  const departure = singleValue(filters.departure);

  return {
    ...identity,
    limit: 8,
    offset: 0,
    ...(airport ? { originAirports: [airport] } : {}),
    ...(Number.isInteger(duration) && duration > 0
      ? { maxDurationMinutes: duration }
      : {}),
    ...(departure && DEPARTURE_WINDOWS.has(departure)
      ? { departureWindow: departure }
      : {}),
  };
}

/**
 * Returns the sanitized values that the filter toolbar can safely select.
 * Duration options stay intentionally narrower than the RPC's numeric range.
 */
export function readSelectedCityFilters(
  filters: CityPageSearchParameters,
): SelectedCityFilters {
  const departure = singleValue(filters.departure);
  const duration = singleValue(filters.duration);

  return {
    airport: normalizedAirport(filters.airport) ?? "",
    departure: departure && DEPARTURE_WINDOWS.has(departure) ? departure : "",
    duration: duration === "180" || duration === "360" ? duration : "",
  };
}

function singleValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function normalizedAirport(
  value: string | string[] | undefined,
): string | undefined {
  const airport = singleValue(value)?.trim().toUpperCase();
  return airport && /^[A-Z]{3}$/.test(airport) ? airport : undefined;
}
