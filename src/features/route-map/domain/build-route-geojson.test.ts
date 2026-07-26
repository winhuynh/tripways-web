import { describe, expect, it } from "vitest";

import { buildRouteGeoJson } from "./build-route-geojson";
import type { RouteMapReadModel } from "./route-map-model";

const readModel: RouteMapReadModel = {
  origin: {
    type: "city",
    name: "Bangkok",
    slug: "bangkok",
    latitude: 13.7563,
    longitude: 100.5018,
  },
  destinations: [
    {
      cityName: "Tokyo",
      citySlug: "tokyo",
      countryIso2: "JP",
      countryName: "Japan",
      latitude: 35.6762,
      longitude: 139.6503,
      routePath: "/flights/bangkok-to-tokyo",
      originAirports: ["BKK", "DMK"],
      destinationAirports: ["HND", "NRT"],
      airlines: ["JL", "TG"],
      shortestDurationMinutes: 345,
      frequencyPerWeek: 42,
    },
  ],
  meta: {
    dataVersion: "90000000-0000-4000-8000-000000000001",
    total: 1,
    omittedDestinationCount: 0,
    limit: 100,
  },
};

describe("buildRouteGeoJson", () => {
  it("builds distinct origin and destination points with one great-circle route", () => {
    const result = buildRouteGeoJson(readModel);

    expect(result.points.features).toHaveLength(2);
    expect(result.points.features[0]?.properties.role).toBe("origin");
    expect(result.points.features[1]?.properties.role).toBe("destination");
    expect(result.points.features[1]?.id).toBe("destination:tokyo");
    expect(result.routes.features).toHaveLength(1);
    expect(result.routes.features[0]?.id).toBe("route:tokyo");
    expect(result.routes.features[0]?.properties.citySlug).toBe("tokyo");
    expect(result.routes.features[0]?.geometry.coordinates).toHaveLength(65);
    expect(result.bounds[0][0]).toBeLessThanOrEqual(100.5018);
    expect(result.bounds[1][0]).toBeGreaterThanOrEqual(139.6503);
  });
});
