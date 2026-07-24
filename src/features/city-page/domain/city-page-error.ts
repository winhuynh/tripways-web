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
