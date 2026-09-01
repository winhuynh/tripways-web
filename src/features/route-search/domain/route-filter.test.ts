import { describe, expect, it } from "vitest";

import {
  AIRPORT_ROUTE_FILTER_FIELDS,
  CITY_ROUTE_FILTER_FIELDS,
  ROUTE_PAGE_FILTER_FIELDS,
  parseRouteFilterQuery,
  getUsableNextCursor,
  serializeNonEmptyFilterEntries,
  serializeRouteSearchFilters,
  serializeRouteFilterQuery,
} from "./route-filter";

describe("master route filter contract", () => {
  it("normalizes only City fields and rejects malformed values", () => {
    const values = parseRouteFilterQuery({
      departure_airports: "bkk",
      destination_countries: ["sg", "INVALID"],
      destination_regions: "asia",
      airlines: ["tg", "TOO-LONG"],
      route_type: "international",
      max_duration_minutes: "900",
      max_stops: "3",
    }, CITY_ROUTE_FILTER_FIELDS);

    expect(values).toEqual({
      departure_airports: ["BKK"],
      destination_countries: ["SG"],
      destination_regions: ["asia"],
      airlines: ["TG"],
      route_type: "international",
      max_duration_minutes: 900,
    });
  });

  it("supports Route fields, bounded numeric values and cursor", () => {
    const values = parseRouteFilterQuery({
      max_stops: "2",
      connection_airports: ["sin", "DOHA"],
      days_of_week: ["1", "5", "6", "7", "invalid", "9"],
      departure_time_buckets: ["morning", "invalid"],
      max_layover_minutes: "180",
      after: "1:900:0.8:00000000-0000-0000-0000-000000000001",
    }, ROUTE_PAGE_FILTER_FIELDS);

    expect(values.max_stops).toBe(2);
    expect(values.connection_airports).toEqual(["SIN"]);
    expect(values.days_of_week).toEqual(["1", "5", "6", "7"]);
    expect(values.departure_time_buckets).toEqual(["morning"]);
    expect(values.max_layover_minutes).toBe(180);
    expect(values.after).toContain("00000000-0000-0000-0000-000000000001");
  });


  it("keeps Airport scope direct-only by ignoring forbidden filters", () => {
    const values = parseRouteFilterQuery({
      direction: "to",
      counterpart_query: " sgn ",
      counterpart_countries: "vn",
      route_type: "international",
      max_duration_minutes: "600",
      max_stops: "2",
    }, AIRPORT_ROUTE_FILTER_FIELDS);

    expect(values).toEqual({
      direction: "to",
      counterpart_query: "sgn",
      counterpart_countries: ["VN"],
      route_type: "international",
    });
  });

  it("serializes RPC filters and preserves values in pagination URLs", () => {
    const values = parseRouteFilterQuery({
      airlines: ["TG", "SQ"],
      max_stops: "1",
      after: "cursor",
    }, ROUTE_PAGE_FILTER_FIELDS);

    expect(serializeRouteSearchFilters(values, ROUTE_PAGE_FILTER_FIELDS)).toEqual({
      airlines: ["TG", "SQ"],
      max_stops: 1,
    });
    expect(serializeRouteFilterQuery(values, "next-cursor")).toBe(
      "airlines=TG&airlines=SQ&max_stops=1&after=next-cursor",
    );
  });

  it("maps UI-only fare and all-stops values to the canonical API contract", () => {
    const values = parseRouteFilterQuery({
      max_stops: "3",
      max_one_way_fare: "450",
      days_of_week: ["1", "5"],
    }, ROUTE_PAGE_FILTER_FIELDS);

    expect(serializeRouteSearchFilters(values, ROUTE_PAGE_FILTER_FIELDS)).toEqual({
      days_of_week: [1, 5],
    });

    expect(serializeRouteSearchFilters(
      { max_one_way_fare: 450 },
      CITY_ROUTE_FILTER_FIELDS,
    )).toEqual({ price_max: 450, currency: "USD" });
  });

  it("hides backend cursors when the current result set cannot have another page", () => {
    expect(getUsableNextCursor({ total: 6, pageSize: 20, optionCount: 6, nextCursor: "cursor" })).toBeNull();
    expect(getUsableNextCursor({ total: 21, pageSize: 20, optionCount: 20, nextCursor: "cursor" })).toBe("cursor");
  });

  it("omits empty native form controls from filter URLs", () => {
    expect(serializeNonEmptyFilterEntries([
      ["departure_airports", "BKK"],
      ["max_duration_minutes", ""],
      ["max_stops", "3"],
      ["route_type", "all"],
      ["airlines", "TG"],
      ["airlines", "SQ"],
    ])).toBe("departure_airports=BKK&airlines=TG&airlines=SQ");
  });
});
