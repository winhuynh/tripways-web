import "server-only";

import { createEdgeAirportPageRepository } from "./infrastructure/edge-airport-page-repository";
import { readAirportPageEnvironment } from "./infrastructure/airport-page-environment";

export const airportPage = createEdgeAirportPageRepository(
  readAirportPageEnvironment(),
);
