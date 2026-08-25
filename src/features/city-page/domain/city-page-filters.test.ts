import { describe, expect, it } from "vitest";
import type { CityPageDestination } from "./city-page-model";
import { filterCityDestinations } from "./city-page-filters";

const mockDestinations: CityPageDestination[] = [
  {
    city: "Singapore",
    citySlug: "singapore",
    country: "Singapore",
    region: "SE Asia",
    originAirports: ["BKK"],
    airports: ["SIN"],
    airlines: ["SQ", "TG"],
    frequency: 84,
    minDuration: 145,
    maxDuration: 160,
    path: "/flights/bangkok-to-singapore",
    fareMin: 45,
    fareMax: 85,
  },
  {
    city: "London",
    citySlug: "london",
    country: "United Kingdom",
    region: "Europe",
    originAirports: ["BKK"],
    airports: ["LHR"],
    airlines: ["TG", "BA"],
    frequency: 14,
    minDuration: 720,
    maxDuration: 780,
    path: "/flights/bangkok-to-london",
    fareMin: 350,
    fareMax: 500,
  },
  {
    city: "Chiang Mai",
    citySlug: "chiang-mai",
    country: "Thailand",
    region: "SE Asia",
    originAirports: ["DMK", "BKK"],
    airports: ["CNX"],
    airlines: ["FD", "TG"],
    frequency: 70,
    minDuration: 70,
    maxDuration: 80,
    path: "/flights/bangkok-to-chiang-mai",
    fareMin: 25,
    fareMax: 40,
  },
];

describe("filterCityDestinations", () => {
  it("returns all destinations when no filters are set", () => {
    expect(filterCityDestinations(mockDestinations, {}, "Thailand")).toHaveLength(3);
  });

  it("filters by airline", () => {
    const result = filterCityDestinations(
      mockDestinations,
      { airlines: ["SQ"] },
      "Thailand",
    );
    expect(result).toHaveLength(1);
    expect(result[0].city).toBe("Singapore");
  });

  it("filters by departure airport", () => {
    const result = filterCityDestinations(
      mockDestinations,
      { departure_airports: ["DMK"] },
      "Thailand",
    );
    expect(result).toHaveLength(1);
    expect(result[0].city).toBe("Chiang Mai");
  });

  it("filters by max duration", () => {
    const result = filterCityDestinations(
      mockDestinations,
      { max_duration_minutes: 150 },
      "Thailand",
    );
    expect(result).toHaveLength(2); // Singapore (145m) and Chiang Mai (70m)
  });

  it("filters by route type (domestic vs international)", () => {
    const domestic = filterCityDestinations(
      mockDestinations,
      { route_type: "domestic" },
      "Thailand",
    );
    expect(domestic).toHaveLength(1);
    expect(domestic[0].city).toBe("Chiang Mai");

    const international = filterCityDestinations(
      mockDestinations,
      { route_type: "international" },
      "Thailand",
    );
    expect(international).toHaveLength(2);
  });
});
