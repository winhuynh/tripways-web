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
  transport:[{type:"train",name:"Airport Rail Link",summary:"Fast train",duration:{minMinutes:26,maxMinutes:45},price:{min:45,max:45,currency:"THB"}}],
  terminals:[{code:"MAIN",name:"Main Terminal"}],facilities:[],lounges:[],notices:[],
  faqs:[{question:"Is Wi-Fi free?",answer:"Yes."}],links:[],provenance:{reviewedAt:"2026-08-04",freshnessAt:"2026-08-04",dataVersion:"v1"},
};

describe("AirportPageScreen", () => {
  it("renders the journey before the direct-flight explorer", () => {
    const markup=renderToStaticMarkup(<AirportPageScreen model={model} routes={routeSearchFixture} filterValues={{}} clearHref="/airports/suvarnabhumi-bkk" />);
    expect(markup).toContain("Suvarnabhumi Airport Guide");
    expect(markup).toContain("Arriving at BKK");
    expect(markup).toContain("BKK to central Bangkok");
    expect(markup).toContain("Departing from BKK");
    expect(markup).toContain("Verified direct flights to and from BKK");
    expect(markup.indexOf("Arriving at BKK")).toBeLessThan(markup.indexOf("Verified direct flights"));
    expect(markup).not.toContain("Featured outbound routes");
  });
});
