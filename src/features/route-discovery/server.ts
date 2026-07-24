import "server-only";

import { createDiscoverDestinations } from "./application/discover-destinations";
import { createSearchRoutes } from "./application/search-routes";
import { createEdgeRouteDiscoveryProvider } from "./infrastructure/edge-route-discovery-provider";
import { readRouteDiscoveryEnvironment } from "./infrastructure/route-discovery-environment";

function createProvider() {
  return createEdgeRouteDiscoveryProvider(readRouteDiscoveryEnvironment());
}

export const routeDiscovery = {
  searchRoutes: (input: Parameters<ReturnType<typeof createSearchRoutes>>[0]) =>
    createSearchRoutes(createProvider())(input),
  discoverDestinations: (
    ...args: Parameters<ReturnType<typeof createDiscoverDestinations>>
  ) => createDiscoverDestinations(createProvider())(...args),
};
