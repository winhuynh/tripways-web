export type JourneyStep = Readonly<{ audience: string; title: string; body: string }>;
export type AirportPageModel = Readonly<{
  airport: { iata: string; name: string; city: { name: string; slug: string }; country: { name: string; slug: string } };
  seo: { h1: string; subheadline: string; title: string; description: string };
  orientation: { intro: string; summary: string; cityDistanceKm: number | null; terminalCount: number };
  quickAnswers: { defaultTransport: string | null; transportMinutes: { min: number; max: number } | null; cityDistanceKm: number | null; terminalCount: number };
  arrival: { summary: string; steps: JourneyStep[] };
  departure: { summary: string; steps: JourneyStep[] };
  transport: Array<{ type: string; name: string; summary: string; duration: { minMinutes: number | null; maxMinutes: number | null }; price: { min: number | null; max: number | null; currency: string | null } }>;
  terminals: Array<{ code: string; name: string }>;
  facilities: Array<{ category: string; name: string; summary: string }>;
  lounges: Array<{ name: string; location: string; access: string }>;
  notices: Array<{ title: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
  links: Array<{ title: string; links: Array<{ label: string; href: string; secondaryText?: string }> }>;
  provenance: { reviewedAt: string | null; freshnessAt: string | null; dataVersion: string | null };
}>;
