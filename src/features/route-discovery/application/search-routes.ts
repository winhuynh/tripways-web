import type {
  RouteDiscoveryProvider,
  RouteSearchInput,
} from "./route-discovery-provider";

export function createSearchRoutes(provider: RouteDiscoveryProvider) {
  return (input: RouteSearchInput) => provider.searchRoutes(input);
}
