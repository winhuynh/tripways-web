import "server-only";

import type { AirportPageRepository } from "../application/airport-page-repository";
import { AirportPageError } from "../domain/airport-page-error";
import type { AirportPageErrorCode } from "../domain/airport-page-error";
import type { AirportPageIdentity } from "../domain/models";
import type { AirportPageEnvironment } from "./airport-page-environment";
import {
  buildPageDataCacheIdentity,
  requestPageData,
} from "../../../lib/server/page-data-transport";
import {
  parseAirportPageResponse,
  parseAirportRoutesResponse,
} from "./airport-page-response.dto";

export function createEdgeAirportPageRepository(
  environment: AirportPageEnvironment,
  fetchImpl: typeof fetch = fetch,
): AirportPageRepository {
  async function query(
    action: "get_page" | "search_routes",
    input: Record<string, unknown>,
  ): Promise<unknown> {
    return requestPageData({
      url: environment.airportPageEdgeUrl,
      anonKey: environment.supabaseAnonKey,
      body: { action, input },
      cacheIdentity: buildPageDataCacheIdentity({
        locale: String(input.locale),
        entityIdentity: `airport:${String(input.airport_iata)}`,
        filters: { action, ...input },
        dataVersion: environment.dataVersion,
      }),
      timeoutMs: environment.timeoutMs,
      notFoundCodes: ["ERR_AIRPORT_NOT_FOUND", "ERR_AIRPORT_PAGE_NOT_FOUND"],
      unavailableCode: "ERR_AIRPORT_PAGE_UNAVAILABLE",
      createError: (code) =>
        new AirportPageError(code as AirportPageErrorCode, code.includes("NOT_FOUND")
          ? "Airport page was not found."
          : "Airport page is unavailable."),
      parse: (value) => value,
      fetchImpl,
    });
  }

  return {
    getPage: async (identity) =>
      parseAirportPageResponse(await query("get_page", identityDto(identity))),
    searchRoutes: async (input) =>
      parseAirportRoutesResponse(
        await query("search_routes", {
          ...identityDto(input),
          direction: input.direction,
          ...(input.airlines ? { airlines: input.airlines } : {}),
          ...(input.countries ? { countries: input.countries } : {}),
          ...(input.maxDurationMinutes
            ? { max_duration_minutes: input.maxDurationMinutes }
            : {}),
          limit: 24,
          offset: 0,
        }),
      ),
  };
}

function identityDto(input: AirportPageIdentity): Record<string, unknown> {
  return { airport_iata: input.airportIata, locale: input.locale };
}
