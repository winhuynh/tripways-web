import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { routeSearchFixture } from "@/features/route-search/domain/route-search-model.fixture";
import type { CityPageModel } from "../domain/city-page-model";
import { CityPageScreen } from "./city-page-screen";

const model: CityPageModel = {
  city: { name: "Bangkok", slug: "bangkok" },
  country: { name: "Thailand", slug: "thailand" },
  seo: {
    h1: "Direct flights from Bangkok",
    subheadline: "Explore",
    title: "Bangkok",
    description: "Routes",
    intro: "Find routes.",
  },
  airports: [
    {
      iata: "BKK",
      name: "Suvarnabhumi Airport",
      primary: true,
      destinations: 128,
      airlines: 84,
    },
    {
      iata: "DMK",
      name: "Don Mueang Airport",
      primary: false,
      destinations: 64,
      airlines: 12,
    },
  ],
  quickFacts: { airports: 2, destinations: 182, countries: 67, airlines: 48 },
  destinations: [
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
  ],
  faqs: [
    {
      question: "Which airports serve Bangkok?",
      answer: "Suvarnabhumi (BKK) and Don Mueang (DMK).",
    },
  ],
  links: [],
  freshnessAt: "2026-08-04",
  canonicalPath: "/flights-from/bangkok",
};

describe("CityPageScreen", () => {
  it("renders hero, quick facts, sidebar filter, destination table, and airport comparison", () => {
    const html = renderToStaticMarkup(
      <CityPageScreen model={model} routes={routeSearchFixture} filterValues={{}} />,
    );
    expect(html).toContain("ASIA");
    expect(html).toContain("Direct flights from Bangkok");
    expect(html).toContain("182");
    expect(html).toContain("DESTINATIONS");
    expect(html).toContain("Find the nonstop flight that fits");
    expect(html).toContain("Nonstop destinations from Bangkok");
    expect(html).toContain("Showing 1 nonstop route option · 182 destinations in total");
    expect(html).toContain("Singapore");
    expect(html).toContain("Check fares ↗");
    expect(html).toContain("Route guide →");
    expect(html).toContain("Choose the Bangkok airport");
    expect(html).toContain("Suvarnabhumi");
    expect(html).toContain("Don Mueang");
    expect(html).toContain("Which airports serve Bangkok?");
  });

  it("renders RouteResults fallback when filtered destinations are empty", () => {
    const emptyModel = { ...model, destinations: [] };
    const html = renderToStaticMarkup(
      <CityPageScreen
        model={emptyModel}
        routes={{ ...routeSearchFixture, options: [] }}
        filterValues={{}}
      />,
    );
    expect(html).toContain("No verified routes match these filters.");
    expect(html).not.toContain("Nonstop destinations from Bangkok");
  });

  it("uses singular destination copy for a one-destination city page", () => {
    const html = renderToStaticMarkup(
      <CityPageScreen
        model={{ ...model, quickFacts: { ...model.quickFacts, destinations: 1 } }}
        routes={routeSearchFixture}
        filterValues={{}}
      />,
    );
    expect(html).toContain("Showing 1 nonstop route option · 1 destination in total");
  });

  it("uses the server-filtered route set for filters not present in the page payload", () => {
    const html = renderToStaticMarkup(
      <CityPageScreen
        model={model}
        routes={{ ...routeSearchFixture, options: [], total: 0 }}
        filterValues={{ days_of_week: ["2"] }}
      />,
    );
    expect(html).toContain("No verified routes match these filters.");
    expect(html).not.toContain("Nonstop destinations from Bangkok");
  });
});
