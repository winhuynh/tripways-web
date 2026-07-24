import { describe, expect, it } from "vitest";

import { getAirport } from "./airport";
import { buildRouteMapData } from "./route-map";

describe("buildRouteMapData", () => {
  it("builds airport points, curved route lines, and geographic bounds", () => {
    const origin = getAirport("SGN");
    const destination = getAirport("LHR");
    expect(origin).toBeDefined();
    expect(destination).toBeDefined();

    const data = buildRouteMapData(origin!, [destination!]);

    expect(data.airports.features).toHaveLength(2);
    expect(data.routes.features).toHaveLength(1);
    expect(data.routes.features[0]?.geometry.coordinates.length).toBeGreaterThan(20);
    const routeCoordinates = data.routes.features[0]!.geometry.coordinates;
    expect(routeCoordinates.every(([longitude, latitude]) =>
      longitude >= data.bounds[0][0] &&
      longitude <= data.bounds[1][0] &&
      latitude >= data.bounds[0][1] &&
      latitude <= data.bounds[1][1],
    )).toBe(true);
    expect(data.bounds[1][1]).toBeGreaterThan(
      Math.max(origin!.latitude, destination!.latitude),
    );
  });
});
