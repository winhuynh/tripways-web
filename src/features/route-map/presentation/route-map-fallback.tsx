import type { RouteMapOrigin } from "../domain/route-map-model";

type RouteMapFallbackProps = Readonly<{
  origin: RouteMapOrigin;
  state: "loading" | "error" | "empty";
}>;

/** Keeps the route-map section stable during loading, errors, or empty results. */
export function RouteMapFallback({
  origin,
  state,
}: RouteMapFallbackProps) {
  const title = state === "loading"
    ? "Loading interactive route map"
    : state === "error"
    ? "Interactive route map is unavailable"
    : "No direct routes match these filters";
  const description = state === "empty"
    ? `${origin.name} remains the selected departure city.`
    : `Direct-route network from ${origin.name}.`;

  return (
    <div className="route-map-fallback">
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}
