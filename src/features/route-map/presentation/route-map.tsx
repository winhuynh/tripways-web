import type { RouteMapReadModel } from "../domain/route-map-model";
import { RouteMapClient } from "./route-map-client";
import { RouteMapFallback } from "./route-map-fallback";

export function RouteMap({
  readModel,
}: Readonly<{ readModel: RouteMapReadModel }>) {
  if (readModel.destinations.length === 0) {
    return (
      <section
        aria-label={`Interactive direct-route map from ${readModel.origin.name}`}
        className="route-map-shell"
      >
        <RouteMapFallback origin={readModel.origin} state="empty" />
      </section>
    );
  }

  return <RouteMapClient readModel={readModel} />;
}
