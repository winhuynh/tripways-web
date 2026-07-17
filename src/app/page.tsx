import Link from "next/link";

import { AirportSearchForm } from "@/components/search/airport-search-form";
import { AIRPORTS } from "@/lib/airports";

export default function HomePage() {
  return (
    <>
      <section className="page-container grid min-h-[720px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow">Explore the connected world</p>
          <h1 className="heading-display text-balance mt-5">
            Find the route. <span className="text-[#147df5]">Know the journey.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#52627a]">
            Explore direct and one-stop flight connections from a clean, queryable route graph —
            before live pricing enters the picture.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link className="rounded-full bg-[#101828] px-6 py-3 text-sm font-extrabold text-white" href="/flights-from/SGN">
              Explore from SGN
            </Link>
            <a className="rounded-full border border-[#dce5ef] bg-white px-6 py-3 text-sm font-extrabold" href="#route-search">
              Search a route ↓
            </a>
          </div>
        </div>
        <div className="surface relative min-h-[440px] overflow-hidden bg-[#c6e7ef] p-8">
          <div className="absolute -right-12 -top-12 size-64 rounded-full bg-[#147df5]/20" />
          <div className="absolute -bottom-20 -left-16 size-72 rounded-full bg-white/55" />
          <div className="relative grid h-full min-h-[374px] place-items-center">
            <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-white/85 p-6 shadow-2xl backdrop-blur">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#075fc4]">Featured connection</p>
              <div className="mt-6 flex items-center justify-between">
                <div><p className="text-4xl font-extrabold">SGN</p><p className="mt-1 text-sm text-[#52627a]">Ho Chi Minh City</p></div>
                <div className="flex flex-1 items-center px-5"><span className="h-px flex-1 bg-[#9ecdfd]" /><span className="mx-2 text-2xl text-[#147df5]">✈</span><span className="h-px flex-1 bg-[#9ecdfd]" /></div>
                <div className="text-right"><p className="text-4xl font-extrabold">LHR</p><p className="mt-1 text-sm text-[#52627a]">London</p></div>
              </div>
              <div className="mt-7 grid grid-cols-3 gap-2 border-t border-[#dce5ef] pt-5 text-center text-xs">
                <div><strong className="block text-base">3</strong>options</div>
                <div><strong className="block text-base">0–1</strong>stops</div>
                <div><strong className="block text-base">Local</strong>data</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce5ef] bg-white py-20" id="route-search">
        <div className="page-container">
          <div className="mb-9 max-w-2xl">
            <p className="eyebrow">Route finder</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">Where can the graph take you?</h2>
          </div>
          <div className="surface p-5 sm:p-8"><AirportSearchForm /></div>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[#52627a]">
            <span className="mr-2 font-bold text-[#101828]">Try a fixture:</span>
            {AIRPORTS.map((airport) => (
              <Link className="rounded-full border border-[#dce5ef] bg-white px-3 py-1.5 hover:border-[#147df5]" href={`/flights-from/${airport.iata}`} key={airport.iata}>
                {airport.city} · {airport.iata}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-24" id="how-it-works">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["01", "Choose airports", "Use the small fixture airport directory to define a route."],
            ["02", "Query the route graph", "The Next.js server calls the service-role-only Supabase RPC."],
            ["03", "Review schedules", "Compare direct and one-stop recurring options without confusing them with live fares."],
          ].map(([number, title, description]) => (
            <article className="surface p-7" key={number}>
              <span className="text-sm font-extrabold text-[#147df5]">{number}</span>
              <h2 className="mt-8 text-xl font-extrabold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#52627a]">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
