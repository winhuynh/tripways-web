import { describe, expect, it } from "vitest";
import { parseRoutePageResponse } from "./route-page-response.dto";

describe("parseRoutePageResponse", () => {
  it("parses shell content with distances, recommendations, and facts", () => {
    const m = parseRoutePageResponse({
      route: {
        origin: { name: "Bangkok", slug: "bangkok", iata_code: "BKK" },
        destination: { name: "London", slug: "london", iata_code: "LHR" },
        distance_miles: 5920,
        distance_km: 9527,
      },
      seo: {
        h1: "Flights from Bangkok to London",
        subheadline: "Compare options",
        title: "Bangkok to London",
        meta_description: "Flight options",
        intro: "Plan the route.",
      },
      summary: {
        direct_options: 3,
        indirect_options: 9,
        fastest_direct_minutes: 765,
        fastest_indirect_minutes: 900,
        weekly_direct_flights: 19,
      },
      price: { state: "unavailable", reason: "missing" },
      airport_comparison: [],
      travel_facts: [
        { fact_type: "timezone", title: "Time zone", body: "London is behind Bangkok." },
      ],
      editorial_sections: [
        {
          section_type: "before_you_fly",
          heading: "Plan your journey",
          body: "Prepare before travel.",
        },
      ],
      faqs: [],
      affiliate: { offers: [], disclosure: "Partner disclosure" },
      internal_link_groups: [
        {
          cluster: "Reverse route",
          links: [{ anchor_text: "London to Bangkok", path: "/flights/london-to-bangkok" }],
        },
      ],
    });

    expect(m.route.origin.slug).toBe("bangkok");
    expect(m.route.origin.iataCode).toBe("BKK");
    expect(m.route.distanceMiles).toBe(5920);
    expect(m.route.distanceKm).toBe(9527);
    expect(m.summary.directOptions).toBe(3);
    expect(m.summary.weeklyDirectFlights).toBe(19);
    expect(m.recommendations?.[0]?.badge).toBe("FASTEST OPTION");
    expect(m.links?.[0]?.title).toBe("Reverse route");
    expect((m as unknown as Record<string, unknown>).options).toBeUndefined();
  });
});

describe("observed route prices", () => {
  it("parses an opaque observation reference without accepting internal IDs or affiliate URLs", () => {
    const model = parseRoutePageResponse({
      route: {
        origin: { name: "Ho Chi Minh City", slug: "ho-chi-minh-city" },
        destination: { name: "London", slug: "london" },
      },
      content: {
        seo: { h1: "Ho Chi Minh City to London flights" },
        intro: "Compare recent observations.",
      },
      route_options: [],
      observations: [
        {
          observation_ref: "obs_0123456789abcdef0123456789abcdef",
          observed_amount: 392,
          currency_code: "USD",
          departure_date: "2026-09-12",
          direct: true,
          observed_at: "2026-08-12T12:00:00Z",
          valid_until: "2026-08-19T12:00:00Z",
          affiliate_path: "/must-not-pass",
          observation_id: "00000000-0000-4000-8000-000000000001",
        },
      ],
      disclosure: "Cached observations are not live offers.",
    });

    expect(model.observedPrices[0]?.reference).toBe("obs_0123456789abcdef0123456789abcdef");
    expect(model.observedPrices[0]).not.toHaveProperty("id");
    expect(model.observedPrices[0]).not.toHaveProperty("affiliatePath");
    expect(model.recommendations?.some((r) => r.badge === "LOWEST FARE")).toBe(true);
  });
});
