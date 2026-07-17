import Link from "next/link";

import type { Airport } from "@/lib/airports";
import type { RouteSearchEnvelope } from "@/lib/route-discovery";

function formatMinutes(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

export function DestinationCard({
  origin,
  destination,
  result,
}: {
  origin: Airport;
  destination: Airport;
  result: RouteSearchEnvelope;
}) {
  const fastest = result.data[0];

  return (
    <article className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-[0_10px_30px_rgb(35_61_85/5%)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold">{destination.city}</h3>
          <p className="mt-1 text-xs text-[#52627a]">{destination.country} · {destination.name} ({destination.iata})</p>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-[#eaf4ff] text-sm font-extrabold text-[#075fc4]">{destination.iata}</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-[#edf1f5] py-4 text-sm">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#718096]">Fastest</p>
          <p className="mt-1 font-extrabold">{formatMinutes(fastest.total_duration_minutes)}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#718096]">Options</p>
          <p className="mt-1 font-extrabold">{result.meta.total ?? result.data.length} routes</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {fastest.operating_airlines.map((airline) => (
            <span className="rounded-full bg-[#f0f4f8] px-2.5 py-1 text-xs font-bold" key={airline}>{airline}</span>
          ))}
        </div>
        <Link className="rounded-full bg-[#eaf4ff] px-4 py-2 text-xs font-extrabold text-[#075fc4]" href={`/routes/${origin.iata}/${destination.iata}`}>
          View routes
        </Link>
      </div>
    </article>
  );
}
