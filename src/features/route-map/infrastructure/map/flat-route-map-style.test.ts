import { describe, expect, it } from "vitest";

import {
  calculateGlobalRouteMapZoom,
  FLAT_ROUTE_MAP_STYLE,
} from "./flat-route-map-style";

describe("FLAT_ROUTE_MAP_STYLE", () => {
  it("keeps a quiet global OpenFreeMap basemap with country labels", () => {
    expect(FLAT_ROUTE_MAP_STYLE.sources).toEqual({
      openmaptiles: {
        type: "vector",
        url: "https://tiles.openfreemap.org/planet",
        attribution:
          "OpenFreeMap © OpenMapTiles Data from OpenStreetMap contributors",
      },
    });
    expect(FLAT_ROUTE_MAP_STYLE.layers.map((layer) => layer.id)).toEqual([
      "flat-background",
      "flat-water",
      "flat-country-boundaries",
      "flat-disputed-boundaries",
      "flat-country-labels",
    ]);
    expect(
      FLAT_ROUTE_MAP_STYLE.layers.some((layer) => layer.type === "symbol"),
    ).toBe(true);
    expect(FLAT_ROUTE_MAP_STYLE.glyphs).toBe(
      "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    );
  });

  it("scales one 512px world to the available viewport width", () => {
    expect(calculateGlobalRouteMapZoom(1024)).toBe(1);
    expect(calculateGlobalRouteMapZoom(512)).toBe(0);
    expect(calculateGlobalRouteMapZoom(390)).toBeCloseTo(-0.39, 2);
  });
});
