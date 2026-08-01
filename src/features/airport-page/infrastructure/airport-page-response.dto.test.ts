import { describe, expect, it } from "vitest";

import { parseAirportPageResponse } from "./airport-page-response.dto";

describe("airport page response DTO", () => {
  it("maps airport image and airline logo object paths", () => {
    const result = parseAirportPageResponse({
      data: {
        airport: {
          iata: "BKK",
          icao: "VTBS",
          name: "Suvarnabhumi Airport",
          slug: "suvarnabhumi-airport",
          image_path: "airports/BKK/hero.webp",
          timezone: "Asia/Bangkok",
          city: { name: "Bangkok", slug: "bangkok" },
          country: { code: "TH", name: "Thailand", slug: "thailand" },
        },
        seo: {
          h1: "BKK",
          subheadline: "Explore",
          title: "BKK routes",
          meta_description: "Routes",
          og_title: "BKK routes",
          og_description: "Routes",
        },
        content: {
          intro: "Intro",
          route_summary: "Routes",
          access_summary: null,
          parking_summary: null,
          lounge_summary: null,
        },
        quick_facts: {
          outbound_destinations: 1,
          outbound_countries: 1,
          inbound_origins: 1,
          inbound_countries: 1,
          airlines: 1,
          shortest_route_minutes: null,
          longest_route_minutes: null,
        },
        airlines: [{
          iata: "TG",
          name: "Thai Airways",
          slug: "thai-airways",
          logo_path: "airlines/TG/logo.svg",
          route_count: 1,
        }],
        access_options: [],
        parking: null,
        lounges: [],
        notices: [],
        faqs: [],
      },
      meta: {
        canonical_path: "/airports/suvarnabhumi-bkk",
        is_indexable: true,
        noindex_reason: null,
      },
      error: null,
    });

    expect(result.airport.imagePath).toBe("airports/BKK/hero.webp");
    expect(result.airlines[0]?.logoPath).toBe("airlines/TG/logo.svg");
  });
});
