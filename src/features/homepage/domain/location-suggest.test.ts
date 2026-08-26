import { describe, expect, it } from "vitest";
import {
  getNearbyAirports,
  searchLocationSuggestions,
} from "./location-suggest";

describe("location-suggest domain (English-first)", () => {
  describe("empty query & quick actions", () => {
    it("returns English quick actions when query is empty and no origin is set", () => {
      const results = searchLocationSuggestions("");
      expect(results).toHaveLength(2);
      expect(results[0]?.title).toBe("Explore everywhere");
      expect(results[0]?.actionType).toBe("everywhere");
      expect(results[1]?.title).toBe("Multi-city search");
      expect(results[1]?.actionType).toBe("multicity");
    });
  });

  describe("nearby airports within 300km radius for any origin airport", () => {
    it("calculates nearby airports for London (LHR) within 300km (Gatwick, Luton, Stansted)", () => {
      const nearby = getNearbyAirports({
        originIata: "LHR",
        maxDistanceKm: 300,
      });

      expect(nearby.length).toBeGreaterThanOrEqual(2);

      // Origin at top
      expect(nearby[0]?.iata).toBe("LHR");
      expect(nearby[0]?.title).toBe("Heathrow Airport (LHR)");
      expect(nearby[0]?.subtitle).toBe("United Kingdom");

      // Next is Gatwick (LGW) ~40km away
      const lgw = nearby.find((item) => item.iata === "LGW");
      expect(lgw).toBeDefined();
      expect(lgw?.title).toBe("Gatwick Airport (LGW)");
      expect(lgw?.distanceKm).toBeGreaterThanOrEqual(35);
      expect(lgw?.distanceKm).toBeLessThanOrEqual(45);
      expect(lgw?.subtitle).toContain("km from London, United Kingdom");
    });

    it("calculates nearby airports for Da Nang (DAD) within 300km (Hue, Tam Ky / Chu Lai)", () => {
      const nearby = getNearbyAirports({
        originIata: "DAD",
        maxDistanceKm: 300,
      });

      expect(nearby.length).toBeGreaterThanOrEqual(3);
      expect(nearby[0]?.iata).toBe("DAD");

      // Hue (HUI) ~66-67km away
      const hui = nearby.find((item) => item.iata === "HUI");
      expect(hui).toBeDefined();
      expect(hui?.distanceKm).toBeGreaterThanOrEqual(65);
      expect(hui?.distanceKm).toBeLessThanOrEqual(70);
      expect(hui?.subtitle).toContain("km from Da Nang, Vietnam");

      // Chu Lai / Tam Ky (VCL) ~88km away
      const vcl = nearby.find((item) => item.iata === "VCL");
      expect(vcl).toBeDefined();
      expect(vcl?.distanceKm).toBeGreaterThanOrEqual(85);
      expect(vcl?.distanceKm).toBeLessThanOrEqual(92);
      expect(vcl?.subtitle).toContain("km from Da Nang, Vietnam");
    });

    it("returns nearby airports when query is empty but origin IATA is specified", () => {
      const results = searchLocationSuggestions("", { originIata: "LHR" });
      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results[0]?.iata).toBe("LHR");
      expect(results.some((r) => r.iata === "LGW")).toBe(true);
    });
  });

  describe("query prefix search for any character (e.g. 'ku', 'G', 'lon')", () => {
    it("suggests Kuala Lumpur, Kutaisi, Kushiro, Kullu-Manali, Kuopio when typing 'ku'", () => {
      const results = searchLocationSuggestions("ku", { includeQuickActions: true });
      const titles = results.map((r) => r.title);

      expect(titles.some((t) => t.includes("Kuala Lumpur"))).toBe(true);
      expect(titles.some((t) => t.includes("Kutaisi"))).toBe(true);
      expect(titles.some((t) => t.includes("Kushiro"))).toBe(true);
      expect(titles.some((t) => t.includes("Kullu–Manali"))).toBe(true);
      expect(titles.some((t) => t.includes("Kuopio"))).toBe(true);

      // Check quick actions attached at bottom
      expect(titles).toContain("Explore everywhere");
      expect(titles).toContain("Multi-city search");
    });

    it("suggests Guangzhou, Geneva, Gold Coast, Gimpo, Gimhae, Glasgow when typing 'G'", () => {
      const results = searchLocationSuggestions("G", { limit: 15, includeQuickActions: true });
      const titles = results.map((r) => r.title);

      expect(titles.some((t) => t.includes("Guangzhou"))).toBe(true);
      expect(titles.some((t) => t.includes("Geneva"))).toBe(true);
      expect(titles.some((t) => t.includes("Gold Coast"))).toBe(true);
      expect(titles.some((t) => t.includes("Gimpo"))).toBe(true);
      expect(titles.some((t) => t.includes("Gimhae"))).toBe(true);
      expect(titles.some((t) => t.includes("Glasgow"))).toBe(true);
    });

    it("matches IATA code directly (e.g. 'LHR', 'JFK', 'SIN', 'KUL', 'GVA', 'CAN')", () => {
      const results = searchLocationSuggestions("LHR");
      expect(results[0]?.iata).toBe("LHR");

      const resultsGVA = searchLocationSuggestions("GVA");
      expect(resultsGVA[0]?.iata).toBe("GVA");
    });
  });
});
