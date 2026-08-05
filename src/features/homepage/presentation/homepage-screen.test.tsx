import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { routeSearchFixture } from "@/features/route-search/domain/route-search-model.fixture";
import type { HomepageModel } from "../domain/homepage-model";
import { HomepageScreen } from "./homepage-screen";

const model: HomepageModel = { seo: { h1: "Where can you fly nonstop?", subheadline: "Explore", intro: "Choose origin.", title: "Tripways", description: "Routes" }, routes: [{ id: "r1", from: "LHR", to: "SIN", durationMinutes: 785, path: "/flights/london-to-singapore" }], origins: [{ title: "London", summary: "Global hub", destinations: 100 }], sections: [{ type: "discovery_intro", heading: "Find your next destination", body: "Discover." }], faqs: [], indexable: true };

describe("HomepageScreen", () => {
  it("renders search, routes, origins and reviewed value content", () => {
    const html = renderToStaticMarkup(<HomepageScreen model={model} discovery={routeSearchFixture} origin="" />);
    expect(html).toContain("City, airport, or country");
    expect(html).toContain("Popular nonstop routes");
    expect(html).toContain("Find nonstop flights from popular cities");
    expect(html).toContain("Find your next destination");
  });
});
