import type { HomepageModel } from "../domain/homepage-model";

export function parseHomepageStatisticsResponse(value: unknown): HomepageModel {
  try {
    const record = readRecord(value);
    return {
      cityCount: readCount(record.city_count),
      airportCount: readCount(record.airport_count),
      directRouteCount: readCount(record.direct_route_count),
      dataVersion: readUuid(record.data_version),
      generatedAt: readTimestamp(record.generated_at),
    };
  } catch {
    throw new Error("ERR_HOMEPAGE_STATISTICS_CONTRACT");
  }
}

function readRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error();
  return value as Record<string, unknown>;
}

function readCount(value: unknown): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error();
  return value as number;
}

function readUuid(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  ) {
    throw new Error();
  }
  return value;
}

function readTimestamp(value: unknown): string {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) throw new Error();
  return value;
}
