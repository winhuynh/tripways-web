export type ObservedPrice = Readonly<{
  reference: string;
  amount: number;
  currencyCode: string;
  departureDate: string | null;
  observedAt: string;
  validUntil: string;
  direct: boolean | null;
}>;

export type RoutePlaceEntity = Readonly<{
  name: string;
  slug: string;
  iataCode?: string;
  latitude?: number;
  longitude?: number;
}>;

export type RouteSummary = Readonly<{
  directOptions: number;
  indirectOptions: number;
  fastestDirectMinutes: number | null;
  fastestIndirectMinutes: number | null;
  weeklyDirectFlights?: number | null;
  minFare?: { amount: number; currency: string } | null;
}>;

export type RouteRecommendation = Readonly<{
  badge: string;
  variant?: "fastest" | "lowest" | "direct" | "default";
  title: string;
  description?: string;
}>;

export type RouteAffiliateOffer = Readonly<{
  title: string;
  href: string;
  type?: "flights" | "transfers" | "hotels" | "esim" | "insurance" | "custom";
  description?: string;
}>;

export type RouteInternalLinkGroup = Readonly<{
  title: string;
  links: ReadonlyArray<{
    label: string;
    href: string;
    secondaryText?: string;
  }>;
}>;

export type RoutePageModel = Readonly<{
  route: {
    origin: RoutePlaceEntity;
    destination: RoutePlaceEntity;
    distanceMiles?: number | null;
    distanceKm?: number | null;
  };
  seo: {
    h1: string;
    subheadline: string;
    title: string;
    description: string;
    intro: string;
    isIndexable?: boolean;
    noindexReason?: string;
  };
  summary: RouteSummary;
  recommendations?: RouteRecommendation[];
  facts: Array<{ type: string; title: string; body: string; sourceUrl?: string }>;
  sections: Array<{ type: string; heading: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
  affiliateOffers: RouteAffiliateOffer[];
  affiliateDisclosure: string;
  observedPrices: ObservedPrice[];
  links?: RouteInternalLinkGroup[];
  freshnessAt?: string | null;
  canonicalPath?: string | null;
}>;
