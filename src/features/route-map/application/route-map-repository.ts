import type {
  CityRouteMapQuery,
  RouteMapReadModel,
} from "../domain/route-map-model";

/** Port for loading reusable route-map data independently from page content. */
export type RouteMapRepository = Readonly<{
  getCityRouteMap(query: CityRouteMapQuery): Promise<RouteMapReadModel>;
}>;
