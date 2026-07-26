import "server-only";

import type { RouteMapEnvironment } from "./edge-route-map-repository";

export function readRouteMapEnvironment(): RouteMapEnvironment {
  const supabaseUrl = requiredEnvironment(
    "SUPABASE_URL",
    process.env.SUPABASE_URL,
  );
  const configuredEdgeUrl = process.env.CITY_PAGE_EDGE_URL?.trim();

  return {
    cityPageEdgeUrl: configuredEdgeUrl ||
      `${supabaseUrl.replace(/\/$/, "")}/functions/v1/city-page-query`,
    supabasePublishableKey: requiredEnvironment(
      "SUPABASE_ANON_KEY",
      process.env.SUPABASE_ANON_KEY,
    ),
  };
}

function requiredEnvironment(name: string, value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`ERR_MISSING_${name}`);
  return normalized;
}
