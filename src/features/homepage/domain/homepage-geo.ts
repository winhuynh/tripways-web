import {
  DEFAULT_ORIGIN_HUB,
  HUB_AIRPORTS,
  type HubAirport,
} from "./homepage-routes-data";

export type GeolocationInput = Readonly<{
  city?: string | null;
  country?: string | null;
  countryCode?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
}>;

/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Resolves the closest Hub airport based on provided geolocation hints (city/country or lat/lon coordinates).
 */
export function resolveNearestHub(input?: GeolocationInput): HubAirport {
  if (!input) return DEFAULT_ORIGIN_HUB;

  // 1. Direct city match
  if (input.city) {
    const normalizedCity = input.city.trim().toLowerCase();
    const cityMatch = HUB_AIRPORTS.find(
      (hub) =>
        hub.cityName.toLowerCase() === normalizedCity ||
        hub.citySlug.toLowerCase() === normalizedCity,
    );
    if (cityMatch) return cityMatch;
  }

  // 2. Direct country code match (e.g. "VN", "GB", "TH", "SG", "JP", "US", "FR", "AE")
  if (input.countryCode) {
    const normalizedCode = input.countryCode.trim().toUpperCase();
    const countryMatch = HUB_AIRPORTS.find(
      (hub) => hub.countryIso2 === normalizedCode,
    );
    if (countryMatch) return countryMatch;
  }

  // 3. Coordinate-based proximity match
  const lat =
    typeof input.latitude === "string"
      ? parseFloat(input.latitude)
      : input.latitude;
  const lon =
    typeof input.longitude === "string"
      ? parseFloat(input.longitude)
      : input.longitude;

  if (
    typeof lat === "number" &&
    !isNaN(lat) &&
    typeof lon === "number" &&
    !isNaN(lon)
  ) {
    let closestHub = DEFAULT_ORIGIN_HUB;
    let minDistance = Infinity;

    for (const hub of HUB_AIRPORTS) {
      const distance = calculateHaversineDistanceKm(
        lat,
        lon,
        hub.latitude,
        hub.longitude,
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestHub = hub;
      }
    }

    return closestHub;
  }

  return DEFAULT_ORIGIN_HUB;
}
