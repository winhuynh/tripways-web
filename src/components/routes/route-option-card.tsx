import type { RouteOption } from "@/lib/route-discovery";

const WEEKDAYS: Record<number, string> = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

function formatMinutes(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

export function RouteOptionCard({ option }: { option: RouteOption }) {
  return (
    <article className="rounded-2xl border border-[#dce5ef] bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {[...new Set(option.operating_airlines)].map((airline) => (
            <span className="grid size-11 place-items-center rounded-xl bg-[#eaf4ff] text-sm font-extrabold text-[#075fc4]" key={airline}>{airline}</span>
          ))}
          <div>
            <p className="font-extrabold">{option.stops === 0 ? "Direct flight" : "One-stop route"}</p>
            <p className="mt-1 text-xs text-[#52627a]">Stored recurring schedule</p>
          </div>
        </div>
        <span className="rounded-full bg-[#ecfdf3] px-3 py-1.5 text-xs font-bold text-[#067647]">
          {Math.round(option.confidence_score * 100)}% confidence
        </span>
      </div>
      <div className="mt-7 grid items-center gap-4 sm:grid-cols-[auto_1fr_auto]">
        <div>
          <p className="text-2xl font-extrabold">{option.departure_local_time}</p>
          <p className="text-sm font-bold text-[#52627a]">{option.from}</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-[#52627a]">{formatMinutes(option.total_duration_minutes)}</p>
          <div className="my-2 flex items-center"><span className="size-2 rounded-full bg-[#147df5]" /><span className="h-px flex-1 bg-[#9ecdfd]" /><span className="text-[#147df5]">✈</span></div>
          <p className="text-xs font-bold text-[#075fc4]">
            {option.stops === 0 ? "Non-stop" : `${option.connection_airports.join(", ")} · ${formatMinutes(option.layover_minutes ?? 0)} layover`}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-2xl font-extrabold">{option.arrival_local_time}</p>
          <p className="text-sm font-bold text-[#52627a]">{option.to}{option.arrival_day_offset > 0 ? ` +${option.arrival_day_offset}` : ""}</p>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#edf1f5] pt-5 text-xs text-[#52627a]">
        <span><strong className="text-[#101828]">Flying:</strong> {formatMinutes(option.total_flight_minutes)}</span>
        <span><strong className="text-[#101828]">Days:</strong> {option.days_of_week.map((day) => WEEKDAYS[day]).join(", ")}</span>
        <span><strong className="text-[#101828]">Valid:</strong> {option.valid_from} → {option.valid_to}</span>
      </div>
    </article>
  );
}
