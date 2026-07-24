"use client";

import type { Airport } from "../domain/airport";
import { RouteMapClient } from "./route-map-client";

type RouteMapProps = {
  origin: Airport;
  destinations: Airport[];
};

export function RouteMap({ origin, destinations }: RouteMapProps) {
  return <RouteMapClient destinations={destinations} origin={origin} />;
}
