import type {
  CityAirline,
  CityAirport,
  CityDestinationQuery,
  CityDestinationResult,
  CityFaq,
  CityInsights,
  CityInternalLinkGroup,
  CityOverview,
  CityPageIdentity,
} from "../domain/models";

export type CityPageRepository = Readonly<{
  getOverview(input: CityPageIdentity): Promise<CityOverview>;
  getAirports(input: CityPageIdentity): Promise<readonly CityAirport[]>;
  getDestinations(input: CityDestinationQuery): Promise<CityDestinationResult>;
  getAirlines(input: CityPageIdentity): Promise<readonly CityAirline[]>;
  getInsights(input: CityPageIdentity): Promise<CityInsights>;
  getInternalLinks(input: CityPageIdentity): Promise<readonly CityInternalLinkGroup[]>;
  getFaqs(input: CityPageIdentity): Promise<readonly CityFaq[]>;
}>;
