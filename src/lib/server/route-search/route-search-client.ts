import "server-only";

import { readPageDataEnvironment } from "../page-data-environment";
import { requestPageData } from "../page-data-transport";

type RouteSearchClientInput<T> = Readonly<{
  request: Record<string, unknown>;
  parse(value: unknown): T;
  fetchImpl?: typeof fetch;
}>;

export async function searchRouteData<T>(input: RouteSearchClientInput<T>): Promise<T> {
  const environment = readPageDataEnvironment();
  return requestPageData({
    url: environment.routeSearchQueryUrl,
    anonKey: environment.supabaseAnonKey,
    body: input.request,
    cacheIdentity: `route-search:${JSON.stringify(input.request)}`,
    timeoutMs: environment.timeoutMs,
    notFoundCodes: [],
    unavailableCode: "ERR_ROUTE_SEARCH_UNAVAILABLE",
    createError: (code) => new Error(code),
    parse: input.parse,
    fetchImpl: input.fetchImpl,
  });
}
