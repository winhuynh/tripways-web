import type { RouteFilterValues } from "@/features/route-search/domain/route-filter";
import { COUNTRY_NAMES } from "@/features/route-search/domain/route-filter-labels";
import type { CityPageDestination } from "./city-page-model";

/**
 * Filters city destinations according to the active RouteFilterValues.
 * Ensures the Map and Destination Table reflect the exact filter state.
 */
export function filterCityDestinations(
  destinations: readonly CityPageDestination[],
  filterValues: RouteFilterValues,
  currentCountry: string,
): CityPageDestination[] {
  if (Object.keys(filterValues).length === 0) {
    return [...destinations];
  }

  return destinations.filter((dest) => {
    // 1. Departure airports
    if (
      filterValues.departure_airports?.length &&
      !dest.originAirports.some((iata) => filterValues.departure_airports?.includes(iata))
    ) {
      return false;
    }

    // 2. Destination countries
    if (filterValues.destination_countries?.length) {
      const matchesCountry = filterValues.destination_countries.some((c) => {
        const upper = c.toUpperCase();
        const fullCountry = COUNTRY_NAMES[upper]?.toLowerCase();
        const destCountry = dest.country.toLowerCase();
        return upper === destCountry.toUpperCase() || fullCountry === destCountry;
      });
      if (!matchesCountry) return false;
    }

    // 3. Destination regions
    if (filterValues.destination_regions?.length && dest.region) {
      const matchesRegion = filterValues.destination_regions.some((r) => {
        const normFilter = r.toLowerCase().replaceAll("_", " ").replaceAll("-", " ");
        const normDest = dest.region?.toLowerCase().replaceAll("_", " ").replaceAll("-", " ");
        return normFilter === normDest || normDest?.includes(normFilter) || normFilter.includes(normDest ?? "");
      });
      if (!matchesRegion) return false;
    }

    // 4. Airlines
    if (
      filterValues.airlines?.length &&
      !dest.airlines.some((a) => filterValues.airlines?.includes(a.toUpperCase()))
    ) {
      return false;
    }

    // 5. Max duration minutes
    if (
      filterValues.max_duration_minutes !== undefined &&
      dest.minDuration > filterValues.max_duration_minutes
    ) {
      return false;
    }

    // 6. Max one way fare
    if (
      filterValues.max_one_way_fare !== undefined &&
      dest.fareMin !== undefined &&
      dest.fareMin > filterValues.max_one_way_fare
    ) {
      return false;
    }

    // 7. Route type (domestic vs international)
    if (filterValues.route_type === "domestic") {
      if (dest.country.toLowerCase() !== currentCountry.toLowerCase()) return false;
    } else if (filterValues.route_type === "international") {
      if (dest.country.toLowerCase() === currentCountry.toLowerCase()) return false;
    }

    return true;
  });
}
