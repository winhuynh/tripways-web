import { describe, expect, it } from "vitest";

import {
  parseCityAirportsResponse,
  parseCityOverviewResponse,
  parseCityQuickFactsResponse,
} from "./city-page-response.dto";

const envelope = (data: unknown, meta: Record<string, unknown> = {}) => ({
  status: "success",
  data,
  meta,
  error: null,
});

describe("city page DTO parser", () => {
  it("maps overview snake_case into a domain model", () => {
    const result = parseCityOverviewResponse(
      envelope(
        {
          city: {
            name: "Bangkok",
            slug: "bangkok",
            latitude: 13.7,
            longitude: 100.5,
            timezone: "Asia/Bangkok",
          },
          country: {
            iso2: "TH",
            name: "Thailand",
            slug: "thailand",
            region: "Asia",
          },
          content: { h1: "Direct flights", subheadline: "Explore", intro: "Intro", airport_summary: "Two" },
          seo: {
            title: "Direct flights",
            description: "Description",
            canonical_path: "/flights-from/bangkok",
            og_title: "Direct flights",
            og_description: "Description",
            og_image_path: null,
            is_indexable: false,
            noindex_reason: "fixture",
          },
          quick_facts: {
            airport_count: 2,
            direct_destination_count: 4,
            direct_country_count: 4,
            airline_count: 2,
            shortest_route_minutes: 95,
            longest_route_minutes: 785,
          },
        },
        { data_version: "v1" },
      ),
    );
    expect(result.city.slug).toBe("bangkok");
    expect(result.quickFacts.airportCount).toBe(2);
  });

  it("maps the current RPC counterpart quick-fact field names", () => {
    const result = parseCityOverviewResponse(
      envelope({
        city: {
          name: "Bangkok",
          slug: "bangkok",
          latitude: 13.7,
          longitude: 100.5,
          timezone: "Asia/Bangkok",
        },
        country: {
          iso2: "TH",
          name: "Thailand",
          slug: "thailand",
          region: "Asia",
        },
        content: {
          h1: "Direct flights",
          subheadline: "Explore",
          intro: "Intro",
          airport_summary: "Two",
        },
        seo: {
          title: "Direct flights",
          description: "Description",
          canonical_path: "/flights-from/bangkok",
          og_title: "Direct flights",
          og_description: "Description",
          og_image_path: null,
          is_indexable: false,
          noindex_reason: "fixture",
        },
        quick_facts: {
          airport_count: 2,
          direct_counterpart_city_count: 5,
          direct_counterpart_country_count: 4,
          airline_count: 2,
          shortest_route_minutes: 75,
          longest_route_minutes: 785,
        },
      }, { data_version: "current-rpc-v1" }),
    );

    expect(result.quickFacts.directDestinationCount).toBe(5);
    expect(result.quickFacts.directCountryCount).toBe(4);
  });

  it("rejects malformed section payloads", () => {
    expect(() => parseCityAirportsResponse(envelope([{ iata: "BKK" }]))).toThrow(
      "invalid response",
    );
  });

  it("maps complete airport hub statistics and editorial content", () => {
    const [airport] = parseCityAirportsResponse(
      envelope([
        {
          iata: "DMK",
          icao: "VTBD",
          name: "Don Mueang International Airport",
          slug: "don-mueang-international-airport",
          airport_type: "large_airport",
          latitude: 13.9126,
          longitude: 100.6068,
          timezone: "Asia/Bangkok",
          is_primary: false,
          hub_label: "LOW-COST HUB",
          description: "Bangkok's low-cost gateway.",
          display_order: 2,
          direct_destination_count: 3,
          domestic_destination_count: 1,
          international_destination_count: 2,
          domestic_destination_percentage: 33,
          international_destination_percentage: 67,
          airline_count: 1,
          dominant_airline_business_model: "low_cost",
          page_path: "/flights-from/bangkok/dmk",
        },
      ]),
    );

    expect(airport).toMatchObject({
      iata: "DMK",
      hubLabel: "LOW-COST HUB",
      displayOrder: 2,
      domesticDestinationPercentage: 33,
      internationalDestinationPercentage: 67,
      dominantAirlineBusinessModel: "low_cost",
    });
  });

  it("maps a complete city quick facts read model", () => {
    const result = parseCityQuickFactsResponse(
      envelope(
        {
          airport_count: 2,
          direct_destination_count: 5,
          direct_country_count: 5,
          airline_count: 2,
          shortest_route: {
            destination_name: "Chiang Mai",
            destination_slug: "chiang-mai",
            route_path: "/flights/bangkok-to-chiang-mai",
            duration_minutes: 75,
          },
          longest_route: {
            destination_name: "Paris",
            destination_slug: "paris",
            route_path: "/flights/bangkok-to-paris",
            duration_minutes: 785,
          },
        },
        { data_version: "version-1" },
      ),
    );

    expect(result).toEqual({
      airportCount: 2,
      directDestinationCount: 5,
      directCountryCount: 5,
      airlineCount: 2,
      shortestRoute: {
        destinationName: "Chiang Mai",
        destinationSlug: "chiang-mai",
        routePath: "/flights/bangkok-to-chiang-mai",
        durationMinutes: 75,
      },
      longestRoute: {
        destinationName: "Paris",
        destinationSlug: "paris",
        routePath: "/flights/bangkok-to-paris",
        durationMinutes: 785,
      },
      dataVersion: "version-1",
    });
  });
});
