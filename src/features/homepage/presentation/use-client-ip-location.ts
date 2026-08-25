"use client";

import { useState } from "react";
import {
  DEFAULT_ORIGIN_HUB,
  type HubAirport,
} from "../domain/homepage-routes-data";

/**
 * Custom React hook managing the active departure hub on the homepage.
 * Initialized from server edge geo headers (initialHub) without third-party IP leakage.
 */
export function useClientIpLocation(
  initialHub: HubAirport = DEFAULT_ORIGIN_HUB,
) {
  const [currentHub, setCurrentHub] = useState<HubAirport>(initialHub);

  return {
    currentHub,
    setCurrentHub,
  };
}
