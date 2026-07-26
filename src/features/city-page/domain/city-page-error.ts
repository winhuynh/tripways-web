export type CityPageErrorCode =
  | "ERR_CITY_PAGE_INVALID_REQUEST"
  | "ERR_CITY_NOT_FOUND"
  | "ERR_CITY_PAGE_NOT_FOUND"
  | "ERR_CITY_PAGE_UNAVAILABLE"
  | "ERR_CITY_PAGE_CONTRACT";

export class CityPageError extends Error {
  constructor(
    readonly code: CityPageErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "CityPageError";
  }
}

/**
 * Identifies the stable domain errors that the App Router must translate into
 * a not-found response instead of a generic unavailable page.
 */
export function isCityPageNotFound(error: unknown): boolean {
  return error instanceof CityPageError &&
    (error.code === "ERR_CITY_NOT_FOUND" ||
      error.code === "ERR_CITY_PAGE_NOT_FOUND");
}
