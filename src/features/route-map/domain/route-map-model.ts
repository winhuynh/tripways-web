export type RouteMapOriginIdentity =
  | Readonly<{ type: "city"; slug: string }>
  | Readonly<{ type: "airport"; iata: string }>;

export type RouteMapOrigin = Readonly<{
  type: "city";
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
}>;

export type RouteMapDestination = Readonly<{
  cityName: string;
  citySlug: string;
  countryIso2: string;
  countryName: string;
  latitude: number;
  longitude: number;
  routePath: string;
  originAirports: readonly string[];
  destinationAirports: readonly string[];
  airlines: readonly string[];
  shortestDurationMinutes: number;
  frequencyPerWeek: number | null;
}>;

export type RouteMapReadModel = Readonly<{
  origin: RouteMapOrigin;
  destinations: readonly RouteMapDestination[];
  meta: Readonly<{
    dataVersion: string;
    total: number;
    omittedDestinationCount: number;
    limit: number;
  }>;
}>;

export type CityRouteMapQuery = Readonly<{
  origin: Readonly<{ type: "city"; slug: string }>;
  locale: string;
  originAirports?: readonly string[];
  airlines?: readonly string[];
  destinationCountries?: readonly string[];
  maxDurationMinutes?: number;
  departureWindow?: string;
  limit?: number;
}>;

export type RouteMapQuery = Omit<CityRouteMapQuery, "origin"> &
  Readonly<{ origin: RouteMapOriginIdentity }>;
