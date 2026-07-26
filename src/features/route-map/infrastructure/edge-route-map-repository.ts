import type { RouteMapRepository } from "../application/route-map-repository";
import type { CityRouteMapQuery } from "../domain/route-map-model";
import { parseRouteMapResponse } from "./route-map-response.dto";

const ROUTE_MAP_READ_CONTRACT = "route-map-v1";

export type RouteMapEnvironment = Readonly<{
  cityPageEdgeUrl: string;
  supabasePublishableKey: string;
}>;

export function createEdgeRouteMapRepository(
  environment: RouteMapEnvironment,
  fetchImpl: typeof fetch = fetch,
): RouteMapRepository {
  return {
    async getCityRouteMap(query) {
      const response = await fetchImpl(environment.cityPageEdgeUrl, {
        method: "POST",
        headers: {
          apikey: environment.supabasePublishableKey,
          authorization: `Bearer ${environment.supabasePublishableKey}`,
          "content-type": "application/json",
          "x-tripways-read-contract": ROUTE_MAP_READ_CONTRACT,
        },
        body: JSON.stringify({
          action: "get_route_map",
          input: toCityRouteMapDto(query),
        }),
        next: {
          revalidate: 3600,
          tags: [
            `${ROUTE_MAP_READ_CONTRACT}:${query.origin.slug}:get_route_map`,
          ],
        },
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error("ERR_ROUTE_MAP_UNAVAILABLE");
      }

      return parseRouteMapResponse(payload);
    },
  };
}

function toCityRouteMapDto(
  query: CityRouteMapQuery,
): Record<string, unknown> {
  return {
    city_slug: query.origin.slug,
    locale: query.locale,
    ...(query.originAirports
      ? { origin_airports: query.originAirports }
      : {}),
    ...(query.airlines ? { airlines: query.airlines } : {}),
    ...(query.destinationCountries
      ? { destination_countries: query.destinationCountries }
      : {}),
    ...(query.maxDurationMinutes
      ? { max_duration_minutes: query.maxDurationMinutes }
      : {}),
    ...(query.departureWindow
      ? { departure_window: query.departureWindow }
      : {}),
    ...(query.limit ? { limit: query.limit } : {}),
  };
}
