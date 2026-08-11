import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { AirportPageModel } from "../domain/airport-page-model";
import { routeSearchFixture } from "@/features/route-search/domain/route-search-model.fixture";
import { AirportPageScreen } from "./airport-page-screen";

const model: AirportPageModel = {
  airport:{iata:"BKK",name:"Suvarnabhumi Airport",city:{name:"Bangkok",slug:"bangkok"},country:{name:"Thailand",slug:"thailand"}},
  seo:{h1:"Suvarnabhumi Airport Guide",subheadline:"Thailand gateway",title:"BKK guide",description:"Plan BKK"},
  orientation:{intro:"Plan your journey.",summary:"Main gateway.",cityDistanceKm:25,terminalCount:2},
  quickAnswers:{defaultTransport:"Airport Rail Link",transportMinutes:{min:26,max:45},cityDistanceKm:25,terminalCount:2},
  arrival:{summary:"Arrival guidance",steps:[{audience:"all",title:"Immigration",body:"Follow signs."}]},
  departure:{summary:"Departure guidance",steps:[{audience:"all",title:"Check-in",body:"Arrive early."}]},
  transport:[
    {direction:"from_airport",type:"rail",name:"Airport Rail Link",destinationLabel:"Phaya Thai",summary:"Fast train",duration:{minMinutes:26,maxMinutes:45},price:{min:45,max:45,currency:"THB"},operatingHours:"06:00–00:00",pickupLocation:"Basement level",bestFor:"Predictable travel",luggageSummary:"Standard luggage",accessibilitySummary:"Step-free",bookingUrl:null,sourceUrl:"https://example.com/rail",lastVerifiedAt:"2026-08-04"},
    {direction:"to_airport",type:"taxi",name:"Public taxi",destinationLabel:"BKK",summary:"Door to terminal",duration:{minMinutes:45,maxMinutes:90},price:{min:350,max:500,currency:"THB"},operatingHours:"24 hours",pickupLocation:"Central Bangkok",bestFor:"Groups",luggageSummary:"Suitable for luggage",accessibilitySummary:null,bookingUrl:null,sourceUrl:"https://example.com/taxi",lastVerifiedAt:"2026-08-04"},
  ],
  terminals:[{code:"MAIN",name:"Main Terminal"}],facilities:[],lounges:[{name:"Miracle Lounge",location:"Concourse D",locationType:"airside",access:"Paid entry",operatingHours:"24 hours",amenities:["wifi","showers"],estimatedPrice:{min:1200,max:1500,currency:"THB"},affiliateUrl:"https://example.com/lounge",sourceUrl:"https://example.com/source",lastVerifiedAt:"2026-08-04"}],notices:[],
  faqs:[{question:"Is Wi-Fi free?",answer:"Yes."}],links:[],provenance:{reviewedAt:"2026-08-04",freshnessAt:"2026-08-04",routeDataRefreshedAt:"2026-08-05",dataVersion:"v1"},
};

describe("AirportPageScreen", () => {
  it("renders overview, two-way connections, journey tabs, then verified flights", () => {
    const markup=renderToStaticMarkup(<AirportPageScreen model={model} routes={routeSearchFixture} filterValues={{}} clearHref="/airports/suvarnabhumi-bkk" initialJourney="arriving" transportDirection="from_airport" />);
    expect(markup).toContain("Suvarnabhumi Airport Guide");
    expect(markup).toContain("Bangkok and airport connections");
    expect(markup).toContain("Airport → Bangkok");
    expect(markup).toContain("Bangkok → Airport");
    expect(markup).toContain("Arriving at BKK");
    expect(markup).toContain("Departing from BKK");
    expect(markup).toContain("Verified direct flights to and from Suvarnabhumi Airport");
    expect(markup).toContain('role="tablist"');
    expect(markup).toContain('aria-selected="true"');
    expect(markup).not.toContain("US$120");
    expect(markup.indexOf("Bangkok and airport connections")).toBeLessThan(markup.indexOf("Arriving at BKK"));
    expect(markup.indexOf("Arriving at BKK")).toBeLessThan(markup.indexOf("Verified direct flights"));
    expect(markup).not.toContain("Featured outbound routes");
  });

  it("renders lounge utility only inside the departure journey", () => {
    const arriving=renderToStaticMarkup(<AirportPageScreen model={model} routes={routeSearchFixture} filterValues={{}} clearHref="/airports/suvarnabhumi-bkk" initialJourney="arriving" transportDirection="from_airport" />);
    const departing=renderToStaticMarkup(<AirportPageScreen model={model} routes={routeSearchFixture} filterValues={{}} clearHref="/airports/suvarnabhumi-bkk" initialJourney="departing" transportDirection="to_airport" />);
    expect(arriving).not.toContain("Explore lounge access");
    expect(departing).toContain("Explore lounge access");
    expect(departing).toContain("Affiliate disclosure");
    expect(departing).toContain("Public taxi");
    expect(departing).not.toContain("<h3>Airport Rail Link</h3>");
  });
});
