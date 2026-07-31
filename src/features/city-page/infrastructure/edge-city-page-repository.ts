import "server-only";

import type { CityPageRepository } from "../application/city-page-repository";
import { CityPageError } from "../domain/city-page-error";
import type { CityDestinationQuery, CityPageIdentity } from "../domain/models";
import type { CityPageEnvironment } from "./city-page-environment";
import {
  buildPageDataCacheIdentity,
  requestPageData,
} from "../../../lib/server/page-data-transport";
import {
  parseCityAirlinesResponse,
  parseCityAirportsResponse,
  parseCityDestinationsResponse,
  parseCityFaqsResponse,
  parseCityInsightsResponse,
  parseCityInternalLinksResponse,
  parseCityOverviewResponse,
  parseCityQuickFactsResponse,
} from "./city-page-response.dto";

/**
 * Creates the server-only City Page repository that calls the Edge transport,
 * applies cache tags, and validates every external response envelope.
 */
export function createEdgeCityPageRepository(
  environment: CityPageEnvironment,
  fetchImpl: typeof fetch = fetch,
): CityPageRepository {
  async function query<T>(
    action: string,
    input: Record<string, unknown>,
    parse: (value: unknown) => T,
  ): Promise<T> {
    return requestPageData({
      url: environment.cityPageEdgeUrl,
      anonKey: environment.supabaseAnonKey,
      body: { action, input },
      cacheIdentity: buildPageDataCacheIdentity({
        locale: String(input.locale),
        entityIdentity: `city:${String(input.city_slug)}`,
        filters: { action, ...input },
        dataVersion: environment.dataVersion,
      }),
      timeoutMs: environment.timeoutMs,
      notFoundCodes: ["ERR_CITY_NOT_FOUND", "ERR_CITY_PAGE_NOT_FOUND"],
      unavailableCode: "ERR_CITY_PAGE_UNAVAILABLE",
      createError: (code) =>
        new CityPageError(
          code as ConstructorParameters<typeof CityPageError>[0],
          code.includes("NOT_FOUND")
            ? "City page was not found."
            : "City Page is unavailable.",
        ),
      parse,
      fetchImpl,
    });
  }

  return {
    getOverview: (input) => query("get_overview", toIdentityDto(input), parseCityOverviewResponse),
    getAirports: (input) => query("get_airports", toIdentityDto(input), parseCityAirportsResponse),
    getDestinations: (input) =>
      query("get_destinations", toDestinationDto(input), parseCityDestinationsResponse),
    getAirlines: (input) => query("get_airlines", toIdentityDto(input), parseCityAirlinesResponse),
    getInsights: (input) => query("get_insights", toIdentityDto(input), parseCityInsightsResponse),
    getQuickFacts: (input) =>
      query("get_quick_facts", toIdentityDto(input), parseCityQuickFactsResponse),
    getInternalLinks: (input) =>
      query("get_internal_links", toIdentityDto(input), parseCityInternalLinksResponse),
    getFaqs: (input) => query("get_faqs", toIdentityDto(input), parseCityFaqsResponse),
  };
}

function toIdentityDto(input: CityPageIdentity): Record<string, unknown> {
  return { city_slug: input.citySlug, locale: input.locale };
}

function toDestinationDto(input: CityDestinationQuery): Record<string, unknown> {
  return {
    ...toIdentityDto(input),
    ...(input.originAirports ? { origin_airports: input.originAirports } : {}),
    ...(input.airlines ? { airlines: input.airlines } : {}),
    ...(input.destinationCountries
      ? { destination_countries: input.destinationCountries }
      : {}),
    ...(input.maxDurationMinutes
      ? { max_duration_minutes: input.maxDurationMinutes }
      : {}),
    ...(input.departureWindow ? { departure_window: input.departureWindow } : {}),
    ...(input.limit ? { limit: input.limit } : {}),
    ...(input.offset !== undefined ? { offset: input.offset } : {}),
  };
}
