import { RouteDiscoveryError } from "../domain/route-discovery-error";
import type { RouteOption, RouteSearchResult } from "../domain/route-option";

export function parseRouteSearchResponse(value: unknown): RouteSearchResult {
  if (!isRecord(value)) contractError();
  if (value.status === "error") {
    const error = value.error;
    if (!isRecord(error) || typeof error.code !== "string") contractError();
    if (error.code === "ERR_ROUTE_DISCOVERY_INVALID_REQUEST") {
      throw new RouteDiscoveryError(error.code, "The route search request is invalid.");
    }
    throw new RouteDiscoveryError(
      "ERR_ROUTE_DISCOVERY_UNAVAILABLE",
      "Route Discovery is unavailable.",
    );
  }
  if (value.status !== "success" || value.error !== null || !isRecord(value.data)) {
    contractError();
  }

  const data = value.data;
  if (!Array.isArray(data.routes) || !data.routes.every(isRouteOption) ||
    !isRecord(data.pagination) || !isRecord(data.facets)) {
    contractError();
  }
  const { total, limit, offset } = data.pagination;
  if (![total, limit, offset].every(isNonNegativeInteger)) contractError();

  return {
    routes: data.routes as RouteOption[],
    pagination: { total: total as number, limit: limit as number, offset: offset as number },
    facets: {
      stops: parseFacets(data.facets.stops, "number") as Array<{ value: number; count: number }>,
      airlines: parseFacets(data.facets.airlines, "string") as Array<{
        value: string;
        count: number;
      }>,
    },
  };
}

function parseFacets(value: unknown, type: "number" | "string") {
  if (!Array.isArray(value)) contractError();
  return value.map((item) => {
    if (!isRecord(item) || typeof item.value !== type || !isNonNegativeInteger(item.count)) {
      contractError();
    }
    return { value: item.value, count: item.count };
  });
}

function isRouteOption(value: unknown): value is RouteOption {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" &&
    typeof value.from === "string" &&
    typeof value.to === "string" &&
    typeof value.stops === "number" &&
    isStringArray(value.connection_airports) &&
    isStringArray(value.operating_airlines) &&
    typeof value.total_flight_minutes === "number" &&
    (typeof value.layover_minutes === "number" || value.layover_minutes === null) &&
    typeof value.total_duration_minutes === "number" &&
    typeof value.departure_local_time === "string" &&
    typeof value.arrival_local_time === "string" &&
    typeof value.arrival_day_offset === "number" &&
    typeof value.valid_from === "string" &&
    typeof value.valid_to === "string" &&
    Array.isArray(value.days_of_week) &&
    value.days_of_week.every((item) => typeof item === "number") &&
    typeof value.confidence_score === "number" &&
    typeof value.data_version === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function contractError(): never {
  throw new RouteDiscoveryError(
    "ERR_ROUTE_DISCOVERY_CONTRACT",
    "Route Discovery returned an invalid response.",
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
