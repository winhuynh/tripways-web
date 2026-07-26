import "server-only";

import type {
  RouteDiscoveryProvider,
  RouteSearchInput,
} from "../application/route-discovery-provider";
import { RouteDiscoveryError } from "../domain/route-discovery-error";
import type { RouteSearchResult } from "../domain/route-option";
import type { RouteDiscoveryEnvironment } from "./route-discovery-environment";
import { parseRouteSearchResponse } from "./route-search-response.dto";

/** Implements route discovery through the Supabase Edge Function boundary. */
export function createEdgeRouteDiscoveryProvider(
  environment: RouteDiscoveryEnvironment,
  fetchImpl: typeof fetch = fetch,
): RouteDiscoveryProvider {
  return {
    async searchRoutes(input: RouteSearchInput): Promise<RouteSearchResult> {
      const response = await fetchImpl(
        `${environment.supabaseUrl}/functions/v1/route-discovery-query`,
        {
          method: "POST",
          headers: {
            apikey: environment.supabaseAnonKey,
            authorization: `Bearer ${environment.supabaseAnonKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ action: "search_routes", input }),
          cache: "no-store",
        },
      );

      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 400) return parseRouteSearchResponse(payload);
        throw new RouteDiscoveryError(
          "ERR_ROUTE_DISCOVERY_UNAVAILABLE",
          "Route Discovery is unavailable.",
        );
      }
      return parseRouteSearchResponse(payload);
    },
  };
}
