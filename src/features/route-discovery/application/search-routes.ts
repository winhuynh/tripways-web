import type {
  RouteDiscoveryProvider,
  RouteSearchInput,
} from "./route-discovery-provider";

/** Creates the single-route search use case without exposing provider details. */
export function createSearchRoutes(provider: RouteDiscoveryProvider) {
  return (input: RouteSearchInput) => provider.searchRoutes(input);
}
