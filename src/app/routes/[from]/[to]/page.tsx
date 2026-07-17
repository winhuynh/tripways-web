import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RouteMap } from "@/components/routes/route-map";
import { RouteOptionCard } from "@/components/routes/route-option-card";
import { AirportSearchForm } from "@/components/search/airport-search-form";
import { FilterToolbar } from "@/components/search/filter-toolbar";
import { getAirport } from "@/lib/airports";
import { RouteDiscoveryError, searchRoutes } from "@/lib/route-discovery";
import { parseRouteFilters } from "@/lib/route-filters";

type RoutePageProps = {
  params: Promise<{ from: string; to: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const values = await params;
  const origin = getAirport(values.from);
  const destination = getAirport(values.to);
  return { title: origin && destination ? `${origin.iata} to ${destination.iata} flight routes` : "Route not found" };
}

export default async function RoutePage({ params, searchParams }: RoutePageProps) {
  const values = await params;
  const origin = getAirport(values.from);
  const destination = getAirport(values.to);
  if (!origin || !destination || origin.iata === destination.iata) notFound();

  const filters = parseRouteFilters(await searchParams);
  let result = null;
  let errorMessage: string | null = null;

  try {
    result = await searchRoutes({ from: origin.iata, to: destination.iata, ...filters });
    if (result.error) errorMessage = result.error.message;
  } catch (error) {
    errorMessage = error instanceof RouteDiscoveryError ? error.message : "Route Discovery is unavailable.";
  }

  return (
    <div className="page-container py-12">
      <div className="surface p-4 sm:p-6"><AirportSearchForm compact defaultFrom={origin.iata} defaultTo={destination.iata} /></div>
      <section className="grid gap-8 py-12 lg:grid-cols-[1fr_0.75fr] lg:items-center">
        <div>
          <p className="eyebrow">Route schedule</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.055em] sm:text-6xl">
            {origin.city} <span className="text-[#147df5]">to {destination.city}</span>
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-[#52627a]">
            Compare stored direct and one-stop schedule patterns from {origin.iata} to {destination.iata}. These are route possibilities, not dated fares or seat availability.
          </p>
        </div>
        <div className="rounded-2xl bg-[#101828] p-6 text-white">
          <div className="flex items-center justify-between"><strong>{origin.iata}</strong><span className="text-[#70b7ff]">···· ✈ ····</span><strong>{destination.iata}</strong></div>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 text-sm">
            <div><span className="block text-xs text-white/55">Available options</span><strong className="mt-1 block text-xl">{result?.meta.total ?? result?.data.length ?? "—"}</strong></div>
            <div><span className="block text-xs text-white/55">Current scope</span><strong className="mt-1 block text-xl">0–1 stops</strong></div>
          </div>
        </div>
      </section>

      <RouteMap origin={origin} destinations={[destination]} />
      <div className="mt-7"><FilterToolbar filters={filters} /></div>

      <section className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><p className="eyebrow">Schedule options</p><h2 className="mt-2 text-2xl font-extrabold">Routes from {origin.iata} to {destination.iata}</h2></div>
          <p className="text-xs text-[#52627a]">Ordered by stops, duration, then confidence</p>
        </div>
        {errorMessage ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><h3 className="font-extrabold">Route data is not ready</h3><p className="mt-2 text-sm leading-6 text-amber-900">{errorMessage} Check the local Supabase environment and fixture.</p></div>
        ) : !result || result.data.length === 0 ? (
          <div className="rounded-2xl border border-[#dce5ef] bg-white p-8 text-center"><h3 className="font-extrabold">No route options found</h3><p className="mt-2 text-sm text-[#52627a]">Try a less restrictive filter or another fixture route.</p></div>
        ) : (
          <div className="grid gap-4">{result.data.map((option) => <RouteOptionCard key={option.id} option={option} />)}</div>
        )}
      </section>
    </div>
  );
}
