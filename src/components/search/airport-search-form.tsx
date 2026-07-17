"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AIRPORTS } from "@/lib/airports";

type AirportSearchFormProps = {
  defaultFrom?: string;
  defaultTo?: string;
  compact?: boolean;
};

export function AirportSearchForm({
  defaultFrom = "SGN",
  defaultTo = "LHR",
  compact = false,
}: AirportSearchFormProps) {
  const router = useRouter();
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (from === to) {
      setError("Choose two different airports.");
      return;
    }

    setError("");
    router.push(`/routes/${from}/${to}`);
  }

  function swapAirports() {
    setFrom(to);
    setTo(from);
    setError("");
  }

  return (
    <form
      className={`grid gap-3 ${compact ? "md:grid-cols-[1fr_auto_1fr_auto]" : "md:grid-cols-[1fr_auto_1fr_0.8fr_auto]"}`}
      onSubmit={submit}
    >
      <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#52627a]">
        From
        <select
          className="h-14 rounded-xl border border-[#dce5ef] bg-white px-4 text-base font-bold normal-case tracking-normal text-[#101828]"
          onChange={(event) => setFrom(event.target.value)}
          value={from}
        >
          {AIRPORTS.map((airport) => (
            <option key={airport.iata} value={airport.iata}>
              {airport.city} ({airport.iata})
            </option>
          ))}
        </select>
      </label>
      <button
        aria-label="Swap origin and destination"
        className="mt-auto hidden size-12 place-items-center rounded-full border border-[#dce5ef] bg-white text-xl md:grid"
        onClick={swapAirports}
        type="button"
      >
        ⇄
      </button>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#52627a]">
        To
        <select
          className="h-14 rounded-xl border border-[#dce5ef] bg-white px-4 text-base font-bold normal-case tracking-normal text-[#101828]"
          onChange={(event) => setTo(event.target.value)}
          value={to}
        >
          {AIRPORTS.map((airport) => (
            <option key={airport.iata} value={airport.iata}>
              {airport.city} ({airport.iata})
            </option>
          ))}
        </select>
      </label>
      {!compact && (
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#52627a]">
          Travel date
          <input
            className="h-14 rounded-xl border border-[#dce5ef] bg-white px-4 text-base normal-case tracking-normal text-[#101828]"
            type="date"
          />
        </label>
      )}
      <button
        className="mt-auto h-14 rounded-xl bg-[#147df5] px-7 font-extrabold text-white transition hover:bg-[#075fc4]"
        type="submit"
      >
        Find routes
      </button>
      {error && <p className="text-sm font-semibold text-red-600 md:col-span-full">{error}</p>}
    </form>
  );
}
