import { describe, expect, it, vi } from "vitest";

import {
  focusRouteFeatures,
  resetRouteFeatures,
  ROUTE_LINE_PAINT,
  ROUTE_POINT_PAINT,
} from "./route-map-interaction";

describe("route map interaction", () => {
  it("activates one route and destination while dimming the others", () => {
    const setFeatureState = vi.fn();
    const port = { setFeatureState, removeFeatureState: vi.fn() };

    focusRouteFeatures(port, ["tokyo", "paris"], "tokyo");

    expect(setFeatureState).toHaveBeenCalledWith(
      { source: "route-map-lines", id: "route:tokyo" },
      { active: true, dimmed: false },
    );
    expect(setFeatureState).toHaveBeenCalledWith(
      { source: "route-map-lines", id: "route:paris" },
      { active: false, dimmed: true },
    );
    expect(setFeatureState).toHaveBeenCalledWith(
      { source: "route-map-points", id: "destination:tokyo" },
      { active: true, dimmed: false },
    );
  });

  it("removes transient state from all route and destination features", () => {
    const removeFeatureState = vi.fn();
    const port = { setFeatureState: vi.fn(), removeFeatureState };

    resetRouteFeatures(port, ["tokyo"]);

    expect(removeFeatureState).toHaveBeenCalledWith({
      source: "route-map-lines",
      id: "route:tokyo",
    });
    expect(removeFeatureState).toHaveBeenCalledWith({
      source: "route-map-points",
      id: "destination:tokyo",
    });
  });

  it("uses thin modern defaults and restrained active emphasis", () => {
    expect(ROUTE_LINE_PAINT["line-width"]).toContain(1.35);
    expect(ROUTE_LINE_PAINT["line-width"]).toContain(2.4);
    expect(ROUTE_POINT_PAINT["circle-radius"]).toContain(3.25);
    expect(ROUTE_POINT_PAINT["circle-radius"]).toContain(4.75);
    expect(ROUTE_POINT_PAINT["circle-radius"]).toContain(6);
  });
});
