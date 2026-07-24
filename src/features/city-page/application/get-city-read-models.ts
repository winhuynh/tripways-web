import type { CityPageRepository } from "./city-page-repository";
import { readOptionalModel } from "./read-model-result";
import type { CityDestinationQuery, CityPageIdentity } from "../domain/models";

export function createCityPageUseCases(repository: CityPageRepository) {
  return {
    getOverview: (input: CityPageIdentity) => repository.getOverview(input),
    getAirports: (input: CityPageIdentity) =>
      readOptionalModel(() => repository.getAirports(input), (value) => value.length === 0),
    getDestinations: (input: CityDestinationQuery) =>
      readOptionalModel(
        () => repository.getDestinations(input),
        (value) => value.destinations.length === 0,
      ),
    getAirlines: (input: CityPageIdentity) =>
      readOptionalModel(() => repository.getAirlines(input), (value) => value.length === 0),
    getInsights: (input: CityPageIdentity) =>
      readOptionalModel(() => repository.getInsights(input), () => false),
    getInternalLinks: (input: CityPageIdentity) =>
      readOptionalModel(() => repository.getInternalLinks(input), (value) => value.length === 0),
    getFaqs: (input: CityPageIdentity) =>
      readOptionalModel(() => repository.getFaqs(input), (value) => value.length === 0),
  };
}
