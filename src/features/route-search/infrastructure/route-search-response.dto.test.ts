import { describe, expect, it } from "vitest";

import { parseRouteSearchResponse } from "./route-search-response.dto";

describe("parseRouteSearchResponse", () => {
  it("preserves route identity, unavailable fare state, facets and cursor", () => {
    const result=parseRouteSearchResponse({data:[{id:"r1",from:"BKK",to:"LHR",origin_country:"TH",destination_country:"GB",is_international:true,stops:0,connection_airports:[],operating_airlines:["TG"],total_flight_minutes:765,layover_minutes:0,total_duration_minutes:765,schedule:{departure_local_time:"00:30",departure_time_bucket:"early_morning",arrival_local_time:"07:15",arrival_day_offset:0,days_of_week:[1,2,3],valid_from:"2026-08-01",valid_to:"2026-10-31"},route_path:"/flights/bangkok-to-london",price:{state:"unavailable",reason:"missing",estimate:null}}],meta:{data_version:"v1",total:1,page_size:20,next_cursor:"cursor-123",facets:{stops:[{value:0,count:1}],airlines:[{value:"TG",count:1}],connections:[],countries:[{value:"GB",count:1}],regions:[]}},error:null});
    expect(result.options[0]?.from).toBe("BKK");
    expect(result.options[0]?.price.state).toBe("unavailable");
    expect(result.facets.airlines[0]).toEqual({value:"TG",count:1});
    expect(result.nextCursor).toBe("cursor-123");
  });

  it("accepts a verified route without a published route guide", () => {
    const result=parseRouteSearchResponse({data:[{id:"r1",from:"BKK",to:"LHR",origin_country:"TH",destination_country:"GB",is_international:true,stops:0,connection_airports:[],operating_airlines:["TG"],total_flight_minutes:765,layover_minutes:0,total_duration_minutes:765,schedule:{departure_local_time:"00:30",departure_time_bucket:"early_morning",arrival_local_time:"07:15",arrival_day_offset:0,days_of_week:[1],valid_from:"2026-08-01",valid_to:"2026-10-31"},route_path:null,price:{state:"unavailable",reason:"missing",estimate:null}}],meta:{data_version:"v1",total:1,page_size:20,next_cursor:null,facets:{stops:[],airlines:[],connections:[],countries:[],regions:[]}},error:null});

    expect(result.options[0]?.routePath).toBeNull();
  });

  it("keeps distinct backend IDs and authoritative result metadata", () => {
    const result = parseRouteSearchResponse({
      data: [
        { route_ref: "vn-sgn-sin", from: "SGN", to: "SIN", stops: 0, operating_airlines: ["VN"], total_duration_minutes: 125, route_path: "/flights/ho-chi-minh-city-to-singapore", price: { state: "available", price_min: 90, price_max: 90, currency_code: "USD" } },
        { route_ref: "sq-sgn-sin", from: "SGN", to: "SIN", stops: 0, operating_airlines: ["SQ"], total_duration_minutes: 125, route_path: "/flights/ho-chi-minh-city-to-singapore", price: { state: "available", price_min: 120, price_max: 120, currency_code: "USD" } },
      ],
      meta: { total: 7, page_size: 2, next_cursor: "offset:2", facets: { stops: [{ value: "0", count: 7 }], airlines: [], connections: [], countries: [], regions: [] } },
      error: null,
    });

    expect(result.options.map((option) => option.id)).toEqual(["vn-sgn-sin", "sq-sgn-sin"]);
    expect(result.total).toBe(7);
    expect(result.pageSize).toBe(2);
    expect(result.nextCursor).toBe("offset:2");
  });
});
