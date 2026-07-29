import type {
  AirportPageIdentity,
  AirportPageModel,
  AirportRouteFilters,
  AirportRouteResult,
} from "../domain/models";

export type AirportPageRepository = Readonly<{
  getPage(input: AirportPageIdentity): Promise<AirportPageModel>;
  searchRoutes(
    input: AirportPageIdentity & AirportRouteFilters,
  ): Promise<AirportRouteResult>;
}>;
