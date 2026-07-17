import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DestinationCard } from "@/components/routes/destination-card";
import { RouteMap } from "@/components/routes/route-map";
import { FilterToolbar } from "@/components/search/filter-toolbar";
import { getAirport, listDestinationCandidates } from "@/lib/airports";
import { RouteDiscoveryError, searchRoutes } from "@/lib/route-discovery";
import { parseRouteFilters } from "@/lib/route-filters";

type OriginPageProps = {
  params: Promise<{ iata: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: OriginPageProps): Promise<Metadata> {
  const origin = getAirport((await params).iata);
  return { title: origin ? `Flights from ${origin.city} (${origin.iata})` : "Airport not found" };
}

export default async function OriginPage({ params, searchParams }: OriginPageProps) {
  const origin = getAirport((await params).iata);
  if (!origin) notFound();

  const filters = parseRouteFilters(await searchParams);
  const candidates = listDestinationCandidates(origin.iata);
  const settledResults = await Promise.all(
    candidates.map(async (destination) => {
      try {
        const result = await searchRoutes({ from: origin.iata, to: destination.iata, ...filters });
        return {
          route: result.error || result.data.length === 0 ? null : { destination, result },
          setupError: null,
        };
      } catch (error) {
        return {
          route: null,
          setupError:
            error instanceof RouteDiscoveryError ? error.message : "Route Discovery is unavailable.",
        };
      }
    }),
  );
  const availableRoutes = settledResults.flatMap(({ route }) => (route ? [route] : []));
  const setupError = settledResults.find(({ setupError }) => setupError)?.setupError ?? null;
  const mapDestinations = availableRoutes.map(({ destination }) => destination);
  const airlines = [...new Set(availableRoutes.flatMap(({ result }) => result.data.flatMap((route) => route.operating_airlines)))];

  return (
    <div className="page-container py-14">
      <section className="mb-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow">Route discovery</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.05em] sm:text-6xl">
            Flights from <span className="text-[#147df5]">{origin.city} ({origin.iata})</span>
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-[#52627a]">
            Explore recurring direct and one-stop connections stored in the Tripways route graph
            from {origin.name}.
          </p>
        </div>
        <span className="w-fit rounded-full border border-[#b9dafd] bg-[#eaf4ff] px-4 py-2 text-xs font-bold text-[#075fc4]">Local graph data</span>
      </section>

      <RouteMap origin={origin} destinations={mapDestinations.length > 0 ? mapDestinations : candidates} />
      <div className="mt-7"><FilterToolbar filters={filters} /></div>

      <section className="mt-10 grid gap-7 lg:grid-cols-[1fr_290px]">
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold">Destinations from {origin.city}</h2>
            <span className="text-xs text-[#52627a]">{availableRoutes.length} connected airports</span>
          </div>
          {setupError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="font-extrabold">Connect local Supabase to load routes</h3>
              <p className="mt-2 text-sm leading-6 text-amber-900">{setupError} Copy `.env.example` to `.env.local`, use values from `supabase status -o env`, then restart Next.js.</p>
            </div>
          ) : availableRoutes.length === 0 ? (
            <div className="rounded-2xl border border-[#dce5ef] bg-white p-8 text-center">
              <h3 className="font-extrabold">No routes match these filters</h3>
              <p className="mt-2 text-sm text-[#52627a]">Relax a filter or rebuild the local Route Discovery fixture.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availableRoutes.map(({ destination, result }) => (
                <DestinationCard destination={destination} key={destination.iata} origin={origin} result={result} />
              ))}
            </div>
          )}
        </div>
        <aside className="h-fit rounded-2xl border border-[#dce5ef] bg-white p-5">
          <h2 className="font-extrabold">Airlines from {origin.iata}</h2>
          <div className="mt-5 grid gap-3">
            {airlines.length > 0 ? airlines.map((airline) => (
              <div className="flex items-center gap-3 rounded-xl bg-[#f6f8fb] p-3" key={airline}>
                <span className="grid size-8 place-items-center rounded-full bg-[#eaf4ff] text-xs font-extrabold text-[#075fc4]">{airline}</span>
                <span className="text-sm font-semibold">Operating airline {airline}</span>
              </div>
            )) : <p className="text-sm leading-6 text-[#52627a]">Airline facets appear after local route data loads.</p>}
          </div>
        </aside>
      </section>
    </div>
  );
}
