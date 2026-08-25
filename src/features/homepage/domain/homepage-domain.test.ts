import { describe, expect, it } from "vitest";
import {
  DEFAULT_ORIGIN_HUB,
  findHub,
  getHubRouteNetwork,
  searchHubs,
} from "./homepage-routes-data";
import { calculateHaversineDistanceKm, resolveNearestHub } from "./homepage-geo";
import { interpolateGreatCircle } from "./interpolate-great-circle";
import { buildInteractiveRouteMapPopupHtml } from "@/shared/ui/interactive-route-map-popup";

describe("homepage-routes-data", () => {
  it("finds hubs by IATA code or city name", () => {
    expect(findHub("LHR")?.cityName).toBe("London");
    expect(findHub("london")?.iata).toBe("LHR");
    expect(findHub("Tokyo")?.iata).toBe("HND");
    expect(findHub("New York")?.iata).toBe("JFK");
    expect(findHub("Nonexistent")).toBeUndefined();
  });

  it("searches hubs with autocomplete query", () => {
    const results = searchHubs("new");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.cityName).toBe("New York");
  });

  it("returns route network for default hub (New York JFK)", () => {
    const network = getHubRouteNetwork(DEFAULT_ORIGIN_HUB);
    expect(network.origin.iata).toBe("JFK");
    expect(network.destinations.length).toBeGreaterThan(0);
    expect(network.destinations.some((d) => d.iata === "SIN")).toBe(true);
  });
});

describe("homepage-geo", () => {
  it("calculates distance between coordinates", () => {
    // London (51.47, -0.45) to Paris (49.00, 2.54) is ~344km
    const dist = calculateHaversineDistanceKm(51.47, -0.4543, 49.0097, 2.5479);
    expect(dist).toBeGreaterThan(300);
    expect(dist).toBeLessThan(400);
  });

  it("resolves nearest hub by city hint", () => {
    const hub = resolveNearestHub({ city: "Tokyo" });
    expect(hub.iata).toBe("HND");
  });

  it("resolves nearest hub by country code", () => {
    const hub = resolveNearestHub({ countryCode: "TH" });
    expect(hub.iata).toBe("BKK");
  });

  it("resolves nearest hub by latitude/longitude coordinates", () => {
    // Coordinates near Singapore (1.35, 103.8)
    const hub = resolveNearestHub({ latitude: 1.35, longitude: 103.8 });
    expect(hub.iata).toBe("SIN");
  });

  it("falls back to New York (JFK) when no input is provided", () => {
    expect(resolveNearestHub().iata).toBe("JFK");
  });
});

describe("interpolateGreatCircle", () => {
  it("generates an interpolated curve of positions between origin and destination", () => {
    const origin = { latitude: 40.6413, longitude: -73.7781 }; // JFK
    const dest = { latitude: 51.47, longitude: -0.4543 }; // LHR
    const points = interpolateGreatCircle(origin, dest, 48);

    expect(points.length).toBe(49);
    expect(points[0]?.[0]).toBeCloseTo(origin.longitude, 1);
    expect(points[0]?.[1]).toBeCloseTo(origin.latitude, 1);
    expect(points[points.length - 1]?.[0]).toBeCloseTo(dest.longitude, 1);
    expect(points[points.length - 1]?.[1]).toBeCloseTo(dest.latitude, 1);
  });

  it("returns single coordinate when origin and destination are identical", () => {
    const origin = { latitude: 40.6413, longitude: -73.7781 };
    const points = interpolateGreatCircle(origin, origin);
    expect(points).toEqual([[origin.longitude, origin.latitude]]);
  });
});

describe("buildInteractiveRouteMapPopupHtml", () => {
  it("escapes and generates structured popup markup with destination details and CTAs", () => {
    const html = buildInteractiveRouteMapPopupHtml({
      city: "Singapore",
      citySlug: "singapore",
      iata: "SIN",
      airportName: "Singapore Changi Airport",
      countryName: "Singapore",
      latitude: 1.3644,
      longitude: 103.9915,
      typicalDuration: "18h 50m",
      durationRange: "18h - 19h",
      minDuration: 1130,
      airlines: ["SQ"],
      routePath: "/flights/new-york-to-singapore",
    });

    expect(html).toContain("Singapore");
    expect(html).toContain("Singapore (SIN)");
    expect(html).toContain("18h 50m");
    expect(html).toContain("SQ");
    expect(html).toContain("18h - 19h");
    expect(html).toContain('href="/flights-from/singapore"');
    expect(html).toContain('href="/flights/new-york-to-singapore"');
    expect(html).toContain("EXPLORE SINGAPORE");
    expect(html).toContain("COMPARE NONSTOP FLIGHTS");
  });
});
