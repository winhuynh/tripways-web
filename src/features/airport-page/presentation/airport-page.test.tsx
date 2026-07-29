import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AirportPage } from "./airport-page";

describe("AirportPage", () => {
  it("renders route discovery and airport essentials", () => {
    const markup = renderToStaticMarkup(
      <AirportPage
        filters={{ direction: "outbound" }}
        model={{
          airport: {
            iata: "BKK",
            icao: "VTBS",
            name: "Suvarnabhumi Airport",
            slug: "suvarnabhumi-airport",
            timezone: "Asia/Bangkok",
            city: { name: "Bangkok", slug: "bangkok" },
            country: { code: "TH", name: "Thailand", slug: "thailand" },
          },
          seo: {
            h1: "Suvarnabhumi Airport (BKK)",
            subheadline: "Explore direct routes.",
            title: "BKK routes",
            description: "BKK routes",
            ogTitle: "BKK routes",
            ogDescription: "BKK routes",
          },
          content: {
            intro: "Bangkok international gateway.",
            routeSummary: "Compare direct routes.",
            accessSummary: "Rail and taxi access.",
            parkingSummary: "Parking is available.",
            loungeSummary: "Selected lounges.",
          },
          quickFacts: {
            outboundDestinations: 3,
            outboundCountries: 3,
            inboundOrigins: 2,
            inboundCountries: 2,
            airlines: 2,
            shortestRouteMinutes: 125,
            longestRouteMinutes: 800,
          },
          accessOptions: [{
            type: "rail",
            name: "Airport Rail Link",
            destinationLabel: "Central Bangkok",
            summary: "Rail connection.",
            durationMinMinutes: 25,
            durationMaxMinutes: 35,
          }],
          parking: { summary: "Parking is available." },
          lounges: [{
            name: "International Lounge",
            locationSummary: "International departures",
            accessSummary: "Eligibility applies.",
            amenities: ["wifi", "showers"],
          }],
          notices: [{
            title: "Check BKK or DMK",
            body: "Bangkok has two airports.",
            severity: "important",
          }],
          faqs: [{ question: "Where can I fly?", answer: "Use the route explorer." }],
          meta: {
            canonicalPath: "/airports/suvarnabhumi-bkk",
            isIndexable: false,
            noindexReason: "development_fixture",
          },
        }}
        routes={{
          direction: "outbound",
          total: 1,
          routes: [{
            airportIata: "SIN",
            airportName: "Changi",
            cityName: "Singapore",
            citySlug: "singapore",
            countryCode: "SG",
            countryName: "Singapore",
            routeCount: 1,
            airlineCount: 1,
            airlines: ["TG"],
            frequencyPerWeek: 14,
            shortestDurationMinutes: 125,
            longestDurationMinutes: 125,
          }],
        }}
      />,
    );
    expect(markup).toContain("BKK");
    expect(markup).toContain("Direct route explorer");
    expect(markup).toContain("Airport Rail Link");
    expect(markup).toContain("International Lounge");
  });
});
