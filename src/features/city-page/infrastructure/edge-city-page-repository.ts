import "server-only";

import type { CityPageRepository } from "../application/city-page-repository";
import { CityPageError } from "../domain/city-page-error";
import type { CityDestinationQuery, CityPageIdentity } from "../domain/models";
import type { CityPageEnvironment } from "./city-page-environment";
import {
  parseCityAirlinesResponse,
  parseCityAirportsResponse,
  parseCityDestinationsResponse,
  parseCityFaqsResponse,
  parseCityInsightsResponse,
  parseCityInternalLinksResponse,
  parseCityOverviewResponse,
} from "./city-page-response.dto";

const CITY_PAGE_READ_CONTRACT = "city-page-v2";

export function createEdgeCityPageRepository(
  environment: CityPageEnvironment,
  fetchImpl: typeof fetch = fetch,
): CityPageRepository {
  async function query<T>(
    action: string,
    input: Record<string, unknown>,
    parse: (value: unknown) => T,
  ): Promise<T> {
    const response = await fetchImpl(environment.cityPageEdgeUrl, {
        method: "POST",
        headers: {
          apikey: environment.supabaseAnonKey,
          authorization: `Bearer ${environment.supabaseAnonKey}`,
          "content-type": "application/json",
          "x-tripways-read-contract": CITY_PAGE_READ_CONTRACT,
        },
        body: JSON.stringify({ action, input }),
        next: {
          revalidate: 3600,
          tags: [`${CITY_PAGE_READ_CONTRACT}:${input.city_slug}:${action}`],
        },
    });

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const code = readErrorCode(payload);
      if (code === "ERR_CITY_NOT_FOUND" || code === "ERR_CITY_PAGE_NOT_FOUND") {
        throw new CityPageError(code, "City page was not found.");
      }
      throw new CityPageError("ERR_CITY_PAGE_UNAVAILABLE", "City Page is unavailable.");
    }
    return parse(payload);
  }

  return {
    getOverview: (input) => query("get_overview", toIdentityDto(input), parseCityOverviewResponse),
    getAirports: (input) => query("get_airports", toIdentityDto(input), parseCityAirportsResponse),
    getDestinations: (input) =>
      query("get_destinations", toDestinationDto(input), parseCityDestinationsResponse),
    getAirlines: (input) => query("get_airlines", toIdentityDto(input), parseCityAirlinesResponse),
    getInsights: (input) => query("get_insights", toIdentityDto(input), parseCityInsightsResponse),
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

function readErrorCode(value: unknown): string | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const error = (value as Record<string, unknown>).error;
  if (typeof error !== "object" || error === null || Array.isArray(error)) return null;
  const code = (error as Record<string, unknown>).code;
  return typeof code === "string" ? code : null;
}
