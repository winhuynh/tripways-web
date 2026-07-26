import type { Airport } from "../domain/airport";

type RouteMapFallbackProps = {
  destinations: readonly Airport[];
  origin: Airport;
  state: "loading" | "error";
};

/** Preserves map space and route context while the interactive map cannot render. */
export function RouteMapFallback({
  destinations,
  origin,
  state,
}: RouteMapFallbackProps) {
  return (
    <div
      aria-label={`Interactive route map from ${origin.city}`}
      className="route-map-shell grid place-items-center bg-[#dcebf2] p-6"
      role="img"
    >
      <div className="max-w-lg rounded-2xl border border-white/80 bg-white/90 p-5 text-center shadow-lg">
        <p className="font-extrabold">
          {state === "loading" ? "Loading interactive map" : "Interactive map is unavailable"}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#52627a]">
          {origin.iata} → {destinations.map((airport) => airport.iata).join(", ")}
        </p>
      </div>
    </div>
  );
}
