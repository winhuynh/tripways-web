export type JourneyType = "arriving" | "departing";
export type TransportDirection = "from_airport" | "to_airport";

export type JourneyStep = Readonly<{
  audience: string;
  title: string;
  body: string;
}>;

export type EstimatedPrice = Readonly<{
  min: number;
  max: number;
  currency: string;
}>;

export type AirportTransportOption = Readonly<{
  direction: TransportDirection | "both";
  type: string;
  name: string;
  destinationLabel: string;
  summary: string;
  duration: { minMinutes: number | null; maxMinutes: number | null };
  price: { min: number | null; max: number | null; currency: string | null };
  operatingHours: string | null;
  pickupLocation: string | null;
  bestFor: string | null;
  luggageSummary: string | null;
  accessibilitySummary: string | null;
  bookingUrl: string | null;
  sourceUrl: string;
  lastVerifiedAt: string;
}>;

export type AirportLounge = Readonly<{
  name: string;
  location: string;
  locationType: string;
  access: string;
  operatingHours: string | null;
  amenities: string[];
  estimatedPrice: EstimatedPrice | null;
  affiliateUrl: string | null;
  sourceUrl: string;
  lastVerifiedAt: string;
}>;

export type AirportPageModel = Readonly<{
  airport: {
    iata: string;
    name: string;
    city: { name: string; slug: string };
    country: { name: string; slug: string };
  };
  seo: { h1: string; subheadline: string; title: string; description: string };
  orientation: {
    intro: string;
    summary: string;
    cityDistanceKm: number | null;
    terminalCount: number;
  };
  quickAnswers: {
    defaultTransport: string | null;
    transportMinutes: { min: number; max: number } | null;
    cityDistanceKm: number | null;
    terminalCount: number;
  };
  arrival: { summary: string; steps: JourneyStep[] };
  departure: { summary: string; steps: JourneyStep[] };
  transport: AirportTransportOption[];
  terminals: Array<{ code: string; name: string }>;
  facilities: Array<{ category: string; name: string; summary: string }>;
  lounges: AirportLounge[];
  notices: Array<{ title: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
  links: Array<{
    title: string;
    links: Array<{ label: string; href: string; secondaryText?: string }>;
  }>;
  provenance: {
    reviewedAt: string | null;
    freshnessAt: string | null;
    routeDataRefreshedAt: string | null;
    dataVersion: string | null;
  };
}>;
