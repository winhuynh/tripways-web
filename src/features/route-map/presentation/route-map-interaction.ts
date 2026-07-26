import type {
  CircleLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";

const ROUTE_LINE_SOURCE = "route-map-lines";
const ROUTE_POINT_SOURCE = "route-map-points";

type FeatureStateTarget = Readonly<{
  source: string;
  id: string;
}>;

export type RouteMapInteractionPort = Readonly<{
  setFeatureState(
    target: FeatureStateTarget,
    state: Readonly<{ active: boolean; dimmed: boolean }>,
  ): void;
  removeFeatureState(target: FeatureStateTarget): void;
}>;

export const ROUTE_LINE_PAINT = {
  "line-color": [
    "case",
    ["boolean", ["feature-state", "active"], false],
    "#147df5",
    ["boolean", ["feature-state", "dimmed"], false],
    "#a9b8c7",
    "#147df5",
  ],
  "line-width": [
    "case",
    ["boolean", ["feature-state", "active"], false],
    2.4,
    ["boolean", ["feature-state", "dimmed"], false],
    1,
    1.35,
  ],
  "line-opacity": [
    "case",
    ["boolean", ["feature-state", "active"], false],
    0.95,
    ["boolean", ["feature-state", "dimmed"], false],
    0.2,
    0.68,
  ],
} satisfies NonNullable<LineLayerSpecification["paint"]>;

export const ROUTE_POINT_PAINT = {
  "circle-radius": [
    "case",
    ["==", ["get", "role"], "origin"],
    6,
    ["boolean", ["feature-state", "active"], false],
    4.75,
    3.25,
  ],
  "circle-color": [
    "case",
    ["==", ["get", "role"], "origin"],
    "#f97316",
    "#147df5",
  ],
  "circle-opacity": [
    "case",
    ["==", ["get", "role"], "origin"],
    1,
    ["boolean", ["feature-state", "dimmed"], false],
    0.42,
    0.9,
  ],
  "circle-stroke-color": "#ffffff",
  "circle-stroke-width": 1.5,
} satisfies NonNullable<CircleLayerSpecification["paint"]>;

export function focusRouteFeatures(
  port: RouteMapInteractionPort,
  destinationSlugs: readonly string[],
  activeSlug: string,
): void {
  for (const destinationSlug of destinationSlugs) {
    const state = {
      active: destinationSlug === activeSlug,
      dimmed: destinationSlug !== activeSlug,
    };
    port.setFeatureState(
      {
        source: ROUTE_LINE_SOURCE,
        id: `route:${destinationSlug}`,
      },
      state,
    );
    port.setFeatureState(
      {
        source: ROUTE_POINT_SOURCE,
        id: `destination:${destinationSlug}`,
      },
      state,
    );
  }
}

export function resetRouteFeatures(
  port: RouteMapInteractionPort,
  destinationSlugs: readonly string[],
): void {
  for (const destinationSlug of destinationSlugs) {
    port.removeFeatureState({
      source: ROUTE_LINE_SOURCE,
      id: `route:${destinationSlug}`,
    });
    port.removeFeatureState({
      source: ROUTE_POINT_SOURCE,
      id: `destination:${destinationSlug}`,
    });
  }
}
