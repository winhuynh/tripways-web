import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { RoutePageModel } from "../domain/route-page-model";
import { RoutePageScreen } from "./route-page-screen";

const model: RoutePageModel = {
  route: {
    origin: { name: "Bangkok", slug: "bangkok", iataCode: "BKK" },
    destination: { name: "London", slug: "london", iataCode: "LHR" },
    distanceMiles: 5920,
    distanceKm: 9527,
  },
  seo: {
    h1: "Flights from Bangkok to London",
    subheadline: "Compare options",
    title: "Bangkok to London Flights",
    description: "Flight options from Bangkok to London.",
    intro: "Comparing nonstop and connecting flight options from Bangkok to London.",
  },
  summary: {
    directOptions: 3,
    indirectOptions: 9,
    fastestDirectMinutes: 765,
    fastestIndirectMinutes: 900,
    weeklyDirectFlights: 19,
  },
  recommendations: [
    {
      badge: "FASTEST OPTION",
      variant: "fastest",
      title: "12h 45m direct (Thai Airways / BKK to LHR)",
    },
    {
      badge: "LOWEST FARE",
      variant: "lowest",
      title: "£380 one-stop (DMK to LHR)",
    },
  ],
  facts: [{ type: "timezone", title: "Time zone", body: "London is behind Bangkok." }],
  sections: [
    {
      type: "before_you_fly",
      heading: "Departing Bangkok",
      body: "Suvarnabhumi (BKK) is the primary international hub.",
    },
  ],
  faqs: [
    {
      question: "Is there a direct flight from Bangkok to London?",
      answer: "Yes, Thai Airways and EVA Air operate nonstop flights.",
    },
  ],
  affiliateOffers: [
    {
      title: "Search flights",
      href: "https://example.com/flights",
      type: "flights",
    },
  ],
  affiliateDisclosure: "Affiliate links · We may earn a commission",
  observedPrices: [],
};

describe("RoutePageScreen", () => {
  it("renders 2-column discovery workspace, hero fact badges, and sections", () => {
    const html = renderToStaticMarkup(<RoutePageScreen model={model} />);

    // Breadcrumbs
    expect(html).toContain("Flights from Bangkok");
    expect(html).toContain("Bangkok to London");

    // Hero & Fact Badges
    expect(html).toContain("Flights from Bangkok to London");
    expect(html).toContain("Nonstop available");
    expect(html).toContain("12h 45m typical");
    expect(html).toContain("19 weekly flights");
    expect(html).toContain("5,920 mi (9,527 km)");

    // Main Discovery Workspace
    expect(html).toContain("Find the flight option that fits");
    expect(html).toContain("Flight options from Bangkok to London");

    // Recommendations
    expect(html).toContain("Our Recommendations");
    expect(html).toContain("FASTEST OPTION");
    expect(html).toContain("LOWEST FARE");

    // Practical Planning Grid
    expect(html).toContain("Plan your Bangkok – London journey");
    expect(html).toContain("Departing Bangkok");
    expect(html).toContain("Time zone");

    // Sponsored Travel Services
    expect(html).toContain("Sponsored Travel Services");
    expect(html).toContain("Search flights");

    // FAQ
    expect(html).toContain("Frequently Asked Questions");
    expect(html).toContain("Is there a direct flight from Bangkok to London?");
  });

  it("renders flight option cards when route search results are provided", () => {
    const html = renderToStaticMarkup(
      <RoutePageScreen
        model={model}
        routes={{
          options: [
            {
              id: "opt-1",
              from: "BKK",
              to: "LHR",
              originCountry: "Thailand",
              destinationCountry: "United Kingdom",
              international: true,
              stops: 0,
              connections: [],
              airlines: ["TG", "BR"],
              flightMinutes: 765,
              layoverMinutes: 0,
              durationMinutes: 765,
              price: { state: "available", priceMin: 850, priceMax: 850, currencyCode: "GBP" },
              routePath: "/flights/bangkok-to-london",
            },
          ],
          total: 1,
          pageSize: 20,
          nextCursor: null,
          facets: {
            stops: [],
            countries: [],
            regions: [],
            airlines: [],
            connections: [],
          },
        }}
      />,
    );

    expect(html).toContain("BKK");
    expect(html).toContain("LHR");
    expect(html).toContain("NONSTOP");
    expect(html).toContain("12h 45m");
    expect(html).toContain("View BKK → LHR");
  });
});
