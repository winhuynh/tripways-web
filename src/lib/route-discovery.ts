import "server-only";

import type { RouteFilters } from "./route-filters";

export type RouteSearchInput = Partial<RouteFilters> & {
  from: string;
  to: string;
};

export type RouteOption = {
  id: string;
  from: string;
  to: string;
  stops: number;
  connection_airports: string[];
  operating_airlines: string[];
  total_flight_minutes: number;
  layover_minutes: number | null;
  total_duration_minutes: number;
  departure_local_time: string;
  arrival_local_time: string;
  arrival_day_offset: number;
  valid_from: string;
  valid_to: string;
  days_of_week: number[];
  confidence_score: number;
  data_version: string;
};

export type RouteFacet<T extends string | number> = {
  value: T;
  count: number;
};

export type RouteSearchMeta = {
  total?: number;
  limit?: number;
  offset?: number;
  facets?: {
    stops: RouteFacet<number>[];
    airlines: RouteFacet<string>[];
  };
};

export type RouteSearchEnvelope = {
  data: RouteOption[];
  meta: RouteSearchMeta;
  error: {
    code: string;
    message: string;
  } | null;
};

export class RouteDiscoveryError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "RouteDiscoveryError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === "number");
}

function isRouteOption(value: unknown): value is RouteOption {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
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
    isNumberArray(value.days_of_week) &&
    typeof value.confidence_score === "number" &&
    typeof value.data_version === "string"
  );
}

function isStableError(value: unknown): value is NonNullable<RouteSearchEnvelope["error"]> {
  return (
    isRecord(value) && typeof value.code === "string" && typeof value.message === "string"
  );
}

export function parseRouteSearchEnvelope(value: unknown): RouteSearchEnvelope {
  if (!isRecord(value) || !Array.isArray(value.data) || !isRecord(value.meta)) {
    throw new RouteDiscoveryError(
      "ERR_ROUTE_DISCOVERY_RESPONSE",
      "Route Discovery returned an invalid response.",
    );
  }

  if (!value.data.every(isRouteOption)) {
    throw new RouteDiscoveryError(
      "ERR_ROUTE_DISCOVERY_RESPONSE",
      "Route Discovery returned invalid route data.",
    );
  }

  if (value.error !== null && !isStableError(value.error)) {
    throw new RouteDiscoveryError(
      "ERR_ROUTE_DISCOVERY_RESPONSE",
      "Route Discovery returned an invalid error envelope.",
    );
  }

  return value as RouteSearchEnvelope;
}

export async function searchRoutes(
  input: RouteSearchInput,
  fetchImpl: typeof fetch = fetch,
): Promise<RouteSearchEnvelope> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new RouteDiscoveryError(
      "ERR_ROUTE_DISCOVERY_SETUP",
      "Local Supabase environment is not configured.",
    );
  }

  const response = await fetchImpl(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/rpc_search_routes`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ p_input: input }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new RouteDiscoveryError(
      "ERR_ROUTE_DISCOVERY_UNAVAILABLE",
      "Local Route Discovery is unavailable.",
    );
  }

  return parseRouteSearchEnvelope(await response.json());
}
