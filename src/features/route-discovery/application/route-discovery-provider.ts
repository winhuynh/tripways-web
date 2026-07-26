import type { RouteFilters } from "../domain/route-filters";
import type { RouteSearchResult } from "../domain/route-option";

export type RouteSearchInput = Partial<RouteFilters> & {
  from: string;
  to: string;
};

/** Port implemented by infrastructure providers that can search discovery routes. */
export type RouteDiscoveryProvider = Readonly<{
  searchRoutes(input: RouteSearchInput): Promise<RouteSearchResult>;
}>;
