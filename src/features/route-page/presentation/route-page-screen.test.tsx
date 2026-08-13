import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { RoutePageModel } from "../domain/route-page-model";
import { RoutePageScreen } from "./route-page-screen";

const model: RoutePageModel = { route: { origin: { name: "Bangkok", slug: "bangkok" }, destination: { name: "London", slug: "london" } }, seo: { h1: "Flights from Bangkok to London", subheadline: "Compare", title: "Route", description: "Options", intro: "Plan." }, summary: { directOptions: 3, indirectOptions: 9, fastestDirectMinutes: 765, fastestIndirectMinutes: 900 }, facts: [{ type: "timezone", title: "Time zone", body: "London is behind." }], sections: [{ type: "before_you_fly", heading: "Plan your Bangkok–London journey", body: "Prepare." }], faqs: [], affiliateOffers: [], affiliateDisclosure: "Disclosure", observedPrices: [] };

describe("RoutePageScreen", () => {
  it("renders comparison workspace and hides empty sponsored offers", () => {
    const html = renderToStaticMarkup(<RoutePageScreen model={model} />);
    expect(html).toContain("No recent price observation is available");
    expect(html).toContain("Plan your Bangkok–London journey");
    expect(html).not.toContain("Sponsored Travel Services");
  });
});

describe("observed price CTA",()=>{it("labels cached price and posts through the Tripways handoff route",()=>{const priced={...model,observedPrices:[{reference:"obs_0123456789abcdef0123456789abcdef",amount:392,currencyCode:"USD",departureDate:"2026-09-12",observedAt:"2026-08-12T12:00:00Z",validUntil:"2026-08-19T12:00:00Z",direct:true}]};const html=renderToStaticMarkup(<RoutePageScreen model={priced}/>);expect(html).toContain("Recently observed from");expect(html).toContain("Check latest price");expect(html).toContain("Cached price, not live availability")})});
