import "server-only";

import { RouteDiscoveryError } from "../domain/route-discovery-error";

export type RouteDiscoveryEnvironment = Readonly<{
  supabaseUrl: string;
  supabaseAnonKey: string;
}>;

export function readRouteDiscoveryEnvironment(): RouteDiscoveryEnvironment {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new RouteDiscoveryError(
      "ERR_ROUTE_DISCOVERY_SETUP",
      "Local Supabase environment is not configured.",
    );
  }
  return { supabaseUrl: supabaseUrl.replace(/\/$/, ""), supabaseAnonKey };
}
