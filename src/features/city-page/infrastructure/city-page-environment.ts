import "server-only";

export type CityPageEnvironment = Readonly<{
  supabaseUrl: string;
  supabaseAnonKey: string;
  cityPageEdgeUrl: string;
}>;

export function readCityPageEnvironment(): CityPageEnvironment {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("ERR_CITY_PAGE_SETUP");
  }

  const cityPageEdgeUrl = process.env.CITY_PAGE_EDGE_URL?.trim() ||
    `${supabaseUrl}/functions/v1/city-page-query`;

  return { supabaseUrl, supabaseAnonKey, cityPageEdgeUrl };
}
