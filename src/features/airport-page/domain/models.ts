export type AirportPageIdentity = Readonly<{
  airportIata: string;
  locale: string;
}>;

export type AirportRouteFilters = Readonly<{
  direction: "outbound" | "inbound";
  airlines?: readonly string[];
  countries?: readonly string[];
  maxDurationMinutes?: number;
}>;

export type AirportRoute = Readonly<{
  airportIata: string;
  airportName: string;
  cityName: string;
  citySlug: string;
  countryCode: string;
  countryName: string;
  routeCount: number;
  airlineCount: number;
  airlines: readonly string[];
  frequencyPerWeek: number | null;
  shortestDurationMinutes: number;
  longestDurationMinutes: number;
}>;

export type AirportRouteResult = Readonly<{
  routes: readonly AirportRoute[];
  total: number;
  direction: "outbound" | "inbound";
}>;

export type AirportPageModel = Readonly<{
  airport: Readonly<{
    iata: string;
    icao: string | null;
    name: string;
    slug: string;
    timezone: string | null;
    city: Readonly<{ name: string; slug: string }>;
    country: Readonly<{ code: string; name: string; slug: string }>;
  }>;
  seo: Readonly<{
    h1: string;
    subheadline: string;
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  }>;
  content: Readonly<{
    intro: string;
    routeSummary: string;
    accessSummary: string | null;
    parkingSummary: string | null;
    loungeSummary: string | null;
  }>;
  quickFacts: Readonly<{
    outboundDestinations: number;
    outboundCountries: number;
    inboundOrigins: number;
    inboundCountries: number;
    airlines: number;
    shortestRouteMinutes: number | null;
    longestRouteMinutes: number | null;
  }>;
  accessOptions: readonly Readonly<{
    type: string;
    name: string;
    destinationLabel: string;
    summary: string;
    durationMinMinutes: number | null;
    durationMaxMinutes: number | null;
  }>[];
  parking: Readonly<{ summary: string }> | null;
  lounges: readonly Readonly<{
    name: string;
    locationSummary: string;
    accessSummary: string;
    amenities: readonly string[];
  }>[];
  notices: readonly Readonly<{
    title: string;
    body: string;
    severity: string;
  }>[];
  faqs: readonly Readonly<{ question: string; answer: string }>[];
  meta: Readonly<{
    canonicalPath: string;
    isIndexable: boolean;
    noindexReason: string | null;
  }>;
}>;
