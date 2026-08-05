import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { routeSearchFixture } from "@/features/route-search/domain/route-search-model.fixture";
import type { RoutePageModel } from "../domain/route-page-model";
import { RoutePageScreen } from "./route-page-screen";

const model: RoutePageModel = { route: { origin: { name: "Bangkok", slug: "bangkok" }, destination: { name: "London", slug: "london" } }, seo: { h1: "Flights from Bangkok to London", subheadline: "Compare", title: "Route", description: "Options", intro: "Plan." }, summary: { directOptions: 3, indirectOptions: 9, fastestDirectMinutes: 765, fastestIndirectMinutes: 900 }, facts: [{ type: "timezone", title: "Time zone", body: "London is behind." }], sections: [{ type: "before_you_fly", heading: "Plan your Bangkok–London journey", body: "Prepare." }], faqs: [], affiliateOffers: [], affiliateDisclosure: "Disclosure" };

describe("RoutePageScreen", () => {
  it("renders comparison workspace and hides empty sponsored offers", () => {
    const html = renderToStaticMarkup(<RoutePageScreen model={model} routes={routeSearchFixture} filterValues={{}} />);
    expect(html).toContain("Find the flight option that fits");
    expect(html).toContain("Up to 3 stops");
    expect(html).toContain("Maximum layover");
    expect(html).toContain("Plan your Bangkok–London journey");
    expect(html).not.toContain("Sponsored Travel Services");
  });
});
