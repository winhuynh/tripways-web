import { describe, expect, it } from "vitest";
import { parseHomepageStatisticsResponse } from "./homepage-response.dto";

describe("parseHomepageStatisticsResponse", () => {
  it("parses the bounded backend statistics contract", () => {
    const model = parseHomepageStatisticsResponse({
      city_count: 3,
      airport_count: 4,
      direct_route_count: 8,
      data_version: "a5247124-be06-4f38-87e3-b4369d8d8c71",
      generated_at: "2026-08-11T00:00:00Z",
    });

    expect(model).toEqual({
      cityCount: 3,
      airportCount: 4,
      directRouteCount: 8,
      dataVersion: "a5247124-be06-4f38-87e3-b4369d8d8c71",
      generatedAt: "2026-08-11T00:00:00Z",
    });
  });

  it("rejects malformed statistics", () => {
    expect(() =>
      parseHomepageStatisticsResponse({
        city_count: -1,
        airport_count: 4,
        direct_route_count: 8,
        data_version: "version",
        generated_at: "today",
      }),
    ).toThrow("ERR_HOMEPAGE_STATISTICS_CONTRACT");
  });
});
