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
  CityQuickFacts,
} from "../domain/models";

export type CityPageRepository = Readonly<{
  getOverview(input: CityPageIdentity): Promise<CityOverview>;
  getAirports(input: CityPageIdentity): Promise<readonly CityAirport[]>;
  getDestinations(input: CityDestinationQuery): Promise<CityDestinationResult>;
  getAirlines(input: CityPageIdentity): Promise<readonly CityAirline[]>;
  getInsights(input: CityPageIdentity): Promise<CityInsights>;
  getQuickFacts(input: CityPageIdentity): Promise<CityQuickFacts>;
  getInternalLinks(input: CityPageIdentity): Promise<readonly CityInternalLinkGroup[]>;
  getFaqs(input: CityPageIdentity): Promise<readonly CityFaq[]>;
}>;
