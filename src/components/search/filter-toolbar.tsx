import type { RouteFilters } from "@/lib/route-filters";

export function FilterToolbar({ filters }: { filters: RouteFilters }) {
  return (
    <form className="flex flex-wrap items-end gap-3 border-y border-[#dce5ef] py-4" method="get">
      <label className="grid gap-1 text-xs font-bold text-[#52627a]">
        Stops
        <select className="rounded-full border border-[#dce5ef] bg-white px-4 py-2.5" defaultValue={filters.max_stops} name="stops">
          <option value="1">Up to 1 stop</option>
          <option value="0">Direct only</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-bold text-[#52627a]">
        Departure
        <select className="rounded-full border border-[#dce5ef] bg-white px-4 py-2.5" defaultValue={filters.departure_window ?? ""} name="departure">
          <option value="">Any time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-bold text-[#52627a]">
        Max duration
        <select className="rounded-full border border-[#dce5ef] bg-white px-4 py-2.5" defaultValue={filters.max_duration_minutes ?? ""} name="duration">
          <option value="">Any duration</option>
          <option value="900">15 hours</option>
          <option value="1200">20 hours</option>
          <option value="1440">24 hours</option>
        </select>
      </label>
      <button className="rounded-full bg-[#101828] px-5 py-2.5 text-sm font-bold text-white" type="submit">
        Apply filters
      </button>
    </form>
  );
}
