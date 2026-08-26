import {
  AIRPORTS_CATALOG,
  CITIES_CATALOG,
  type AirportRecord,
} from "./airports-catalog";
import { calculateHaversineDistanceKm } from "./homepage-geo";

export type LocationSuggestionType = "city" | "airport" | "action";

export type LocationSuggestionItem = Readonly<{
  id: string;
  type: LocationSuggestionType;
  title: string;
  subtitle: string;
  iata?: string;
  cityName: string;
  citySlug?: string;
  airportName?: string;
  countryName: string;
  countryIso2?: string;
  distanceKm?: number;
  actionType?: "everywhere" | "multicity";
  latitude?: number;
  longitude?: number;
}>;

export const DEFAULT_QUICK_ACTIONS: readonly LocationSuggestionItem[] = [
  {
    id: "action-explore-everywhere",
    type: "action",
    title: "Explore everywhere",
    subtitle: "",
    cityName: "",
    countryName: "",
    actionType: "everywhere",
  },
  {
    id: "action-multi-city",
    type: "action",
    title: "Multi-city search",
    subtitle: "",
    cityName: "",
    countryName: "",
    actionType: "multicity",
  },
] as const;

/**
 * Finds an airport record by IATA code.
 */
export function findAirportByIata(iata: string): AirportRecord | undefined {
  const code = iata.trim().toUpperCase();
  return AIRPORTS_CATALOG.find((a) => a.iata.toUpperCase() === code);
}

/**
 * Resolves nearby airports within a given radius (default 300km) from a reference airport or coordinates.
 */
export function getNearbyAirports(options: {
  originIata?: string;
  latitude?: number;
  longitude?: number;
  maxDistanceKm?: number;
  limit?: number;
}): LocationSuggestionItem[] {
  const maxDistanceKm = options.maxDistanceKm ?? 300;
  const limit = options.limit ?? 10;

  let originAirport: AirportRecord | undefined;
  let originLat = options.latitude;
  let originLon = options.longitude;

  if (options.originIata) {
    originAirport = findAirportByIata(options.originIata);
    if (originAirport) {
      originLat = originAirport.latitude;
      originLon = originAirport.longitude;
    }
  }

  if (typeof originLat !== "number" || typeof originLon !== "number") {
    return [];
  }

  const originCity = originAirport ? originAirport.cityName : "origin";
  const originCountry = originAirport ? originAirport.countryName : "";

  const results: LocationSuggestionItem[] = [];

  // Add the origin airport at the top if present
  if (originAirport) {
    results.push({
      id: `airport-${originAirport.iata}`,
      type: "airport",
      title: `${originAirport.name} (${originAirport.iata})`,
      subtitle: originCountry,
      iata: originAirport.iata,
      cityName: originAirport.cityName,
      citySlug: originAirport.citySlug,
      airportName: originAirport.name,
      countryName: originCountry,
      countryIso2: originAirport.countryIso2,
      latitude: originAirport.latitude,
      longitude: originAirport.longitude,
    });
  }

  // Calculate distance to all other airports
  const nearby: Array<{ airport: AirportRecord; distance: number }> = [];

  for (const airport of AIRPORTS_CATALOG) {
    if (originAirport && airport.iata === originAirport.iata) continue;

    const distance = calculateHaversineDistanceKm(
      originLat,
      originLon,
      airport.latitude,
      airport.longitude,
    );

    if (distance <= maxDistanceKm && distance > 0) {
      nearby.push({ airport, distance });
    }
  }

  nearby.sort((a, b) => a.distance - b.distance);

  for (const item of nearby.slice(0, limit)) {
    const roundedDist = Math.round(item.distance);

    results.push({
      id: `airport-${item.airport.iata}`,
      type: "airport",
      title: `${item.airport.name} (${item.airport.iata})`,
      subtitle: `${roundedDist} km from ${originCity}, ${originCountry}`,
      iata: item.airport.iata,
      cityName: item.airport.cityName,
      citySlug: item.airport.citySlug,
      airportName: item.airport.name,
      countryName: item.airport.countryName,
      countryIso2: item.airport.countryIso2,
      distanceKm: roundedDist,
      latitude: item.airport.latitude,
      longitude: item.airport.longitude,
    });
  }

  return results;
}

/**
 * Searches for airports and cities by query text (prefix, substring, case-insensitive).
 */
export function searchLocationSuggestions(
  query: string,
  options?: {
    originIata?: string;
    includeQuickActions?: boolean;
    limit?: number;
  },
): LocationSuggestionItem[] {
  const trimmed = query.trim();
  const includeQuickActions = options?.includeQuickActions ?? true;
  const limit = options?.limit ?? 8;

  // 1. Empty query state:
  if (!trimmed) {
    if (options?.originIata) {
      const nearby = getNearbyAirports({
        originIata: options.originIata,
        maxDistanceKm: 300,
        limit,
      });
      if (nearby.length > 0) {
        return nearby;
      }
    }
    return includeQuickActions ? [...DEFAULT_QUICK_ACTIONS] : [];
  }

  // 2. Active query matching:
  const lowerQuery = trimmed.toLowerCase();
  const upperQuery = trimmed.toUpperCase();

  const cityMatches = new Map<string, LocationSuggestionItem>();
  const airportMatches: LocationSuggestionItem[] = [];

  // Match cities
  for (const city of CITIES_CATALOG) {
    const lowerCityName = city.cityName.toLowerCase();
    const lowerCountryName = city.countryName.toLowerCase();

    const isPrefixCity = lowerCityName.startsWith(lowerQuery);
    const isSubstrCity = lowerCityName.includes(lowerQuery);
    const isCountry = lowerCountryName.includes(lowerQuery);

    if (isPrefixCity || isSubstrCity || isCountry) {
      cityMatches.set(city.citySlug, {
        id: `city-${city.citySlug}`,
        type: "city",
        title: `${city.cityName} (Any)`,
        subtitle: city.countryName,
        iata: city.primaryIata,
        cityName: city.cityName,
        citySlug: city.citySlug,
        countryName: city.countryName,
        countryIso2: city.countryIso2,
        latitude: city.latitude,
        longitude: city.longitude,
      });
    }
  }

  // Match airports
  for (const airport of AIRPORTS_CATALOG) {
    const lowerAirportName = airport.name.toLowerCase();
    const lowerCityName = airport.cityName.toLowerCase();
    const lowerCountryName = airport.countryName.toLowerCase();

    const isIataPrefix = airport.iata.toUpperCase().startsWith(upperQuery);
    const isCityPrefix = lowerCityName.startsWith(lowerQuery);
    const isAirportPrefix = lowerAirportName.startsWith(lowerQuery);
    const isSubstr =
      lowerCityName.includes(lowerQuery) ||
      lowerAirportName.includes(lowerQuery) ||
      lowerCountryName.includes(lowerQuery);

    if (isIataPrefix || isCityPrefix || isAirportPrefix || isSubstr) {
      airportMatches.push({
        id: `airport-${airport.iata}`,
        type: "airport",
        title: `${airport.name} (${airport.iata})`,
        subtitle: airport.countryName,
        iata: airport.iata,
        cityName: airport.cityName,
        citySlug: airport.citySlug,
        airportName: airport.name,
        countryName: airport.countryName,
        countryIso2: airport.countryIso2,
        latitude: airport.latitude,
        longitude: airport.longitude,
      });
    }
  }

  // Sort matched items: exact IATA matches first, then prefix matches, then alphabetical
  airportMatches.sort((a, b) => {
    const aIataExact = a.iata?.toUpperCase() === upperQuery;
    const bIataExact = b.iata?.toUpperCase() === upperQuery;
    if (aIataExact && !bIataExact) return -1;
    if (!aIataExact && bIataExact) return 1;

    const aCityPrefix = a.cityName.toLowerCase().startsWith(lowerQuery);
    const bCityPrefix = b.cityName.toLowerCase().startsWith(lowerQuery);
    if (aCityPrefix && !bCityPrefix) return -1;
    if (!aCityPrefix && bCityPrefix) return 1;

    const aAirportPrefix = a.title.toLowerCase().startsWith(lowerQuery);
    const bAirportPrefix = b.title.toLowerCase().startsWith(lowerQuery);
    if (aAirportPrefix && !bAirportPrefix) return -1;
    if (!aAirportPrefix && bAirportPrefix) return 1;

    return a.title.localeCompare(b.title);
  });

  const combined: LocationSuggestionItem[] = [];

  // If a city has multiple airports and matches query, include the city item first
  for (const [slug, cityItem] of cityMatches.entries()) {
    const city = CITIES_CATALOG.find((c) => c.citySlug === slug);
    if (city && city.airportCount > 1) {
      combined.push(cityItem);
    }
  }

  // Add individual airport matches
  for (const item of airportMatches) {
    if (combined.length >= limit) break;
    if (!combined.some((c) => c.id === item.id)) {
      combined.push(item);
    }
  }

  // Add remaining city matches if space allows
  for (const cityItem of cityMatches.values()) {
    if (combined.length >= limit) break;
    if (!combined.some((c) => c.id === cityItem.id || c.citySlug === cityItem.citySlug)) {
      combined.push(cityItem);
    }
  }

  // Append quick actions at the end if requested
  if (includeQuickActions) {
    combined.push(...DEFAULT_QUICK_ACTIONS);
  }

  return combined;
}
