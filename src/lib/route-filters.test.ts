import { describe, expect, it } from "vitest";

import { parseRouteFilters } from "./route-filters";

describe("parseRouteFilters", () => {
  it("returns the small default query", () => {
    expect(parseRouteFilters({})).toEqual({
      max_stops: 1,
      limit: 20,
      offset: 0,
    });
  });

  it("normalizes supported filters", () => {
    expect(
      parseRouteFilters({
        stops: "0",
        airlines: "sq, vn,invalid",
        exclude: "bkk, sin,xx",
        duration: "1200",
        layover: "240",
        departure: "morning",
        limit: "12",
        offset: "4",
      }),
    ).toEqual({
      max_stops: 0,
      airlines: ["SQ", "VN"],
      exclude_airports: ["BKK", "SIN"],
      max_duration_minutes: 1200,
      max_layover_minutes: 240,
      departure_window: "morning",
      limit: 12,
      offset: 4,
    });
  });

  it("ignores unsupported or out-of-range values", () => {
    expect(
      parseRouteFilters({
        stops: "3",
        duration: "5000",
        layover: "20",
        departure: "dawn",
        limit: "500",
        offset: "-1",
      }),
    ).toEqual({
      max_stops: 1,
      limit: 20,
      offset: 0,
    });
  });
});
