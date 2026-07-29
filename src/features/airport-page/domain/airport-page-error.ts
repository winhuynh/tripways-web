export class AirportPageError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export function isAirportPageNotFound(error: unknown): boolean {
  return error instanceof AirportPageError &&
    ["ERR_AIRPORT_NOT_FOUND", "ERR_AIRPORT_PAGE_NOT_FOUND"].includes(error.code);
}
