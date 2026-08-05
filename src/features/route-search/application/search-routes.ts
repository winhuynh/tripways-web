import { searchRouteData } from "@/lib/server/route-search/route-search-client";
import type { RouteSearchScope } from "../domain/route-search-model";
import { parseRouteSearchResponse } from "../infrastructure/route-search-response.dto";

export function searchRoutes(scope:RouteSearchScope,filters:Record<string,unknown>={},after:string|null=null){return searchRouteData({request:{scope,filters,page_size:20,after},parse:parseRouteSearchResponse})}
