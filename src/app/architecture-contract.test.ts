import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

function readRoute(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

describe("Next.js route architecture", () => {
  it("keeps the homepage route as a thin feature adapter", () => {
    const route = readRoute("./page.tsx");

    expect(route).toContain('import { HomePage } from "@/features/home-page";');
    expect(route).not.toContain("HomeHero");
    expect(route).not.toContain("HomeCorridors");
    expect(route).not.toContain("getHomePageReadModel");
  });

  it("keeps the City Hub route free of section loaders and filter parsing", () => {
    const route = readRoute("./flights-from/[citySlug]/page.tsx");

    expect(route).toContain("CityPage");
    expect(route).toContain("createCityPageMetadata");
    expect(route).not.toContain("async function MapSection");
    expect(route).not.toContain("async function DestinationsSection");
    expect(route).not.toContain("async function AirportsSection");
    expect(route).not.toContain("function destinationQuery");
  });

  it("keeps the destination API route focused on HTTP adaptation", () => {
    const route = readRoute("./api/city-page/destinations/route.ts");

    expect(route).toContain("parseCityDestinationsHttpRequest");
    expect(route).not.toContain('search.get("airport")');
    expect(route).not.toContain('search.get("city")');
  });
});
