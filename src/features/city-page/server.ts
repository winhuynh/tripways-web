import "server-only";

import { createCityPageUseCases } from "./application/get-city-read-models";
import { createEdgeCityPageRepository } from "./infrastructure/edge-city-page-repository";
import { readCityPageEnvironment } from "./infrastructure/city-page-environment";

function createUseCases() {
  return createCityPageUseCases(
    createEdgeCityPageRepository(readCityPageEnvironment()),
  );
}

export const cityPage = {
  getOverview: (...args: Parameters<ReturnType<typeof createUseCases>["getOverview"]>) =>
    createUseCases().getOverview(...args),
  getAirports: (...args: Parameters<ReturnType<typeof createUseCases>["getAirports"]>) =>
    createUseCases().getAirports(...args),
  getDestinations: (
    ...args: Parameters<ReturnType<typeof createUseCases>["getDestinations"]>
  ) => createUseCases().getDestinations(...args),
  getAirlines: (...args: Parameters<ReturnType<typeof createUseCases>["getAirlines"]>) =>
    createUseCases().getAirlines(...args),
  getInsights: (...args: Parameters<ReturnType<typeof createUseCases>["getInsights"]>) =>
    createUseCases().getInsights(...args),
  getInternalLinks: (
    ...args: Parameters<ReturnType<typeof createUseCases>["getInternalLinks"]>
  ) => createUseCases().getInternalLinks(...args),
  getFaqs: (...args: Parameters<ReturnType<typeof createUseCases>["getFaqs"]>) =>
    createUseCases().getFaqs(...args),
};
