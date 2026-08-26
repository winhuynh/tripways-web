import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FlightSearchBar } from "./flight-search-bar";
import { LocationSuggestDropdown } from "./location-suggest-dropdown";
import {
  searchLocationSuggestions,
  getNearbyAirports,
} from "../domain/location-suggest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Tripways Homepage Clean Search Bar & Autocomplete QA Test Suite", () => {
  describe("1. Clean Search Bar Layout (From, To, Direct, Multi-city)", () => {
    it("renders From, Swap, To, and Search CTA without dates, travelers, baggage or accommodation", () => {
      const html = renderToStaticMarkup(<FlightSearchBar />);

      // Cell 1: From
      expect(html).toContain("search-cell--from");
      expect(html).toContain("From");
      expect(html).toContain('value="London (LHR)"');
      expect(html).toContain('placeholder="Country, city or airport..."');

      // Swap button ⇄
      expect(html).toContain("search-swap-btn");
      expect(html).toContain('aria-label="Swap departure and destination"');

      // Cell 2: To
      expect(html).toContain("search-cell--to");
      expect(html).toContain("To");
      expect(html).toContain('value=""');

      // CTA Search flights button
      expect(html).toContain("search-submit-btn");
      expect(html).toContain("Search flights");

      // Mode & options
      expect(html).toContain("Flight search");
      expect(html).toContain("Multi-city search");
      expect(html).toContain("Direct flights only");

      // Removed bloat
      expect(html).not.toContain("Depart");
      expect(html).not.toContain("Return");
      expect(html).not.toContain("Travelers and cabin class");
      expect(html).not.toContain("Cabin bag &amp; checked bag");
      expect(html).not.toContain("Add accommodation");
    });
  });

  describe("2. Focus 'To' Input with Empty Query (Quick Actions)", () => {
    it("resolves quick actions: 'Explore everywhere' and 'Multi-city search' for empty 'To' query", () => {
      const suggestions = searchLocationSuggestions("", {
        includeQuickActions: true,
      });

      expect(suggestions).toHaveLength(2);
      expect(suggestions[0]?.title).toBe("Explore everywhere");
      expect(suggestions[0]?.type).toBe("action");
      expect(suggestions[0]?.actionType).toBe("everywhere");

      expect(suggestions[1]?.title).toBe("Multi-city search");
      expect(suggestions[1]?.type).toBe("action");
      expect(suggestions[1]?.actionType).toBe("multicity");
    });

    it("renders quick actions popover dropdown with distinct action styling and icons", () => {
      const suggestions = searchLocationSuggestions("", {
        includeQuickActions: true,
      });

      const html = renderToStaticMarkup(
        <LocationSuggestDropdown
          items={suggestions}
          query=""
          onSelect={vi.fn()}
        />,
      );

      expect(html).toContain("location-suggest-dropdown");
      expect(html).toContain("suggest-item--action");
      expect(html).toContain("Explore everywhere");
      expect(html).toContain("Multi-city search");
    });
  });

  describe("3. Autocomplete Search & Match Highlighting (e.g. 'ku', 'g', 'lon')", () => {
    it("returns expected multi-airport cities and specific airports for 'ku'", () => {
      const results = searchLocationSuggestions("ku", {
        includeQuickActions: true,
      });

      const titles = results.map((r) => r.title);
      expect(titles.some((t) => t.includes("Kuala Lumpur"))).toBe(true);
      expect(titles.some((t) => t.includes("Kutaisi"))).toBe(true);
      expect(titles.some((t) => t.includes("Kushiro"))).toBe(true);
      expect(titles.some((t) => t.includes("Kullu–Manali"))).toBe(true);
      expect(titles.some((t) => t.includes("Kuopio"))).toBe(true);
    });

    it("highlights matching letters 'Ku' in bold within dropdown items", () => {
      const results = searchLocationSuggestions("Ku", {
        includeQuickActions: false,
      });

      const html = renderToStaticMarkup(
        <LocationSuggestDropdown
          items={results}
          query="Ku"
          onSelect={vi.fn()}
        />,
      );

      expect(html).toContain('<strong class="suggest-highlight">Ku</strong>ala Lumpur (Any)');
    });
  });

  describe("4. Origin Nearby Airports (<300km Radius)", () => {
    it("calculates Great-Circle distances for London (LHR) and lists nearby airports within 300km", () => {
      const nearby = getNearbyAirports({
        originIata: "LHR",
        maxDistanceKm: 300,
      });

      expect(nearby.length).toBeGreaterThanOrEqual(2);
      expect(nearby[0]?.iata).toBe("LHR");
      expect(nearby[0]?.title).toBe("Heathrow Airport (LHR)");
      expect(nearby[0]?.subtitle).toBe("United Kingdom");

      const lgw = nearby.find((r) => r.iata === "LGW");
      expect(lgw).toBeDefined();
      expect(lgw?.distanceKm).toBeGreaterThanOrEqual(35);
      expect(lgw?.distanceKm).toBeLessThanOrEqual(45);
      expect(lgw?.subtitle).toBe("40 km from London, United Kingdom");
    });

    it("calculates Great-Circle distances for Da Nang (DAD) and lists nearby airports within 300km", () => {
      const nearby = getNearbyAirports({
        originIata: "DAD",
        maxDistanceKm: 300,
      });

      expect(nearby.length).toBeGreaterThanOrEqual(3);
      expect(nearby[0]?.iata).toBe("DAD");

      const hui = nearby.find((r) => r.iata === "HUI");
      expect(hui).toBeDefined();
      expect(hui?.distanceKm).toBeGreaterThanOrEqual(65);
      expect(hui?.distanceKm).toBeLessThanOrEqual(70);
      expect(hui?.subtitle).toContain("km from Da Nang, Vietnam");
    });
  });
});
