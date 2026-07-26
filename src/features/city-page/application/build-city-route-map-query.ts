import type { CityPageIdentity } from "../domain/models";
import type { RouteMapQuery } from "../../route-map";

type SearchParameters = Record<
  string,
  string | string[] | undefined
>;

export function buildCityRouteMapQuery(
  identity: CityPageIdentity,
  filters: SearchParameters,
): RouteMapQuery {
  const originAirports = codes(filters.airport, 3);
  const airlines = codes(filters.airline, 2);
  const destinationCountries = codes(filters.country, 2);
  const duration = Number(single(filters.duration));
  const departureWindow = single(filters.departure);

  return {
    origin: { type: "city", slug: identity.citySlug },
    locale: identity.locale,
    ...(originAirports.length > 0 ? { originAirports } : {}),
    ...(airlines.length > 0 ? { airlines } : {}),
    ...(destinationCountries.length > 0
      ? { destinationCountries }
      : {}),
    ...(Number.isInteger(duration) && duration > 0 && duration <= 1440
      ? { maxDurationMinutes: duration }
      : {}),
    ...(departureWindow &&
    ["morning", "afternoon", "evening", "night"].includes(departureWindow)
      ? { departureWindow }
      : {}),
    limit: 100,
  };
}

function codes(
  value: string | string[] | undefined,
  length: number,
): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(
    values
      .map((item) => item.trim().toUpperCase())
      .filter((item) =>
        new RegExp(`^[A-Z0-9]{${length}}$`).test(item)
      ),
  )];
}

function single(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
