import "server-only";

import { createGetRouteMap } from "./application/get-route-map";
import { createEdgeRouteMapRepository } from "./infrastructure/edge-route-map-repository";
import { readRouteMapEnvironment } from "./infrastructure/route-map-environment";

function createUseCase() {
  return createGetRouteMap(
    createEdgeRouteMapRepository(readRouteMapEnvironment()),
  );
}

export const routeMap = {
  getRouteMap: (...args: Parameters<ReturnType<typeof createUseCase>>) =>
    createUseCase()(...args),
};
