import type { Airport } from "../domain/airport";
import type { RouteFilters } from "../domain/route-filters";
import type { RouteSearchResult } from "../domain/route-option";
import type { RouteDiscoveryProvider } from "./route-discovery-provider";

export type DestinationRoute = Readonly<{
  destination: Airport;
  result: RouteSearchResult;
}>;

export function createDiscoverDestinations(provider: RouteDiscoveryProvider) {
  return async (
    origin: Airport,
    destinations: readonly Airport[],
    filters: RouteFilters,
  ): Promise<{ routes: DestinationRoute[]; error: Error | null }> => {
    const settled = await Promise.all(
      destinations.map(async (destination) => {
        try {
          const result = await provider.searchRoutes({
            from: origin.iata,
            to: destination.iata,
            ...filters,
          });
          return result.routes.length > 0 ? { destination, result } : null;
        } catch (error) {
          return error instanceof Error ? error : new Error("Route Discovery is unavailable.");
        }
      }),
    );

    return {
      routes: settled.filter((item): item is DestinationRoute =>
        item !== null && !(item instanceof Error)
      ),
      error: settled.find((item): item is Error => item instanceof Error) ?? null,
    };
  };
}
