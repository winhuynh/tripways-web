import type { RouteSearchModel } from "./route-search-model";

export const routeSearchFixture: RouteSearchModel = {
  options: [{ id: "BKK-SIN", from: "BKK", to: "SIN", originCountry: "Thailand", destinationCountry: "Singapore", international: true, stops: 0, connections: [], airlines: ["SQ"], flightMinutes: 150, layoverMinutes: 0, durationMinutes: 150, routePath: "/flights/bangkok-to-singapore", price: { state: "available", priceMin: 120, priceMax: 180, currencyCode: "USD" } }],
  total: 1,
  pageSize: 20,
  nextCursor: null,
  facets: {
    stops: [{ value: "0", count: 1 }],
    airlines: [{ value: "SQ", count: 1 }],
    connections: [],
    countries: [{ value: "SG", count: 1 }],
    regions: [{ value: "asia", count: 1 }],
  },
};
