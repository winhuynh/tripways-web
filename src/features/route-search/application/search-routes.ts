import { searchRouteData } from "@/lib/server/route-search/route-search-client";
import type {
  RouteSearchModel,
  RouteSearchScope,
} from "../domain/route-search-model";
import { parseRouteSearchResponse } from "../infrastructure/route-search-response.dto";

export async function searchRoutes(
  scope: RouteSearchScope,
  filters: Record<string, unknown> = {},
  after: string | null = null,
): Promise<RouteSearchModel> {
  return searchRouteData({
    request: { scope, filters, page_size: 20, after },
    parse: parseRouteSearchResponse,
  });
}
