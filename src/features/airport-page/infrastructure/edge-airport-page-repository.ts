import "server-only";

import type { AirportPageRepository } from "../application/airport-page-repository";
import { AirportPageError } from "../domain/airport-page-error";
import type { AirportPageIdentity } from "../domain/models";
import type { AirportPageEnvironment } from "./airport-page-environment";
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
    const rpc = action === "get_page"
      ? "rpc_get_airport_page"
      : "rpc_search_airport_direct_routes";
    const response = await fetchImpl(`${environment.supabaseUrl}/rest/v1/rpc/${rpc}`, {
      method: "POST",
      headers: {
        apikey: environment.supabaseServiceRoleKey,
        authorization: `Bearer ${environment.supabaseServiceRoleKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ p_input: input }),
      cache: "no-store",
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) throw new AirportPageError("ERR_AIRPORT_PAGE_UNAVAILABLE", "Airport page is unavailable.");
    const code = errorCode(payload);
    if (code) throw new AirportPageError(code, "Airport page is unavailable.");
    return payload;
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

function errorCode(value: unknown): string | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const error = (value as Record<string, unknown>).error;
  if (typeof error !== "object" || error === null || Array.isArray(error)) return null;
  const code = (error as Record<string, unknown>).code;
  return typeof code === "string" ? code : null;
}
