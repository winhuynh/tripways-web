export type RouteDiscoveryErrorCode =
  | "ERR_ROUTE_DISCOVERY_SETUP"
  | "ERR_ROUTE_DISCOVERY_INVALID_REQUEST"
  | "ERR_ROUTE_DISCOVERY_UNAVAILABLE"
  | "ERR_ROUTE_DISCOVERY_CONTRACT";

/** Typed error used to preserve safe route-discovery failure categories. */
export class RouteDiscoveryError extends Error {
  constructor(
    public readonly code: RouteDiscoveryErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "RouteDiscoveryError";
  }
}
