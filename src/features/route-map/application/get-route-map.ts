import type { RouteMapRepository } from "./route-map-repository";
import type {
  RouteMapQuery,
  RouteMapReadModel,
} from "../domain/route-map-model";

export type RouteMapLoadResult =
  | Readonly<{ status: "available"; data: RouteMapReadModel }>
  | Readonly<{
      status: "unavailable";
      reason: "unsupported_origin" | "read_failed";
    }>;

/**
 * Creates the reusable map read use case and converts transport failures into
 * an isolated unavailable state so the surrounding page can still render.
 */
export function createGetRouteMap(repository: RouteMapRepository) {
  return async function getRouteMap(
    query: RouteMapQuery,
  ): Promise<RouteMapLoadResult> {
    if (query.origin.type !== "city") {
      return { status: "unavailable", reason: "unsupported_origin" };
    }

    try {
      return {
        status: "available",
        data: await repository.getCityRouteMap({
          ...query,
          origin: query.origin,
        }),
      };
    } catch {
      return { status: "unavailable", reason: "read_failed" };
    }
  };
}
