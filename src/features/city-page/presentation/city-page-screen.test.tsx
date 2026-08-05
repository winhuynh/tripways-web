import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { routeSearchFixture } from "@/features/route-search/domain/route-search-model.fixture";
import type { CityPageModel } from "../domain/city-page-model";
import { CityPageScreen } from "./city-page-screen";

const model: CityPageModel = { city: { name: "Bangkok", slug: "bangkok" }, country: { name: "Thailand", slug: "thailand" }, seo: { h1: "Direct flights from Bangkok", subheadline: "Explore", title: "Bangkok", description: "Routes", intro: "Find routes." }, airports: [{ iata: "BKK", name: "Suvarnabhumi", primary: true, destinations: 128, airlines: 84 }], quickFacts: { airports: 2, destinations: 182, countries: 67, airlines: 48 }, destinations: [{ city: "Singapore", citySlug: "singapore", country: "Singapore", originAirports: ["BKK"], airports: ["SIN"], airlines: ["SQ"], frequency: 84, minDuration: 145, maxDuration: 160, path: "/flights/bangkok-to-singapore" }], faqs: [], links: [], freshnessAt: "2026-08-04", canonicalPath: "/flights-from/bangkok" };

describe("CityPageScreen", () => {
  it("renders filters, top route, table and airports", () => {
    const html = renderToStaticMarkup(<CityPageScreen model={model} routes={routeSearchFixture} filterValues={{}} />);
    expect(html).toContain("Find the nonstop flight that fits");
    expect(html).toContain("Top route");
    expect(html).toContain("Nonstop destinations from Bangkok");
    expect(html).toContain("Choose the Bangkok airport");
  });
});
