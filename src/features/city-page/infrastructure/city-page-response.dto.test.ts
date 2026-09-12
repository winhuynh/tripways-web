import { describe, expect, it } from "vitest";
import { parseCityPageResponse } from "./city-page-response.dto";

describe("parseCityPageResponse", () => {
  it("parses the City Hub read model with full fields", () => {
    const model = parseCityPageResponse(
      {
        city: { name: "Bangkok", slug: "bangkok", latitude: 13.7563, longitude: 100.5018 },
        country: { name: "Thailand", slug: "thailand", iso2: "TH", region: "Asia" },
        page: {
          h1: "Direct flights from Bangkok",
          subheadline: "Explore routes",
          seo_title: "Bangkok flights",
          meta_description: "Direct routes",
          intro: "Find nonstop flights.",
        },
        airports: [
          {
            iata: "BKK",
            name: "Suvarnabhumi",
            is_primary: true,
            direct_destinations: 128,
            airlines: 84,
            hub_label: "Primary Hub",
            description: "Main international gateway",
            latitude: 13.69,
            longitude: 100.7501,
          },
        ],
        quick_facts: {
          airports: 2,
          direct_destinations: 182,
          direct_countries: 67,
          airlines: 48,
        },
        featured_destinations: [
          {
            city: { name: "Singapore", slug: "singapore", latitude: 1.3644, longitude: 103.9915 },
            country: { name: "Singapore", code: "SG", region: "SE Asia" },
            origin_airports: ["BKK", "DMK"],
            destination_airports: ["SIN"],
            airlines: ["SQ", "TG"],
            frequency_per_week: 84,
            shortest_duration_minutes: 145,
            longest_duration_minutes: 160,
            route_path: "/flights/bangkok-to-singapore",
            fare_estimate: { min: 45, max: 85, currency: "£" },
            is_top_route: true,
          },
        ],
        faqs: [],
        internal_link_groups: [],
      },
      { canonicalPath: "/flights-from/bangkok", freshnessAt: "2026-08-04" },
    );

    expect(model.city.slug).toBe("bangkok");
    expect(model.city.latitude).toBe(13.7563);
    expect(model.country.region).toBe("Asia");
    expect(model.country.code).toBe("TH");
    expect(model.quickFacts.destinations).toBe(182);

    const airport = model.airports[0];
    expect(airport?.iata).toBe("BKK");
    expect(airport?.role).toBe("Primary Hub");
    expect(airport?.description).toBe("Main international gateway");
    expect(airport?.latitude).toBe(13.69);

    const dest = model.destinations[0];
    expect(dest?.airports).toEqual(["SIN"]);
    expect(dest?.countryCode).toBe("SG");
    expect(dest?.region).toBe("SE Asia");
    expect(dest?.fareMin).toBe(45);
    expect(dest?.fareMax).toBe(85);
    expect(dest?.latitude).toBe(1.3644);
    expect(dest?.isTopRoute).toBe(true);
  });

  it("consolidates duplicate destination entries sharing the same route path", () => {
    const model = parseCityPageResponse({
      city: { name: "Hanoi", slug: "hanoi" },
      country: { name: "Vietnam", slug: "vietnam" },
      page: {
        h1: "Direct flights from Hanoi",
        subheadline: "Explore routes",
        seo_title: "Hanoi flights",
        meta_description: "Direct routes",
        intro: "Find nonstop flights.",
      },
      airports: [{ iata: "HAN", name: "Noi Bai", is_primary: true, direct_destinations: 40, airlines: 20 }],
      quick_facts: { airports: 1, direct_destinations: 40, direct_countries: 15, airlines: 20 },
      featured_destinations: [
        {
          city: { name: "Tokyo", slug: "tokyo" },
          country: { name: "Japan" },
          origin_airports: ["HAN"],
          destination_airports: ["NRT"],
          airlines: ["VN"],
          duration_minutes: 270,
          route_path: "/flights/hanoi-to-tokyo",
        },
        {
          city: { name: "Tokyo", slug: "tokyo" },
          country: { name: "Japan" },
          origin_airports: ["HAN"],
          destination_airports: ["HND"],
          airlines: ["NH", "JL"],
          duration_minutes: 260,
          route_path: "/flights/hanoi-to-tokyo",
        },
      ],
      faqs: [],
      internal_link_groups: [],
    });

    expect(model.destinations).toHaveLength(1);
    const tokyo = model.destinations[0];
    expect(tokyo.city).toBe("Tokyo");
    expect(tokyo.airports).toEqual(["NRT", "HND"]);
    expect(tokyo.airlines).toEqual(["VN", "NH", "JL"]);
    expect(tokyo.minDuration).toBe(260);
  });
});
