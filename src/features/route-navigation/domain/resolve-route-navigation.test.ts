import { describe, expect, it } from "vitest";

import { resolveRouteNavigation } from "./resolve-route-navigation";

describe("resolveRouteNavigation", () => {
  it("returns the published canonical Route Page when both hubs have a route", () => {
    expect(resolveRouteNavigation("Bangkok", "Singapore")).toEqual({
      kind: "route",
      href: "/flights/bangkok-to-singapore",
    });
  });

  it("returns the origin City Hub when only the origin resolves", () => {
    expect(resolveRouteNavigation("Bangkok", "")).toEqual({
      kind: "city",
      href: "/flights-from/bangkok",
    });
  });

  it("falls back to the origin City Hub when the pair is not published", () => {
    expect(resolveRouteNavigation("Bangkok", "New York")).toEqual({
      kind: "city",
      href: "/flights-from/bangkok",
    });
  });

  it("does not navigate for an unresolved origin", () => {
    expect(resolveRouteNavigation("Unknown", "Singapore")).toBeNull();
  });
});
