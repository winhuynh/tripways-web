import type {
  AirportPageIdentity,
  AirportRouteFilters,
} from "../domain/models";

export function createAirportPageIdentity(
  airportSlug: string,
  locale = "en-GB",
): AirportPageIdentity {
  const normalized = airportSlug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{3}$/.test(normalized)) {
    throw new Error("ERR_AIRPORT_PAGE_INVALID_SLUG");
  }
  return {
    airportIata: normalized.slice(-3).toUpperCase(),
    locale,
  };
}

export function parseAirportPageFilters(
  input: Record<string, string | string[] | undefined>,
): AirportRouteFilters {
  const requestedDirection = single(input.direction)?.toLowerCase();
  const direction = requestedDirection === "inbound" ? "inbound" : "outbound";
  const airline = code(single(input.airline), 2);
  const country = code(single(input.country), 2);
  const durationText = single(input.duration);
  const duration = durationText && /^\d+$/.test(durationText)
    ? Number(durationText)
    : undefined;

  return {
    direction,
    ...(airline ? { airlines: [airline] } : {}),
    ...(country ? { countries: [country] } : {}),
    ...(duration && duration > 0 && duration <= 1440
      ? { maxDurationMinutes: duration }
      : {}),
  };
}

function code(value: string | undefined, length: number): string | undefined {
  const normalized = value?.trim().toUpperCase();
  return normalized && new RegExp(`^[A-Z0-9]{${length}}$`).test(normalized)
    ? normalized
    : undefined;
}

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
