"use client";

import { InteractiveRouteMap, type RouteMapOrigin } from "@/shared/ui";
import type { SharedMapDestination } from "@/shared/ui/interactive-route-map-popup";
import type { RoutePlaceEntity } from "../domain/route-page-model";

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
  LGW: { lat: 51.1537, lon: -0.1821, name: "Gatwick Airport" },
  STN: { lat: 51.886, lon: 0.2389, name: "London Stansted Airport" },
  LTN: { lat: 51.8747, lon: -0.3683, name: "London Luton Airport" },
  LCY: { lat: 51.5048, lon: 0.0495, name: "London City Airport" },
  SYD: { lat: -33.9399, lon: 151.1753, name: "Kingsford Smith Airport" },
  HKT: { lat: 8.1132, lon: 98.3169, name: "Phuket International Airport" },
  CNX: { lat: 18.7668, lon: 98.9626, name: "Chiang Mai International Airport" },
  CDG: { lat: 49.0097, lon: 2.5479, name: "Charles de Gaulle Airport" },
  DXB: { lat: 25.2532, lon: 55.3657, name: "Dubai International Airport" },
  DOH: { lat: 25.2731, lon: 51.6081, name: "Hamad International Airport" },
  JFK: { lat: 40.6413, lon: -73.7781, name: "John F. Kennedy International Airport" },
  SGN: { lat: 10.8188, lon: 106.6519, name: "Tan Son Nhat International Airport" },
};

// Fallback city coordinates
const CITY_FALLBACK_COORDS: Record<string, { lat: number; lon: number; iata: string }> = {
  bangkok: { lat: 13.7563, lon: 100.5018, iata: "BKK" },
  london: { lat: 51.5074, lon: -0.1278, iata: "LHR" },
  singapore: { lat: 1.3521, lon: 103.8198, iata: "SIN" },
  paris: { lat: 48.8566, lon: 2.3522, iata: "CDG" },
  tokyo: { lat: 35.6762, lon: 139.6503, iata: "HND" },
  dubai: { lat: 25.2048, lon: 55.2708, iata: "DXB" },
  "ho-chi-minh-city": { lat: 10.8231, lon: 106.6297, iata: "SGN" },
};

export type RouteFlightMapProps = Readonly<{
  origin: RoutePlaceEntity;
  destination: RoutePlaceEntity;
  overlayText?: string;
  className?: string;
}>;

export function RouteFlightMap({
  origin,
  destination,
  overlayText,
  className = "",
}: RouteFlightMapProps) {
  const originFallback =
    CITY_FALLBACK_COORDS[origin.slug.toLowerCase()] ??
    KNOWN_AIRPORT_COORDS[origin.iataCode ?? ""] ?? {
      lat: 13.69,
      lon: 100.7501,
      iata: "BKK",
    };

  const destFallback =
    CITY_FALLBACK_COORDS[destination.slug.toLowerCase()] ??
    KNOWN_AIRPORT_COORDS[destination.iataCode ?? ""] ?? {
      lat: 51.47,
      lon: -0.4543,
      iata: "LHR",
    };

  const originLat = origin.latitude ?? originFallback.lat;
  const originLon = origin.longitude ?? originFallback.lon;
  const originIata = origin.iataCode ?? originFallback.iata ?? origin.name.slice(0, 3).toUpperCase();

  const destLat = destination.latitude ?? destFallback.lat;
  const destLon = destination.longitude ?? destFallback.lon;
  const destIata =
    destination.iataCode ??
    destFallback.iata ??
    destination.name.slice(0, 3).toUpperCase();

  const mapOrigin: RouteMapOrigin = {
    name: origin.name,
    iata: originIata,
    latitude: originLat,
    longitude: originLon,
    citySlug: origin.slug,
  };

  const mapDestinations: SharedMapDestination[] = [
    {
      city: destination.name,
      citySlug: destination.slug,
      iata: destIata,
      airportName: KNOWN_AIRPORT_COORDS[destIata]?.name,
      country: "",
      latitude: destLat,
      longitude: destLon,
      isTopRoute: true,
      routePath: `/flights/${origin.slug}-to-${destination.slug}`,
    },
  ];

  return (
    <div
      className={`route-flight-map-frame ${className}`}
      aria-label={`Route map from ${origin.name} to ${destination.name}`}
    >
      <InteractiveRouteMap
        origin={mapOrigin}
        destinations={mapDestinations}
        showOriginBadge={false}
        autoOpenFirstPopup={false}
        height="380px"
        bottomOverlay={
          overlayText ? (
            <div className="route-map-overlay-pill">
              <div className="route-map-overlay-pill__info">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#005cb9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>{overlayText}</span>
              </div>
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
