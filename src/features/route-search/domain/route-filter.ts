export type RouteFilterField =
  | "direction"
  | "counterpart_query"
  | "departure_airports"
  | "destination_countries"
  | "destination_regions"
  | "counterpart_countries"
  | "counterpart_regions"
  | "airlines"
  | "route_type"
  | "max_stops"
  | "connection_airports"
  | "departure_time_buckets"
  | "max_duration_minutes"
  | "max_layover_minutes";

export const CITY_ROUTE_FILTER_FIELDS = [
  "departure_airports", "destination_countries", "destination_regions", "airlines",
  "route_type", "max_duration_minutes",
] as const satisfies readonly RouteFilterField[];

export const ROUTE_PAGE_FILTER_FIELDS = [
  "max_stops", "airlines", "connection_airports", "departure_time_buckets",
  "max_duration_minutes", "max_layover_minutes",
] as const satisfies readonly RouteFilterField[];

export const AIRPORT_ROUTE_FILTER_FIELDS = [
  "direction", "counterpart_query", "counterpart_countries", "counterpart_regions",
  "route_type", "airlines",
] as const satisfies readonly RouteFilterField[];

export type RouteFilterValues = Partial<Readonly<{
  direction: "from" | "to";
  counterpart_query: string;
  departure_airports: string[];
  destination_countries: string[];
  destination_regions: string[];
  counterpart_countries: string[];
  counterpart_regions: string[];
  airlines: string[];
  route_type: "all" | "domestic" | "international";
  max_stops: number;
  connection_airports: string[];
  departure_time_buckets: Array<"early_morning" | "morning" | "afternoon" | "evening">;
  max_duration_minutes: number;
  max_layover_minutes: number;
  after: string;
}>>;

export type RouteFilterQuery = Record<string, string | string[] | undefined>;

const arrayFields = new Set<RouteFilterField>([
  "departure_airports", "destination_countries", "destination_regions", "counterpart_countries",
  "counterpart_regions", "airlines", "connection_airports", "departure_time_buckets",
]);

export function parseRouteFilterQuery(
  query: RouteFilterQuery,
  enabledFields: readonly RouteFilterField[],
): RouteFilterValues {
  const values: Record<string, unknown> = {};
  const enabled = new Set(enabledFields);

  for (const field of enabledFields) {
    const raw = query[field];
    if (raw === undefined) continue;
    if (arrayFields.has(field)) {
      const normalized = normalizeList(field, raw);
      if (normalized.length > 0) values[field] = normalized;
      continue;
    }
    const normalized = normalizeScalar(field, first(raw));
    if (normalized !== undefined) values[field] = normalized;
  }

  const cursor = first(query.after);
  if (cursor && cursor.length <= 200 && !/\s/.test(cursor)) values.after = cursor;
  if (!enabled.has("direction")) delete values.direction;
  return values as RouteFilterValues;
}

export function serializeRouteSearchFilters(
  values: RouteFilterValues,
  enabledFields: readonly RouteFilterField[],
): Record<string, unknown> {
  const filters: Record<string, unknown> = {};
  for (const field of enabledFields) {
    if (field === "direction") continue;
    const value = values[field];
    if (value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0)) {
      filters[field] = value;
    }
  }
  return filters;
}

export function serializeRouteFilterQuery(values: RouteFilterValues, cursor?: string | null): string {
  const params = new URLSearchParams();
  for (const key of Object.keys(values).filter((key) => key !== "after").sort()) {
    const value = values[key as keyof RouteFilterValues];
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined && item !== "") params.append(key, String(item));
    }
  }
  if (cursor) params.set("after", cursor);
  return params.toString();
}

export function getUsableNextCursor(input: Readonly<{ total: number; pageSize: number; optionCount: number; nextCursor: string | null }>): string | null {
  return input.nextCursor && input.total > input.pageSize && input.optionCount === input.pageSize
    ? input.nextCursor
    : null;
}

export function serializeNonEmptyFilterEntries(entries: Iterable<readonly [string, FormDataEntryValue]>): string {
  const params = new URLSearchParams();
  for (const [key, rawValue] of entries) {
    if (typeof rawValue !== "string") continue;
    const value = rawValue.trim();
    if (value !== "") params.append(key, value);
  }
  return params.toString();
}

function normalizeList(field: RouteFilterField, raw: string | string[]): string[] {
  const values = Array.isArray(raw) ? raw : [raw];
  const normalized = values.flatMap((value) => value.split(",")).map((value) => value.trim());
  const valid = normalized.filter((value) => {
    if (field === "airlines") return /^[A-Za-z0-9]{2}$/.test(value);
    if (field === "departure_airports" || field === "connection_airports") return /^[A-Za-z0-9]{3}$/.test(value);
    if (field === "destination_countries" || field === "counterpart_countries") return /^[A-Za-z]{2}$/.test(value);
    if (field === "departure_time_buckets") return ["early_morning", "morning", "afternoon", "evening"].includes(value);
    return /^[A-Za-z0-9_-]{1,40}$/.test(value);
  }).map((value) => field === "destination_regions" || field === "counterpart_regions" || field === "departure_time_buckets" ? value : value.toUpperCase());
  return [...new Set(valid)];
}

function normalizeScalar(field: RouteFilterField, value: string | undefined): string | number | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (field === "direction") return trimmed === "to" ? "to" : trimmed === "from" ? "from" : undefined;
  if (field === "counterpart_query") return trimmed.length > 0 && trimmed.length <= 80 ? trimmed : undefined;
  if (field === "route_type") return ["all", "domestic", "international"].includes(trimmed) ? trimmed : undefined;
  const number = Number(trimmed);
  if (!Number.isInteger(number)) return undefined;
  if (field === "max_stops") return number >= 0 && number <= 3 ? number : undefined;
  if (field === "max_duration_minutes") return number >= 1 && number <= 10080 ? number : undefined;
  if (field === "max_layover_minutes") return number >= 1 && number <= 1440 ? number : undefined;
  return undefined;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
