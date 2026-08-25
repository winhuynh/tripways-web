import type { RouteOption, RouteSearchModel } from "./route-search-model";
import { COUNTRY_NAMES } from "./route-filter-labels";

const ALL_LOCAL_OPTIONS: readonly RouteOption[] = [
  {
    id: "BKK-SIN",
    from: "BKK",
    to: "SIN",
    originCountry: "Thailand",
    destinationCountry: "Singapore",
    international: true,
    stops: 0,
    connections: [],
    airlines: ["SQ", "TG"],
    flightMinutes: 150,
    layoverMinutes: 0,
    durationMinutes: 150,
    routePath: "/flights/bangkok-to-singapore",
    price: { state: "available", priceMin: 120, priceMax: 180, currencyCode: "USD" },
  },
  {
    id: "BKK-NRT",
    from: "BKK",
    to: "NRT",
    originCountry: "Thailand",
    destinationCountry: "Japan",
    international: true,
    stops: 0,
    connections: [],
    airlines: ["TG", "JL", "NH"],
    flightMinutes: 380,
    layoverMinutes: 0,
    durationMinutes: 380,
    routePath: "/flights/bangkok-to-tokyo",
    price: { state: "available", priceMin: 220, priceMax: 350, currencyCode: "USD" },
  },
  {
    id: "BKK-LHR",
    from: "BKK",
    to: "LHR",
    originCountry: "Thailand",
    destinationCountry: "United Kingdom",
    international: true,
    stops: 0,
    connections: [],
    airlines: ["TG", "BA"],
    flightMinutes: 760,
    layoverMinutes: 0,
    durationMinutes: 760,
    routePath: "/flights/bangkok-to-london",
    price: { state: "available", priceMin: 450, priceMax: 700, currencyCode: "USD" },
  },
  {
    id: "BKK-HKG",
    from: "BKK",
    to: "HKG",
    originCountry: "Thailand",
    destinationCountry: "Hong Kong",
    international: true,
    stops: 0,
    connections: [],
    airlines: ["CX", "TG", "EK"],
    flightMinutes: 180,
    layoverMinutes: 0,
    durationMinutes: 180,
    routePath: "/flights/bangkok-to-hong-kong",
    price: { state: "available", priceMin: 140, priceMax: 210, currencyCode: "USD" },
  },
  {
    id: "BKK-SYD",
    from: "BKK",
    to: "SYD",
    originCountry: "Thailand",
    destinationCountry: "Australia",
    international: true,
    stops: 0,
    connections: [],
    airlines: ["TG", "QF"],
    flightMinutes: 560,
    layoverMinutes: 0,
    durationMinutes: 560,
    routePath: "/flights/bangkok-to-sydney",
    price: { state: "available", priceMin: 380, priceMax: 600, currencyCode: "USD" },
  },
  {
    id: "DMK-HKT",
    from: "DMK",
    to: "HKT",
    originCountry: "Thailand",
    destinationCountry: "Thailand",
    international: false,
    stops: 0,
    connections: [],
    airlines: ["FD", "PG"],
    flightMinutes: 85,
    layoverMinutes: 0,
    durationMinutes: 85,
    routePath: "/flights/bangkok-to-phuket",
    price: { state: "available", priceMin: 35, priceMax: 60, currencyCode: "USD" },
  },
  {
    id: "BKK-CDG",
    from: "BKK",
    to: "CDG",
    originCountry: "Thailand",
    destinationCountry: "France",
    international: true,
    stops: 0,
    connections: [],
    airlines: ["TG", "AF"],
    flightMinutes: 780,
    layoverMinutes: 0,
    durationMinutes: 780,
    routePath: "/flights/bangkok-to-paris",
    price: { state: "available", priceMin: 480, priceMax: 750, currencyCode: "USD" },
  },
  {
    id: "BKK-DXB",
    from: "BKK",
    to: "DXB",
    originCountry: "Thailand",
    destinationCountry: "United Arab Emirates",
    international: true,
    stops: 0,
    connections: [],
    airlines: ["EK", "TG"],
    flightMinutes: 390,
    layoverMinutes: 0,
    durationMinutes: 390,
    routePath: "/flights/bangkok-to-dubai",
    price: { state: "available", priceMin: 260, priceMax: 420, currencyCode: "USD" },
  },
];

export const routeSearchFixture: RouteSearchModel = {
  options: [...ALL_LOCAL_OPTIONS],
  total: ALL_LOCAL_OPTIONS.length,
  pageSize: 20,
  nextCursor: null,
  facets: {
    stops: [{ value: "0", count: ALL_LOCAL_OPTIONS.length }],
    airlines: [
      { value: "TG", count: 7 },
      { value: "SQ", count: 1 },
      { value: "EK", count: 2 },
      { value: "CX", count: 1 },
      { value: "BA", count: 1 },
      { value: "JL", count: 1 },
      { value: "NH", count: 1 },
      { value: "QF", count: 1 },
      { value: "AF", count: 1 },
      { value: "FD", count: 1 },
      { value: "PG", count: 1 },
    ],
    connections: [{ value: "SIN", count: 1 }],
    countries: [
      { value: "SG", count: 1 },
      { value: "JP", count: 1 },
      { value: "GB", count: 1 },
      { value: "HK", count: 1 },
      { value: "AU", count: 1 },
      { value: "TH", count: 1 },
      { value: "FR", count: 1 },
      { value: "AE", count: 1 },
    ],
    regions: [
      { value: "southeast_asia", count: 2 },
      { value: "east_asia", count: 2 },
      { value: "europe", count: 2 },
      { value: "oceania", count: 1 },
      { value: "middle_east", count: 1 },
    ],
  },
};

/**
 * Dynamically filters local fixture routes when offline/developing.
 */
export function getLocalFilteredRouteSearchFixture(
  filters: Record<string, unknown> = {},
): RouteSearchModel {
  let filtered = [...ALL_LOCAL_OPTIONS];

  // 1. departure_airports
  if (Array.isArray(filters.departure_airports) && filters.departure_airports.length > 0) {
    const departures = filters.departure_airports as string[];
    filtered = filtered.filter((opt) => departures.includes(opt.from));
  }

  // 2. airlines
  if (Array.isArray(filters.airlines) && filters.airlines.length > 0) {
    const airlines = filters.airlines as string[];
    filtered = filtered.filter((opt) => opt.airlines.some((a) => airlines.includes(a)));
  }

  // 3. destination_countries
  if (Array.isArray(filters.destination_countries) && filters.destination_countries.length > 0) {
    const countries = (filters.destination_countries as string[])
      .map((code) => COUNTRY_NAMES[code.toUpperCase()]?.toUpperCase())
      .filter((country): country is string => country !== undefined);
    filtered = filtered.filter((opt) => countries.includes(opt.destinationCountry.toUpperCase()));
  }

  // 4. max_duration_minutes
  if (typeof filters.max_duration_minutes === "number") {
    filtered = filtered.filter((opt) => opt.durationMinutes <= (filters.max_duration_minutes as number));
  }

  // 5. max_one_way_fare
  if (typeof filters.max_one_way_fare === "number") {
    filtered = filtered.filter((opt) => {
      if (opt.price.state !== "available") return false;
      return opt.price.priceMin <= (filters.max_one_way_fare as number);
    });
  }

  // 6. route_type
  if (filters.route_type === "domestic") {
    filtered = filtered.filter((opt) => !opt.international);
  } else if (filters.route_type === "international") {
    filtered = filtered.filter((opt) => opt.international);
  }

  return {
    options: filtered,
    total: filtered.length,
    pageSize: 20,
    nextCursor: null,
    facets: routeSearchFixture.facets,
  };
}
