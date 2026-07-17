export type DepartureWindow = "morning" | "afternoon" | "evening" | "night";

export type RouteFilters = {
  max_stops: 0 | 1;
  airlines?: string[];
  exclude_airports?: string[];
  max_duration_minutes?: number;
  max_layover_minutes?: number;
  departure_window?: DepartureWindow;
  limit: number;
  offset: number;
};

type SearchParams = Record<string, string | string[] | undefined>;

const DEPARTURE_WINDOWS = new Set<DepartureWindow>([
  "morning",
  "afternoon",
  "evening",
  "night",
]);

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseBoundedInteger(
  value: string | string[] | undefined,
  minimum: number,
  maximum: number,
): number | undefined {
  const rawValue = firstValue(value);
  if (!rawValue || !/^\d+$/.test(rawValue)) {
    return undefined;
  }

  const parsedValue = Number(rawValue);
  return parsedValue >= minimum && parsedValue <= maximum ? parsedValue : undefined;
}

function parseCodeList(
  value: string | string[] | undefined,
  pattern: RegExp,
): string[] | undefined {
  const rawValue = firstValue(value);
  if (!rawValue) {
    return undefined;
  }

  const values = [...new Set(rawValue.split(",").map((item) => item.trim().toUpperCase()))].filter(
    (item) => pattern.test(item),
  );

  return values.length > 0 ? values : undefined;
}

export function parseRouteFilters(searchParams: SearchParams): RouteFilters {
  const maxStops = parseBoundedInteger(searchParams.stops, 0, 1);
  const maxDuration = parseBoundedInteger(searchParams.duration, 1, 4320);
  const maxLayover = parseBoundedInteger(searchParams.layover, 45, 1440);
  const limit = parseBoundedInteger(searchParams.limit, 1, 100);
  const offset = parseBoundedInteger(searchParams.offset, 0, 10000);
  const departureValue = firstValue(searchParams.departure)?.toLowerCase() as
    | DepartureWindow
    | undefined;

  return {
    max_stops: maxStops === 0 ? 0 : 1,
    ...(parseCodeList(searchParams.airlines, /^[A-Z0-9]{2}$/) && {
      airlines: parseCodeList(searchParams.airlines, /^[A-Z0-9]{2}$/),
    }),
    ...(parseCodeList(searchParams.exclude, /^[A-Z]{3}$/) && {
      exclude_airports: parseCodeList(searchParams.exclude, /^[A-Z]{3}$/),
    }),
    ...(maxDuration !== undefined && { max_duration_minutes: maxDuration }),
    ...(maxLayover !== undefined && { max_layover_minutes: maxLayover }),
    ...(departureValue && DEPARTURE_WINDOWS.has(departureValue) && {
      departure_window: departureValue,
    }),
    limit: limit ?? 20,
    offset: offset ?? 0,
  };
}
