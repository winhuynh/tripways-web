import type { PriceEstimate } from "@/shared/domain/route-values";
import type { Facet, RouteSearchModel } from "../domain/route-search-model";

export function parseRouteSearchResponse(value: unknown): RouteSearchModel {
  try {
    const root = record(value);
    if (root.error !== null && root.error !== undefined) throw new Error();
    const meta = optionalRecord(root.meta);
    const facets = optionalRecord(meta?.facets);
    const dataList = list(root.data);

    return {
      options: dataList.map((item) => {
        const row = record(item);
        const from = text(row.from);
        const to = text(row.to);
        const stops = typeof row.stops === "number" ? row.stops : 0;
        const totalDuration =
          typeof row.total_duration_minutes === "number"
            ? row.total_duration_minutes
            : typeof row.flight_duration_minutes === "number"
              ? row.flight_duration_minutes
              : 120;
        const flightMinutes =
          typeof row.total_flight_minutes === "number"
            ? row.total_flight_minutes
            : totalDuration;
        const layoverMinutes =
          typeof row.layover_minutes === "number" ? row.layover_minutes : 0;

        return {
          id: optionalText(row.id) ?? `${from}-${to}-${stops}`,
          from,
          to,
          originCountry: optionalText(row.origin_country) ?? "",
          destinationCountry: optionalText(row.destination_country) ?? "",
          international:
            typeof row.is_international === "boolean"
              ? row.is_international
              : true,
          stops,
          connections: stringList(
            row.connection_airports ?? row.layover_airports ?? [],
          ),
          airlines: stringList(row.operating_airlines ?? []),
          flightMinutes,
          layoverMinutes,
          durationMinutes: totalDuration,
          routePath: nullableText(row.route_path),
          price: parsePrice(row.price),
        };
      }),
      total: typeof meta?.total === "number" ? meta.total : dataList.length,
      pageSize: typeof meta?.page_size === "number" ? meta.page_size : 20,
      nextCursor: nullableText(meta?.next_cursor),
      facets: {
        stops: parseFacets(facets?.stops),
        airlines: parseFacets(facets?.airlines),
        connections: parseFacets(facets?.connections),
        countries: parseFacets(facets?.countries),
        regions: parseFacets(facets?.regions),
      },
    };
  } catch {
    throw new Error("ERR_ROUTE_SEARCH_CONTRACT");
  }
}

function parsePrice(value: unknown): PriceEstimate {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { state: "unavailable", reason: "missing" };
  }
  const price = value as Record<string, unknown>;
  return price.state === "available"
    ? {
        state: "available",
        priceMin: numberValue(price.price_min ?? price.min),
        priceMax: numberValue(price.price_max ?? price.max),
        currencyCode: text(price.currency_code ?? price.currency ?? "USD"),
      }
    : {
        state: "unavailable",
        reason: typeof price.reason === "string" ? price.reason : "missing",
      };
}

function parseFacets(value: unknown): Facet[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const facet = record(item);
    return {
      value: String(facet.value),
      count: numberValue(facet.count),
    };
  });
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error();
  }
  return value as Record<string, unknown>;
}

function optionalRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error();
  return value;
}

function text(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) throw new Error();
  return value;
}

function optionalText(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function nullableText(value: unknown): string | null {
  return value === null || value === undefined ? null : text(value);
}

function numberValue(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error();
  return value;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
