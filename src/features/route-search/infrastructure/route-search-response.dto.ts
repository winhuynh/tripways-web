import type { PriceEstimate } from "@/shared/domain/route-values";
import type { Facet, RouteSearchModel } from "../domain/route-search-model";

export function parseRouteSearchResponse(value: unknown): RouteSearchModel {
  try {
    const root = record(value);
    if (root.error !== null) throw new Error();
    const meta = record(root.meta);
    const facets = record(meta.facets);
    return {
      options: list(root.data).map((item) => {
        const row = record(item);
        return {
          id: text(row.id), from: text(row.from), to: text(row.to),
          originCountry: text(row.origin_country), destinationCountry: text(row.destination_country),
          international: booleanValue(row.is_international), stops: numberValue(row.stops),
          connections: stringList(row.connection_airports), airlines: stringList(row.operating_airlines),
          flightMinutes: numberValue(row.total_flight_minutes), layoverMinutes: numberValue(row.layover_minutes),
          durationMinutes: numberValue(row.total_duration_minutes), routePath: nullableText(row.route_path),
          price: parsePrice(row.price),
        };
      }),
      total: numberValue(meta.total), pageSize: numberValue(meta.page_size),
      nextCursor: nullableText(meta.next_cursor),
      facets: { stops: parseFacets(facets.stops), airlines: parseFacets(facets.airlines), connections: parseFacets(facets.connections), countries: parseFacets(facets.countries), regions: parseFacets(facets.regions) },
    };
  } catch { throw new Error("ERR_ROUTE_SEARCH_CONTRACT"); }
}

function parsePrice(value: unknown): PriceEstimate { const price=record(value); return price.state==="available" ? {state:"available",priceMin:numberValue(price.price_min),priceMax:numberValue(price.price_max),currencyCode:text(price.currency_code)} : {state:"unavailable",reason:text(price.reason)}; }
function parseFacets(value: unknown): Facet[] { return list(value).map((item)=>{const facet=record(item);return{value:String(facet.value),count:numberValue(facet.count)}}); }
function record(value: unknown): Record<string, unknown> { if(typeof value!=="object"||value===null||Array.isArray(value))throw new Error();return value as Record<string,unknown>; }
function list(value: unknown): unknown[] { if(!Array.isArray(value))throw new Error();return value; }
function text(value: unknown): string { if(typeof value!=="string"||value.length===0)throw new Error();return value; }
function nullableText(value: unknown): string|null { return value===null||value===undefined?null:text(value); }
function numberValue(value: unknown): number { if(typeof value!=="number"||!Number.isFinite(value))throw new Error();return value; }
function booleanValue(value: unknown): boolean { if(typeof value!=="boolean")throw new Error();return value; }
function stringList(value: unknown): string[] { return list(value).map(text); }
