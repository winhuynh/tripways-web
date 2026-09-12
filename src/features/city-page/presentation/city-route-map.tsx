"use client";

import type { CityPageDestination } from "../domain/city-page-model";
import { InteractiveRouteMap } from "@/shared/ui";

const KNOWN_AIRPORT_COORDS: Record<
  string,
  { lat: number; lon: number; name: string }
> = {
  BKK: { lat: 13.69, lon: 100.7501, name: "Suvarnabhumi Airport" },
  DMK: { lat: 13.9126, lon: 100.6068, name: "Don Mueang International Airport" },
  SIN: { lat: 1.3644, lon: 103.9915, name: "Changi Airport" },
  HKG: { lat: 22.308, lon: 113.9185, name: "Hong Kong International Airport" },
  NRT: { lat: 35.772, lon: 140.3929, name: "Narita International Airport" },
  HND: { lat: 35.5494, lon: 139.7798, name: "Haneda Airport" },
  LHR: { lat: 51.47, lon: -0.4543, name: "Heathrow Airport" },
  SYD: { lat: -33.9399, lon: 151.1753, name: "Kingsford Smith Airport" },
  HKT: { lat: 8.1132, lon: 98.3169, name: "Phuket International Airport" },
  CNX: { lat: 18.7668, lon: 98.9626, name: "Chiang Mai International Airport" },
  USM: { lat: 9.5541, lon: 100.0631, name: "Samui Airport" },
  KBV: { lat: 8.0991, lon: 98.9863, name: "Krabi International Airport" },
  CDG: { lat: 49.0097, lon: 2.5479, name: "Charles de Gaulle Airport" },
  DXB: { lat: 25.2532, lon: 55.3657, name: "Dubai International Airport" },
  JFK: {
    lat: 40.6413,
    lon: -73.7781,
    name: "John F. Kennedy International Airport",
  },
  SGN: {
    lat: 10.8188,
    lon: 106.6519,
    name: "Tan Son Nhat International Airport",
  },
};

type CityRouteMapProps = {
  cityName: string;
  originIata?: string;
  originLat?: number;
  originLon?: number;
  destinations: readonly CityPageDestination[];
};

/**
 * City Hub interactive route map.
 * Adapts city destination dataset and coordinates into the shared InteractiveRouteMap component.
 */
export function CityRouteMap({
  cityName,
  originIata = "BKK",
  originLat,
  originLon,
  destinations,
}: CityRouteMapProps) {
  const fallbackOriginCoord = KNOWN_AIRPORT_COORDS[originIata];
  const originLatitude = originLat ?? fallbackOriginCoord?.lat ?? 13.69;
  const originLongitude = originLon ?? fallbackOriginCoord?.lon ?? 100.7501;

  const mappedDestinations = destinations
    .map((dest, idx) => {
      const iata = dest.airports[0] ?? "";
      const fallbackCoord = KNOWN_AIRPORT_COORDS[iata];
      const latitude = dest.latitude ?? fallbackCoord?.lat;
      const longitude = dest.longitude ?? fallbackCoord?.lon;

      if (latitude === undefined || longitude === undefined) return null;

      return {
        city: dest.city,
        citySlug: dest.citySlug,
        iata: iata || dest.city.slice(0, 3).toUpperCase(),
        airportName: fallbackCoord?.name,
        country: dest.country,
        latitude,
        longitude,
        minDuration: dest.minDuration,
        airlines: dest.airlines,
        frequency: dest.frequency,
        fareMin: dest.fareMin,
        fareMax: dest.fareMax,
        fareCurrency: dest.fareCurrency,
        routePath: dest.path,
        isTopRoute: dest.isTopRoute ?? idx === 0,
      };
    })
    .filter(
      (
        d,
      ): d is NonNullable<typeof d> => d !== null,
    );

  function renderAffiliatePopup(dest: Parameters<NonNullable<React.ComponentProps<typeof InteractiveRouteMap>["renderPopupHtml"]>>[0]): string {
    const destCity = dest.city;
    const destIata = dest.iata;
    const duration = dest.typicalDuration || `${Math.floor((dest.minDuration ?? 120) / 60)}h ${(dest.minDuration ?? 120) % 60}m`;
    const currency = dest.fareCurrency ?? "£";
    const hasFare = typeof dest.fareMin === "number" && typeof dest.fareMax === "number";
    const fareDealText = hasFare ? `deals from ${currency}${dest.fareMin}` : "fares";
    const affUrl = `https://www.aviasales.com/search/${originIata.toUpperCase()}0101${destIata.toUpperCase()}1?marker=tripways.city_map_pin`;

    return `
      <div class="interactive-map-popup-card city-map-aff-popup">
        <div class="interactive-map-popup-header">
          <div>
            <h3 class="interactive-map-popup-title">${destCity}</h3>
            <p class="interactive-map-popup-subtitle">${destIata} · Direct flight</p>
          </div>
          <span class="interactive-map-popup-badge">${duration}</span>
        </div>
        <div class="interactive-map-popup-details">
          <div class="interactive-map-popup-row">
            <span class="interactive-map-popup-label">Flight duration</span>
            <strong class="interactive-map-popup-val">${duration}</strong>
          </div>
          ${
            hasFare
              ? `<div class="interactive-map-popup-row">
            <span class="interactive-map-popup-label">Observed fare</span>
            <strong class="interactive-map-popup-val" style="color: #0066ff;">${currency}${dest.fareMin} - ${currency}${dest.fareMax}</strong>
          </div>`
              : ""
          }
        </div>
        <div class="interactive-map-popup-actions" style="margin-top: 10px;">
          <a href="${affUrl}" target="_blank" rel="noopener noreferrer" class="interactive-map-popup-btn interactive-map-popup-btn--primary" style="width: 100%; text-align: center; justify-content: center;">
            Check ${fareDealText} on Aviasales ↗
          </a>
        </div>
      </div>
    `;
  }

  return (
    <div
      className="city-map-frame"
      aria-label={`Interactive route map from ${cityName}`}
    >
      <InteractiveRouteMap
        origin={{
          name: cityName,
          iata: originIata,
          latitude: originLatitude,
          longitude: originLongitude,
        }}
        destinations={mappedDestinations}
        showOriginBadge={false}
        autoOpenFirstPopup={true}
        height="480px"
        renderPopupHtml={renderAffiliatePopup}
      />
    </div>
  );
}
