import type { ReadModelResult } from "../application/read-model-result";
import type {
  CityDestinationQuery,
  CityDestinationResult,
} from "../domain/models";

/**
 * Carries a stable public error code and HTTP status from request parsing to
 * the thin Next.js route adapter.
 */
export class CityDestinationsHttpError extends Error {
  constructor(
    readonly code: "ERR_INVALID_REQUEST",
    readonly status: 400,
  ) {
    super(code);
    this.name = "CityDestinationsHttpError";
  }
}

/**
 * Parses the public destination endpoint query into the bounded City Page
 * application query. It owns URL normalization, not route-discovery rules.
 */
export function parseCityDestinationsHttpRequest(
  request: Request,
): CityDestinationQuery {
  const search = new URL(request.url).searchParams;
  const citySlug = search.get("city")?.trim().toLowerCase();

  if (!citySlug) {
    throw new CityDestinationsHttpError("ERR_INVALID_REQUEST", 400);
  }

  const airport = search.get("airport")?.trim().toUpperCase();

  return {
    citySlug,
    locale: "en-GB",
    ...(airport ? { originAirports: [airport] } : {}),
    limit: 20,
    offset: 0,
  };
}

/**
 * Wraps the application read result in the stable JSON envelope consumed by
 * the public destination endpoint.
 */
export function createCityDestinationsHttpResponse(
  result: ReadModelResult<CityDestinationResult>,
) {
  return { data: result, error: null };
}
