import type { ReactElement } from "react";

import { RouteMap } from "@/features/route-map";
import type { RouteMapReadModel } from "@/features/route-map";

type HomeRouteMapResult =
  | Readonly<{ status: "available"; data: RouteMapReadModel }>
  | Readonly<{
      status: "unavailable";
      reason: "unsupported_origin" | "read_failed";
    }>;

/**
 * Loads the homepage route-map dataset independently from the static
 * editorial read model and renders a local unavailable state on failure.
 */
export async function HomeRouteMapSection() {
  try {
    const { routeMap } = await import("@/features/route-map/server");
    const result = await routeMap.getRouteMap({
      origin: { type: "city", slug: "bangkok" },
      locale: "en-GB",
      limit: 100,
    });

    return HomeRouteMapContent({ result });
  } catch {
    return HomeRouteMapContent({
      result: { status: "unavailable", reason: "read_failed" },
    });
  }
}

/**
 * Renders either the resolved reusable route map or its isolated unavailable
 * state.
 */
export function HomeRouteMapContent({
  result,
}: Readonly<{ result: HomeRouteMapResult }>): ReactElement {
  if (result.status === "available") {
    return <RouteMap readModel={result.data} />;
  }

  return (
    <div
      aria-label="Global direct-route map"
      className="home-route-map__unavailable"
      role="status"
    >
      <strong>Route map is temporarily unavailable</strong>
      <p>The editorial homepage remains available while route data reloads.</p>
    </div>
  );
}

/**
 * Preserves the map section dimensions while its server read model streams.
 */
export function HomeRouteMapFallback() {
  return (
    <div
      aria-label="Loading global direct-route map"
      className="home-route-map__loading"
      role="status"
    >
      <span />
      <span />
      <span />
    </div>
  );
}
