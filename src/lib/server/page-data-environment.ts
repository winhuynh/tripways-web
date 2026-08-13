import "server-only";

export type PageDataEnvironment = Readonly<{
  supabaseUrl: string;
  supabaseAnonKey: string;
  pageQueryUrl: string;
  routeSearchQueryUrl: string;
  homepageStatisticsUrl: string;
  affiliateHandoffUrl: string;
  dataVersion: string;
  timeoutMs: number;
}>;

export function readPageDataEnvironment(): PageDataEnvironment {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim();
  const dataVersion = process.env.PAGE_DATA_VERSION?.trim();
  const timeoutMs = Number(process.env.PAGE_DATA_TIMEOUT_MS ?? "5000");
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    !dataVersion ||
    !Number.isInteger(timeoutMs) ||
    timeoutMs < 100 ||
    timeoutMs > 30_000
  ) {
    throw new Error("ERR_PAGE_DATA_SETUP");
  }
  return {
    supabaseUrl,
    supabaseAnonKey,
    pageQueryUrl:
      process.env.PAGE_QUERY_EDGE_URL?.trim() ||
      `${supabaseUrl}/functions/v1/page-query`,
    routeSearchQueryUrl:
      process.env.ROUTE_SEARCH_QUERY_EDGE_URL?.trim() ||
      `${supabaseUrl}/functions/v1/route-search-query`,
    homepageStatisticsUrl:
      process.env.HOMEPAGE_STATISTICS_EDGE_URL?.trim() ||
      `${supabaseUrl}/functions/v1/homepage-statistics`,
    affiliateHandoffUrl: process.env.FLIGHT_AFFILIATE_HANDOFF_EDGE_URL?.trim() || `${supabaseUrl}/functions/v1/flight-affiliate-handoff`,
    dataVersion,
    timeoutMs,
  };
}
