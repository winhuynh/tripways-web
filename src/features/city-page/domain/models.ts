export type CityPageIdentity = Readonly<{
  citySlug: string;
  locale: string;
}>;

export type CityOverview = Readonly<{
  city: Readonly<{
    name: string;
    slug: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
  country: Readonly<{
    iso2: string;
    name: string;
    slug: string;
    region: string | null;
  }>;
  content: Readonly<{
    h1: string;
    subheadline: string;
    intro: string;
    airportSummary: string;
  }>;
  seo: Readonly<{
    title: string;
    description: string;
    canonicalPath: string;
    ogTitle: string;
    ogDescription: string;
    ogImagePath: string | null;
    isIndexable: boolean;
    noindexReason: string | null;
  }>;
  quickFacts: Readonly<{
    airportCount: number;
    directDestinationCount: number;
    directCountryCount: number;
    airlineCount: number;
    shortestRouteMinutes: number | null;
    longestRouteMinutes: number | null;
  }>;
  dataVersion: string;
}>;

export type CityAirport = Readonly<{
  iata: string;
  icao: string | null;
  name: string;
  slug: string;
  imagePath: string | null;
  airportType: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isPrimary: boolean;
  hubLabel: string | null;
  description: string | null;
  displayOrder: number | null;
  directDestinationCount: number;
  domesticDestinationCount: number;
  internationalDestinationCount: number;
  domesticDestinationPercentage: number;
  internationalDestinationPercentage: number;
  airlineCount: number;
  dominantAirlineBusinessModel: string;
  pagePath: string;
}>;

export type CityDestination = Readonly<{
  cityName: string;
  citySlug: string;
  countryIso2: string;
  countryName: string;
  originAirports: readonly string[];
  destinationAirports: readonly string[];
  airlines: readonly string[];
  directRouteCount: number;
  frequencyPerWeek: number | null;
  shortestDurationMinutes: number;
  longestDurationMinutes: number;
  routePath: string;
}>;

export type CityDestinationResult = Readonly<{
  destinations: readonly CityDestination[];
  total: number;
  facets: Readonly<{
    airports: readonly Readonly<{ value: string; count: number }>[];
    airlines: readonly Readonly<{ value: string; label: string; count: number }>[];
    countries: readonly Readonly<{ value: string; label: string; count: number }>[];
  }>;
}>;

export type CityDestinationQuery = CityPageIdentity &
  Readonly<{
    originAirports?: readonly string[];
    airlines?: readonly string[];
    destinationCountries?: readonly string[];
    maxDurationMinutes?: number;
    departureWindow?: string;
    limit?: number;
    offset?: number;
  }>;

export type CityAirline = Readonly<{
  iata: string;
  icao: string | null;
  name: string;
  slug: string;
  logoPath: string | null;
  originAirports: readonly string[];
  directDestinationCount: number;
  pagePath: string;
}>;

export type CityInsights = Readonly<{
  mostPopularDestination: string | null;
  shortestDestination: string | null;
  longestDestination: string | null;
  topAirline: string | null;
  averageDurationMinutes: number | null;
  directCountryCount: number;
}>;

export type CityRouteExtreme = Readonly<{
  destinationName: string;
  destinationSlug: string;
  routePath: string;
  durationMinutes: number;
}>;

export type CityQuickFacts = Readonly<{
  airportCount: number;
  directDestinationCount: number;
  directCountryCount: number;
  airlineCount: number;
  shortestRoute: CityRouteExtreme | null;
  longestRoute: CityRouteExtreme | null;
  dataVersion: string;
}>;

export type CityInternalLinkGroup = Readonly<{
  cluster: string;
  links: readonly Readonly<{
    title: string;
    path: string;
    anchorText: string;
    secondaryText: string | null;
    isFeatured: boolean;
  }>[];
}>;

export type CityFaq = Readonly<{
  question: string;
  answer: string;
  answerType: string;
}>;
