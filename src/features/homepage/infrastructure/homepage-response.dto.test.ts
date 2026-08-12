import { describe, expect, it } from "vitest";
import { parseHomepageStatisticsResponse } from "./homepage-response.dto";

describe("parseHomepageStatisticsResponse", () => {
  it("parses the bounded backend statistics contract", () => {
    const model = parseHomepageStatisticsResponse({
      data: {
        origin_city_count: 3,
        origin_airport_count: 4,
        published_direct_route_count: 8,
      },
      meta: {
        data_version: "a5247124-be06-4f38-87e3-b4369d8d8c71",
        generated_at: "2026-08-11T00:00:00Z",
      },
      error: null,
    });

    expect(model).toEqual({
      originCityCount: 3,
      originAirportCount: 4,
      publishedDirectRouteCount: 8,
      dataVersion: "a5247124-be06-4f38-87e3-b4369d8d8c71",
      generatedAt: "2026-08-11T00:00:00Z",
    });
  });

  it("rejects malformed statistics", () => {
    expect(() =>
      parseHomepageStatisticsResponse({
        data: {
          origin_city_count: -1,
          origin_airport_count: 4,
          published_direct_route_count: 8,
        },
        meta: { data_version: "version", generated_at: "today" },
        error: null,
      }),
    ).toThrow("ERR_HOMEPAGE_STATISTICS_CONTRACT");
  });
});
