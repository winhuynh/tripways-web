import "server-only";

import { createCityPageUseCases } from "./application/get-city-read-models";
import { createEdgeCityPageRepository } from "./infrastructure/edge-city-page-repository";
import { readCityPageEnvironment } from "./infrastructure/city-page-environment";

function createUseCases() {
  return createCityPageUseCases(
    createEdgeCityPageRepository(readCityPageEnvironment()),
  );
}

/**
 * Exposes lazily constructed server-only City Hub use cases. Recreating the
 * adapter per call keeps environment reads local and avoids module-load
 * failures during static rendering and tests.
 */
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
  getQuickFacts: (...args: Parameters<ReturnType<typeof createUseCases>["getQuickFacts"]>) =>
    createUseCases().getQuickFacts(...args),
  getInternalLinks: (
    ...args: Parameters<ReturnType<typeof createUseCases>["getInternalLinks"]>
  ) => createUseCases().getInternalLinks(...args),
  getFaqs: (...args: Parameters<ReturnType<typeof createUseCases>["getFaqs"]>) =>
    createUseCases().getFaqs(...args),
};
