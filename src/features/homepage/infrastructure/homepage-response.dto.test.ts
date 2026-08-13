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
        data_version: "v_0123456789abcdef0123456789abcdef",
        generated_at: "2026-08-11T00:00:00Z",
      },
      error: null,
    });

    expect(model).toEqual({
      originCityCount: 3,
      originAirportCount: 4,
      publishedDirectRouteCount: 8,
      dataVersion: "v_0123456789abcdef0123456789abcdef",
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
