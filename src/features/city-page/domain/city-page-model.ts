export type CityPageDestination = Readonly<{
  city: string;
  citySlug: string;
  country: string;
  originAirports: string[];
  airports: string[];
  airlines: string[];
  frequency: number | null;
  minDuration: number;
  maxDuration: number;
  path: string;
  region?: string;
  fareMin?: number;
  fareMax?: number;
  fareCurrency?: string;
  latitude?: number;
  longitude?: number;
  isTopRoute?: boolean;
}>;

export type CityPageAirport = Readonly<{
  iata: string;
  name: string;
  primary: boolean;
  destinations: number;
  airlines: number;
  role?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}>;

export type CityPageModel = Readonly<{
  city: { name: string; slug: string; latitude?: number; longitude?: number };
  country: { name: string; slug: string; region?: string };
  seo: {
    h1: string;
    subheadline: string;
    title: string;
    description: string;
    intro: string;
    isIndexable?: boolean;
    noindexReason?: string | null;
  };
  airports: CityPageAirport[];
  quickFacts: {
    airports: number;
    destinations: number;
    countries: number;
    airlines: number;
  };
  destinations: CityPageDestination[];
  faqs: Array<{ question: string; answer: string }>;
  links: Array<{
    title: string;
    links: Array<{ label: string; href: string; secondaryText?: string }>;
  }>;
  freshnessAt: string | null;
  canonicalPath: string | null;
}>;
