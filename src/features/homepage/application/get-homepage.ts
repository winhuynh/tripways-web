import { readPageDataEnvironment } from "@/lib/server/page-data-environment";
import { requestPageData } from "@/lib/server/page-data-transport";
import { readRpcData } from "@/lib/server/page-data/page-envelope";
import { parseHomepageStatisticsResponse } from "../infrastructure/homepage-response.dto";

export function getHomepageStatistics(fetchImpl?: typeof fetch) {
  const environment = readPageDataEnvironment();
  return requestPageData({
    url: environment.homepageStatisticsUrl,
    anonKey: environment.supabaseAnonKey,
    body: {},
    cacheIdentity: `homepage-statistics:${environment.dataVersion}`,
    timeoutMs: environment.timeoutMs,
    notFoundCodes: [],
    unavailableCode: "ERR_HOMEPAGE_STATISTICS_UNAVAILABLE",
    createError: (code) => new Error(code),
    parse: (value) => parseHomepageStatisticsResponse(readRpcData(value)),
    fetchImpl,
  });
}
