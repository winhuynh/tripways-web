import { searchRouteData } from "@/lib/server/route-search/route-search-client";
import type {
  RouteSearchModel,
  RouteSearchScope,
} from "../domain/route-search-model";
import { routeSearchFixture } from "../domain/route-search-model.fixture";
import { parseRouteSearchResponse } from "../infrastructure/route-search-response.dto";

export async function searchRoutes(
  scope: RouteSearchScope,
  filters: Record<string, unknown> = {},
  after: string | null = null,
): Promise<RouteSearchModel> {
  try {
    return await searchRouteData({
      request: { scope, filters, page_size: 20, after },
      parse: parseRouteSearchResponse,
    });
  } catch (error) {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.APP_ENV === "local"
    ) {
      return routeSearchFixture;
    }
    throw error;
  }
}
