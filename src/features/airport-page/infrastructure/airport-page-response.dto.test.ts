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
      transport: [{ type: "train", name: "Airport Rail Link", summary: "Fast train", duration: { min_minutes: 26, max_minutes: 45 }, estimated_price: { min: 45, max: 45, currency: "THB" } }],
      parking: null,
      terminals: [{ code: "MAIN", name: "Main Terminal", status: "active" }],
      facilities: [], lounges: [], notices: [],
      faqs: [{ question: "Is Wi-Fi free?", answer: "Yes." }],
      internal_link_groups: [{ cluster: "city", links: [{ anchor_text: "Bangkok flights", path: "/flights-from/bangkok" }] }],
      provenance: { last_editorial_review: "2026-08-04T00:00:00Z", source_freshness_at: "2026-08-04T00:00:00Z", data_version: "v1" },
    });

    expect(model.airport.iata).toBe("BKK");
    expect(model.arrival.steps[0]?.title).toBe("Immigration");
    expect(model.transport[0]?.duration.maxMinutes).toBe(45);
    expect(model.links[0]?.links[0]?.href).toBe("/flights-from/bangkok");
  });

  it("rejects legacy flight-first airport payloads", () => {
    expect(() => parseAirportPageResponse({ airport: { iata: "BKK" }, featured_outbound_routes: [] })).toThrow("ERR_AIRPORT_PAGE_CONTRACT");
  });
});
