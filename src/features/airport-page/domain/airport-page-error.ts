export type AirportPageErrorCode =
  | "ERR_AIRPORT_NOT_FOUND"
  | "ERR_AIRPORT_PAGE_NOT_FOUND"
  | "ERR_AIRPORT_PAGE_UNAVAILABLE"
  | "ERR_AIRPORT_PAGE_CONTRACT";

export class AirportPageError extends Error {
  constructor(
    readonly code: AirportPageErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AirportPageError";
  }
}

export function isAirportPageNotFound(error: unknown): boolean {
  return error instanceof AirportPageError &&
    ["ERR_AIRPORT_NOT_FOUND", "ERR_AIRPORT_PAGE_NOT_FOUND"].includes(error.code);
}
