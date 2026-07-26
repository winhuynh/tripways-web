import { describe, expect, it } from "vitest";

import { parseRouteMapResponse } from "./route-map-response.dto";

const response = {
  data: {
    origin: {
      type: "city",
      name: "Bangkok",
      slug: "bangkok",
      latitude: 13.7563,
      longitude: 100.5018,
    },
    destinations: [
      {
        city_name: "Tokyo",
        city_slug: "tokyo",
        country_iso2: "JP",
        country_name: "Japan",
        latitude: 35.6762,
        longitude: 139.6503,
        route_path: "/flights/bangkok-to-tokyo",
        origin_airports: ["BKK"],
        destination_airports: ["NRT"],
        airlines: ["TG"],
        shortest_duration_minutes: 345,
        frequency_per_week: null,
      },
    ],
  },
  meta: {
    data_version: "90000000-0000-4000-8000-000000000001",
    total: 1,
    omitted_destination_count: 0,
    limit: 100,
  },
  error: null,
};

describe("parseRouteMapResponse", () => {
  it("maps the strict route-map envelope into the domain read model", () => {
    const result = parseRouteMapResponse(response);

    expect(result.origin).toMatchObject({ name: "Bangkok", type: "city" });
    expect(result.destinations[0]).toMatchObject({
      cityName: "Tokyo",
      frequencyPerWeek: null,
    });
    expect(result.meta).toEqual({
      dataVersion: "90000000-0000-4000-8000-000000000001",
      total: 1,
      omittedDestinationCount: 0,
      limit: 100,
    });
  });

  it("rejects non-finite destination coordinates", () => {
    const invalid = structuredClone(response);
    invalid.data.destinations[0]!.latitude = Number.NaN;

    expect(() => parseRouteMapResponse(invalid)).toThrow("ERR_ROUTE_MAP_CONTRACT");
  });
});
