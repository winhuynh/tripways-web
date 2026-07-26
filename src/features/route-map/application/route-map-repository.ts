import type {
  CityRouteMapQuery,
  RouteMapReadModel,
} from "../domain/route-map-model";

export type RouteMapRepository = Readonly<{
  getCityRouteMap(query: CityRouteMapQuery): Promise<RouteMapReadModel>;
}>;
