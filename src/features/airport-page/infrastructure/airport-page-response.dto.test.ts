import { describe, expect, it } from "vitest";

import { parseAirportPageResponse } from "./airport-page-response.dto";

describe("parseAirportPageResponse", () => {
  it("parses the journey-led airport payload", () => {
    const model = parseAirportPageResponse({
      airport: { iata: "BKK", name: "Suvarnabhumi Airport", city: { name: "Bangkok", slug: "bangkok" }, country: { name: "Thailand", slug: "thailand" } },
      seo: { h1: "Suvarnabhumi Airport Guide", subheadline: "Thailand gateway", title: "BKK guide", meta_description: "Plan BKK journeys." },
      orientation: { intro: "Plan your journey.", summary: "Main gateway.", city_distance_km: 25, terminal_count: 2 },
      quick_answers: { default_transport: { name: "Airport Rail Link", typical_minutes: { min: 26, max: 45 }, estimated_price: { min: 45, max: 45, currency: "THB" } }, city_distance_km: 25, terminal_count: 2 },
      arrival: { summary: "Arrival guidance", steps: [{ audience: "all", title: "Immigration", body: "Follow signs." }] },
      departure: { summary: "Departure guidance", steps: [{ audience: "all", title: "Check-in", body: "Arrive early." }] },
      transport: [{ direction: "from_airport", type: "rail", name: "Airport Rail Link", destination_label: "Phaya Thai", summary: "Fast train", duration: { min_minutes: 26, max_minutes: 45 }, estimated_price: { min: 45, max: 45, currency: "THB" }, operating_hours_summary: "06:00–00:00", pickup_location_summary: "Basement level", best_for_label: "Predictable travel", luggage_summary: "Space for standard luggage", accessibility_summary: "Step-free access", booking_url: null, source_url: "https://example.com/rail", last_verified_at: "2026-08-04T00:00:00Z" }],
      parking: null,
      terminals: [{ code: "MAIN", name: "Main Terminal", status: "active" }],
      facilities: [], lounges: [{ name: "Miracle Lounge", location_summary: "Concourse D, airside", location_type: "airside", access_summary: "Eligible memberships or paid entry", operating_hours_summary: "Open 24 hours", amenities: ["wifi", "food", "showers"], estimated_price: { min: 1200, max: 1500, currency: "THB" }, affiliate_url: "https://example.com/lounge", source_url: "https://example.com/lounge-source", last_verified_at: "2026-08-04T00:00:00Z" }], notices: [],
      faqs: [{ question: "Is Wi-Fi free?", answer: "Yes." }],
      internal_link_groups: [{ cluster: "city", links: [{ anchor_text: "Bangkok flights", path: "/flights-from/bangkok" }] }],
      provenance: { last_editorial_review: "2026-08-04T00:00:00Z", source_freshness_at: "2026-08-04T00:00:00Z", route_data_refreshed_at: "2026-08-05T00:00:00Z", data_version: "v1" },
    });

    expect(model.airport.iata).toBe("BKK");
    expect(model.arrival.steps[0]?.title).toBe("Immigration");
    expect(model.transport[0]?.duration.maxMinutes).toBe(45);
    expect(model.transport[0]?.direction).toBe("from_airport");
    expect(model.transport[0]?.pickupLocation).toBe("Basement level");
    expect(model.lounges[0]?.estimatedPrice?.currency).toBe("THB");
    expect(model.lounges[0]?.affiliateUrl).toBe("https://example.com/lounge");
    expect(model.provenance.routeDataRefreshedAt).toBe("2026-08-05T00:00:00Z");
    expect(model.links[0]?.links[0]?.href).toBe("/flights-from/bangkok");
  });

  it("rejects legacy flight-first airport payloads", () => {
    expect(() => parseAirportPageResponse({ airport: { iata: "BKK" }, featured_outbound_routes: [] })).toThrow("ERR_AIRPORT_PAGE_CONTRACT");
  });
});
