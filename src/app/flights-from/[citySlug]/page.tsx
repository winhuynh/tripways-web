import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AdSlot } from "@/features/advertising";
import {
  CityAirlinesSection,
  CityAirportsSection,
  CityDestinationsSection,
  CityFaqSection,
  CityFilterToolbar,
  CityHero,
  CityInsightsSection,
  CityLinksSection,
  CityQuickFactsFallback,
  CityQuickFactsSection,
  CityQuickFactsUnavailable,
  CityRouteMap,
  CityRouteSearch,
  CollectionsSection,
  FaqStructuredData,
  SectionFallback,
  SectionUnavailable,
  SiteFooter,
  SiteHeader,
} from "@/features/city-page";
import type { CityPageIdentity } from "@/features/city-page";
import { CityPageError } from "@/features/city-page/domain/city-page-error";
import { cityPage } from "@/features/city-page/server";

type PageProps = {
  params: Promise<{ citySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const identity = identityFromSlug((await params).citySlug);
  try {
    const overview = await cityPage.getOverview(identity);
    return {
      title: overview.seo.title,
      description: overview.seo.description,
      alternates: { canonical: overview.seo.canonicalPath },
      robots: overview.seo.isIndexable
        ? { index: true, follow: true }
        : { index: false, follow: true },
      openGraph: {
        title: overview.seo.ogTitle,
        description: overview.seo.ogDescription,
        type: "website",
      },
    };
  } catch (error) {
    if (isNotFound(error)) return {};
    return { title: "City direct flights | Tripways", robots: { index: false, follow: false } };
  }
}

export default async function CityPageRoute({ params, searchParams }: PageProps) {
  const identity = identityFromSlug((await params).citySlug);
  const filters = await searchParams;
  let overview;

  try {
    overview = await cityPage.getOverview(identity);
  } catch (error) {
    if (isNotFound(error)) notFound();
    throw error;
  }

  return (
    <>
      <SiteHeader />
      <main className="page-shell city-page">
        <CityHero overview={overview} />
        <CityRouteSearch cityName={overview.city.name} />
        <Suspense fallback={<SectionFallback label="route map" />}>
          <MapSection identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="route filters" />}>
          <FilterSection filters={filters} identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="destinations" />}>
          <DestinationsSection
            cityName={overview.city.name}
            filters={filters}
            identity={identity}
          />
        </Suspense>
        <Suspense fallback={<SectionFallback label="airport hubs" />}>
          <AirportsSection
            airportSummary={overview.content.airportSummary}
            identity={identity}
          />
        </Suspense>
        <Suspense fallback={<SectionFallback label="airlines" />}>
          <AirlinesSection identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="collections" />}>
          <CollectionsReadSection identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="travel insights" />}>
          <InsightsSection identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="related routes" />}>
          <LinksSection identity={identity} />
        </Suspense>
        <Suspense fallback={<SectionFallback label="frequently asked questions" />}>
          <FaqSection identity={identity} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function MapSection({ identity }: { identity: CityPageIdentity }) {
  const [airports, destinations] = await Promise.all([
    cityPage.getAirports(identity),
    cityPage.getDestinations({ ...identity, limit: 8, offset: 0 }),
  ]);
  if (airports.status !== "available" || destinations.status !== "available") {
    return <SectionUnavailable title="Direct route map" />;
  }
  return (
    <CityRouteMap
      airports={airports.data}
      destinations={destinations.data.destinations}
    />
  );
}

async function FilterSection({
  identity,
  filters,
}: {
  identity: CityPageIdentity;
  filters: Record<string, string | string[] | undefined>;
}) {
  const [airports, destinations] = await Promise.all([
    cityPage.getAirports(identity),
    cityPage.getDestinations(destinationQuery(identity, filters)),
  ]);
  if (airports.status !== "available" || destinations.status !== "available") return null;
  return (
    <CityFilterToolbar
      airports={airports.data}
      total={destinations.data.total}
    />
  );
}

async function DestinationsSection({
  identity,
  filters,
  cityName,
}: {
  identity: CityPageIdentity;
  filters: Record<string, string | string[] | undefined>;
  cityName: string;
}) {
  const result = await cityPage.getDestinations(destinationQuery(identity, filters));
  if (result.status === "unavailable") {
    return <SectionUnavailable title={`Destinations from ${cityName}`} />;
  }
  if (result.status === "empty") {
    return <section className="section-card section-message"><h2>No matching destinations</h2></section>;
  }
  return (
    <CityDestinationsSection
      cityName={cityName}
      quickFactsSlot={
        <Suspense fallback={<CityQuickFactsFallback />}>
          <QuickFactsSection cityName={cityName} identity={identity} />
        </Suspense>
      }
      result={result.data}
    />
  );
}

async function QuickFactsSection({
  cityName,
  identity,
}: {
  cityName: string;
  identity: CityPageIdentity;
}) {
  const result = await cityPage.getQuickFacts(identity);
  if (result.status !== "available") return <CityQuickFactsUnavailable />;
  return <CityQuickFactsSection cityName={cityName} quickFacts={result.data} />;
}

async function AirportsSection({
  airportSummary,
  identity,
}: {
  airportSummary: string;
  identity: CityPageIdentity;
}) {
  const result = await cityPage.getAirports(identity);
  if (result.status !== "available") return <SectionUnavailable title="Direct flight hubs" />;
  return (
    <CityAirportsSection
      airportSummary={airportSummary}
      airports={result.data}
    />
  );
}

async function AirlinesSection({ identity }: { identity: CityPageIdentity }) {
  const result = await cityPage.getAirlines(identity);
  if (result.status !== "available") {
    return <SectionUnavailable title="Airlines flying direct from Bangkok" />;
  }
  return <CityAirlinesSection airlines={result.data} />;
}

async function CollectionsReadSection({ identity }: { identity: CityPageIdentity }) {
  const result = await cityPage.getInternalLinks(identity);
  if (result.status !== "available") return null;
  return <CollectionsSection groups={result.data} />;
}

async function InsightsSection({ identity }: { identity: CityPageIdentity }) {
  const result = await cityPage.getInsights(identity);
  if (result.status !== "available") return <SectionUnavailable title="Bangkok travel insights" />;
  return <CityInsightsSection insights={result.data} />;
}

async function LinksSection({ identity }: { identity: CityPageIdentity }) {
  const result = await cityPage.getInternalLinks(identity);
  if (result.status !== "available") return <SectionUnavailable title="Related flight pages" />;
  return <CityLinksSection groups={result.data} />;
}

async function FaqSection({ identity }: { identity: CityPageIdentity }) {
  const result = await cityPage.getFaqs(identity);
  if (result.status !== "available") return <SectionUnavailable title="Frequently asked questions" />;
  return (
    <>
      <CityFaqSection faqs={result.data} />
      <AdSlot format="leaderboard" placement="city_after_faq" />
      <FaqStructuredData faqs={result.data} />
    </>
  );
}

function identityFromSlug(citySlug: string): CityPageIdentity {
  return { citySlug: citySlug.trim().toLowerCase(), locale: "en-GB" };
}

function destinationQuery(
  identity: CityPageIdentity,
  filters: Record<string, string | string[] | undefined>,
) {
  const airport = single(filters.airport)?.toUpperCase();
  const duration = Number(single(filters.duration));
  const departure = single(filters.departure);
  return {
    ...identity,
    limit: 8,
    offset: 0,
    ...(airport && /^[A-Z]{3}$/.test(airport) ? { originAirports: [airport] } : {}),
    ...(Number.isInteger(duration) && duration > 0 ? { maxDurationMinutes: duration } : {}),
    ...(departure && ["morning", "afternoon", "evening", "night"].includes(departure)
      ? { departureWindow: departure }
      : {}),
  };
}

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isNotFound(error: unknown): boolean {
  return error instanceof CityPageError &&
    (error.code === "ERR_CITY_NOT_FOUND" || error.code === "ERR_CITY_PAGE_NOT_FOUND");
}
