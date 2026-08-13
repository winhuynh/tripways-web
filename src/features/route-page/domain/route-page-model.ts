export type ObservedPrice = Readonly<{ reference: string; amount: number; currencyCode: string; departureDate: string | null; observedAt: string; validUntil: string; direct: boolean | null }>;
export type RoutePageModel = Readonly<{
  route: { origin: { name: string; slug: string }; destination: { name: string; slug: string } };
  seo: { h1: string; subheadline: string; title: string; description: string; intro: string };
  summary: { directOptions: number; indirectOptions: number; fastestDirectMinutes: number | null; fastestIndirectMinutes: number | null };
  facts: Array<{ type: string; title: string; body: string; sourceUrl?: string }>;
  sections: Array<{ type: string; heading: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
  affiliateOffers: Array<{ title: string; href: string }>;
  affiliateDisclosure: string;
  observedPrices: ObservedPrice[];
}>;
