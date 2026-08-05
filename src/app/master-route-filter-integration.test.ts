import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("master route filter integration", () => {
  it("uses one shared filter on City, Route and Airport screens", () => {
    for (const path of [
      "src/features/city-page/presentation/city-page-screen.tsx",
      "src/features/route-page/presentation/route-page-screen.tsx",
      "src/features/airport-page/presentation/airport-page-screen.tsx",
    ]) {
      expect(read(path)).toContain("<MasterRouteFilter");
    }
    expect(read("src/features/homepage/presentation/homepage-screen.tsx")).not.toContain("MasterRouteFilter");
  });

  it("normalizes every page query through the shared contract", () => {
    for (const path of [
      "src/app/flights-from/[citySlug]/page.tsx",
      "src/app/flights/[routeSlug]/page.tsx",
      "src/app/airports/[airportSlug]/page.tsx",
    ]) {
      const source = read(path);
      expect(source).toContain("parseRouteFilterQuery(");
      expect(source).toContain("serializeRouteSearchFilters(");
    }
  });
});
