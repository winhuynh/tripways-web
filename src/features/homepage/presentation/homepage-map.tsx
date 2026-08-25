"use client";

import {
  getHubRouteNetwork,
  type HubAirport,
} from "../domain/homepage-routes-data";
import { InteractiveRouteMap } from "@/shared/ui";

type HomepageMapProps = {
  currentHub: HubAirport;
};

/**
 * Homepage interactive flight route map.
 * Adapts active origin hub network data into the shared InteractiveRouteMap component.
 */
export function HomepageMap({ currentHub }: HomepageMapProps) {
  const network = getHubRouteNetwork(currentHub);

  const destinations = network.destinations.map((dest) => ({
    city: dest.cityName,
    citySlug: dest.citySlug,
    iata: dest.iata,
    airportName: dest.airportName,
    country: dest.countryName,
    countryName: dest.countryName,
    latitude: dest.latitude,
    longitude: dest.longitude,
    typicalDuration: dest.typicalDuration,
    durationRange: dest.durationRange,
    minDuration: dest.shortestDurationMinutes,
    airlines: dest.airlines,
    distanceKm: dest.distanceKm,
    routePath: dest.routePath,
  }));

  return (
    <section
      className="home-map-section"
      aria-label="Interactive flight route map"
    >
      <div className="pseo-container">
        <InteractiveRouteMap
          origin={{
            name: currentHub.cityName,
            iata: currentHub.iata,
            latitude: currentHub.latitude,
            longitude: currentHub.longitude,
            citySlug: currentHub.citySlug,
          }}
          destinations={destinations}
          showOriginBadge={true}
          autoOpenFirstPopup={true}
          height="520px"
        />
      </div>
    </section>
  );
}
