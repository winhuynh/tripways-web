import Link from "next/link";

import { AIRPORTS } from "@/lib/airports";

import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[#dce5ef] bg-white">
      <div className="page-container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <Brand />
          <p className="text-sm leading-6 text-[#52627a]">
            A focused local interface for learning and testing the Tripways Route Discovery graph.
          </p>
        </div>
        <div>
          <p className="mb-4 text-sm font-extrabold">Fixture airports</p>
          <div className="grid gap-3 text-sm text-[#52627a]">
            {AIRPORTS.slice(0, 3).map((airport) => (
              <Link href={`/flights-from/${airport.iata}`} key={airport.iata}>
                {airport.city} ({airport.iata})
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-extrabold">Current scope</p>
          <p className="text-sm leading-6 text-[#52627a]">
            Stored route schedules only. Live prices and dated seat inventory will be added through
            a separate provider feature later.
          </p>
        </div>
      </div>
      <div className="page-container border-t border-[#edf1f5] py-6 text-xs text-[#718096]">
        © 2026 Tripways. Local development prototype.
      </div>
    </footer>
  );
}
