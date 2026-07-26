"use client";

import type { Airport } from "../domain/airport";
import { RouteMapClient } from "./route-map-client";

type RouteMapProps = {
  origin: Airport;
  destinations: Airport[];
};

/** Public UI boundary for the standalone route-discovery map. */
export function RouteMap({ origin, destinations }: RouteMapProps) {
  return <RouteMapClient destinations={destinations} origin={origin} />;
}
