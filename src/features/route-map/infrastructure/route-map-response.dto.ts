import type { RouteMapReadModel } from "../domain/route-map-model";

export function parseRouteMapResponse(value: unknown): RouteMapReadModel {
  try {
    const envelope = record(value);
    const data = record(envelope.data);
    const origin = record(data.origin);
    const meta = record(envelope.meta);

    if (origin.type !== "city") contractError();

    return {
      origin: {
        type: "city",
        name: string(origin.name),
        slug: string(origin.slug),
        latitude: coordinate(origin.latitude, -90, 90),
        longitude: coordinate(origin.longitude, -180, 180),
      },
      destinations: array(data.destinations).map((item) => {
        const destination = record(item);
        return {
          cityName: string(destination.city_name),
          citySlug: string(destination.city_slug),
          countryIso2: string(destination.country_iso2),
          countryName: string(destination.country_name),
          latitude: coordinate(destination.latitude, -90, 90),
          longitude: coordinate(destination.longitude, -180, 180),
          routePath: string(destination.route_path),
          originAirports: stringArray(destination.origin_airports),
          destinationAirports: stringArray(destination.destination_airports),
          airlines: stringArray(destination.airlines),
          shortestDurationMinutes: nonNegativeInteger(
            destination.shortest_duration_minutes,
          ),
          frequencyPerWeek: nullableNumber(destination.frequency_per_week),
        };
      }),
      meta: {
        dataVersion: string(meta.data_version),
        total: nonNegativeInteger(meta.total),
        omittedDestinationCount: nonNegativeInteger(
          meta.omitted_destination_count,
        ),
        limit: positiveInteger(meta.limit),
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "ERR_ROUTE_MAP_CONTRACT") {
      throw error;
    }
    contractError();
  }
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    contractError();
  }
  return value as Record<string, unknown>;
}

function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) contractError();
  return value;
}

function string(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) contractError();
  return value;
}

function stringArray(value: unknown): string[] {
  return array(value).map(string);
}

function coordinate(value: unknown, minimum: number, maximum: number): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < minimum ||
    value > maximum
  ) {
    contractError();
  }
  return value;
}

function nullableNumber(value: unknown): number | null {
  if (value === null) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    contractError();
  }
  return value;
}

function nonNegativeInteger(value: unknown): number {
  if (!Number.isInteger(value) || (value as number) < 0) contractError();
  return value as number;
}

function positiveInteger(value: unknown): number {
  const result = nonNegativeInteger(value);
  if (result === 0) contractError();
  return result;
}

function contractError(): never {
  throw new Error("ERR_ROUTE_MAP_CONTRACT");
}
