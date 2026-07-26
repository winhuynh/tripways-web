import { isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RouteMap } from "@/features/route-map";
import {
  HomeRouteMapContent,
  HomeRouteMapSection,
} from "./home-route-map-section";

const readModel = {
  origin: {
    type: "city" as const,
    name: "Bangkok",
    slug: "bangkok",
    latitude: 13.7563,
    longitude: 100.5018,
  },
  destinations: [],
  meta: {
    dataVersion: "test",
    total: 0,
    omittedDestinationCount: 0,
    limit: 100,
  },
};

describe("HomeRouteMapContent", () => {
  it("delegates available data to the reusable RouteMap feature", () => {
    const element = HomeRouteMapContent({
      result: { status: "available", data: readModel },
    });

    expect(isValidElement(element)).toBe(true);
    if (!isValidElement(element)) return;
    expect(element.type).toBe(RouteMap);
    expect(element.props).toMatchObject({ readModel });
  });

  it("isolates an unavailable route-map read", () => {
    const markup = renderToStaticMarkup(
      HomeRouteMapContent({
        result: { status: "unavailable", reason: "read_failed" },
      }),
    );

    expect(markup).toContain('aria-label="Global direct-route map"');
    expect(markup).toContain("Route map is temporarily unavailable");
  });

  it("keeps the homepage renderable when server environment is unavailable", async () => {
    const originalUrl = process.env.SUPABASE_URL;
    const originalKey = process.env.SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;

    try {
      const markup = renderToStaticMarkup(await HomeRouteMapSection());
      expect(markup).toContain("Route map is temporarily unavailable");
    } finally {
      restoreEnvironment("SUPABASE_URL", originalUrl);
      restoreEnvironment("SUPABASE_ANON_KEY", originalKey);
    }
  });
});

function restoreEnvironment(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
