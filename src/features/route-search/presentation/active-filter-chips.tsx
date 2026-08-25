import Link from "next/link";
import {
  serializeRouteFilterQuery,
  type RouteFilterValues,
} from "../domain/route-filter";
import {
  formatDurationMinutes,
  formatStopsLabel,
  formatTimeBucketLabel,
  getAirlineDisplay,
  getAirportDisplay,
  getCountryDisplay,
  getRegionDisplay,
} from "../domain/route-filter-labels";

export type ChipItem = Readonly<{
  id: string;
  label: string;
  href: string;
}>;

export function buildActiveFilterChips(
  values: RouteFilterValues,
  clearHref: string,
): ChipItem[] {
  const chips: ChipItem[] = [];

  // 1. Departure airports
  if (values.departure_airports?.length) {
    for (const code of values.departure_airports) {
      const nextValues = {
        ...values,
        departure_airports: values.departure_airports.filter((c) => c !== code),
      };
      const query = serializeRouteFilterQuery(nextValues);
      chips.push({
        id: `departure_airports:${code}`,
        label: `From: ${getAirportDisplay(code)}`,
        href: query ? `${clearHref}?${query}` : clearHref,
      });
    }
  }

  // 2. Destination countries
  if (values.destination_countries?.length) {
    for (const code of values.destination_countries) {
      const nextValues = {
        ...values,
        destination_countries: values.destination_countries.filter((c) => c !== code),
      };
      const query = serializeRouteFilterQuery(nextValues);
      chips.push({
        id: `destination_countries:${code}`,
        label: `To: ${getCountryDisplay(code)}`,
        href: query ? `${clearHref}?${query}` : clearHref,
      });
    }
  }

  // 3. Destination regions
  if (values.destination_regions?.length) {
    for (const code of values.destination_regions) {
      const nextValues = {
        ...values,
        destination_regions: values.destination_regions.filter((c) => c !== code),
      };
      const query = serializeRouteFilterQuery(nextValues);
      chips.push({
        id: `destination_regions:${code}`,
        label: `Region: ${getRegionDisplay(code)}`,
        href: query ? `${clearHref}?${query}` : clearHref,
      });
    }
  }

  // 4. Counterpart countries
  if (values.counterpart_countries?.length) {
    for (const code of values.counterpart_countries) {
      const nextValues = {
        ...values,
        counterpart_countries: values.counterpart_countries.filter((c) => c !== code),
      };
      const query = serializeRouteFilterQuery(nextValues);
      chips.push({
        id: `counterpart_countries:${code}`,
        label: `Country: ${getCountryDisplay(code)}`,
        href: query ? `${clearHref}?${query}` : clearHref,
      });
    }
  }

  // 5. Counterpart regions
  if (values.counterpart_regions?.length) {
    for (const code of values.counterpart_regions) {
      const nextValues = {
        ...values,
        counterpart_regions: values.counterpart_regions.filter((c) => c !== code),
      };
      const query = serializeRouteFilterQuery(nextValues);
      chips.push({
        id: `counterpart_regions:${code}`,
        label: `Region: ${getRegionDisplay(code)}`,
        href: query ? `${clearHref}?${query}` : clearHref,
      });
    }
  }

  // 6. Airlines
  if (values.airlines?.length) {
    for (const code of values.airlines) {
      const nextValues = {
        ...values,
        airlines: values.airlines.filter((c) => c !== code),
      };
      const query = serializeRouteFilterQuery(nextValues);
      chips.push({
        id: `airlines:${code}`,
        label: getAirlineDisplay(code),
        href: query ? `${clearHref}?${query}` : clearHref,
      });
    }
  }

  // 7. Connection airports
  if (values.connection_airports?.length) {
    for (const code of values.connection_airports) {
      const nextValues = {
        ...values,
        connection_airports: values.connection_airports.filter((c) => c !== code),
      };
      const query = serializeRouteFilterQuery(nextValues);
      chips.push({
        id: `connection_airports:${code}`,
        label: `Via: ${getAirportDisplay(code)}`,
        href: query ? `${clearHref}?${query}` : clearHref,
      });
    }
  }

  // 8. Departure time buckets
  if (values.departure_time_buckets?.length) {
    for (const bucket of values.departure_time_buckets) {
      const nextValues = {
        ...values,
        departure_time_buckets: values.departure_time_buckets.filter((b) => b !== bucket),
      };
      const query = serializeRouteFilterQuery(nextValues);
      chips.push({
        id: `departure_time_buckets:${bucket}`,
        label: formatTimeBucketLabel(bucket),
        href: query ? `${clearHref}?${query}` : clearHref,
      });
    }
  }

  // 9. Stops
  if (values.max_stops !== undefined && values.max_stops < 3) {
    const nextValues = { ...values };
    delete nextValues.max_stops;
    const query = serializeRouteFilterQuery(nextValues);
    chips.push({
      id: "max_stops",
      label: formatStopsLabel(values.max_stops),
      href: query ? `${clearHref}?${query}` : clearHref,
    });
  }

  // 10. Route type
  if (values.route_type && values.route_type !== "all") {
    const nextValues = { ...values };
    delete nextValues.route_type;
    const query = serializeRouteFilterQuery(nextValues);
    chips.push({
      id: "route_type",
      label: values.route_type === "domestic" ? "Domestic only" : "International only",
      href: query ? `${clearHref}?${query}` : clearHref,
    });
  }

  // 11. Max duration
  if (values.max_duration_minutes !== undefined) {
    const nextValues = { ...values };
    delete nextValues.max_duration_minutes;
    const query = serializeRouteFilterQuery(nextValues);
    chips.push({
      id: "max_duration_minutes",
      label: `≤ ${formatDurationMinutes(values.max_duration_minutes)} duration`,
      href: query ? `${clearHref}?${query}` : clearHref,
    });
  }

  // 12. Max layover
  if (values.max_layover_minutes !== undefined) {
    const nextValues = { ...values };
    delete nextValues.max_layover_minutes;
    const query = serializeRouteFilterQuery(nextValues);
    chips.push({
      id: "max_layover_minutes",
      label: `≤ ${formatDurationMinutes(values.max_layover_minutes)} layover`,
      href: query ? `${clearHref}?${query}` : clearHref,
    });
  }

  // 13. Max fare
  if (values.max_one_way_fare !== undefined) {
    const nextValues = { ...values };
    delete nextValues.max_one_way_fare;
    const query = serializeRouteFilterQuery(nextValues);
    chips.push({
      id: "max_one_way_fare",
      label: `≤ $${values.max_one_way_fare}`,
      href: query ? `${clearHref}?${query}` : clearHref,
    });
  }

  // 14. Counterpart query
  if (values.counterpart_query) {
    const nextValues = { ...values };
    delete nextValues.counterpart_query;
    const query = serializeRouteFilterQuery(nextValues);
    chips.push({
      id: "counterpart_query",
      label: `Match: "${values.counterpart_query}"`,
      href: query ? `${clearHref}?${query}` : clearHref,
    });
  }

  return chips;
}

export function ActiveFilterChips({
  values,
  clearHref,
}: {
  values?: RouteFilterValues;
  clearHref?: string;
}) {
  if (!values || !clearHref) return null;
  const chips = buildActiveFilterChips(values, clearHref);
  if (chips.length === 0) return null;

  return (
    <div className="active-filter-chips" aria-label="Active filters">
      <span className="active-filter-chips__title">Active filters:</span>
      <div className="active-filter-chips__list">
        {chips.map((chip) => (
          <Link
            key={chip.id}
            href={chip.href}
            className="active-filter-chip"
            title={`Remove ${chip.label}`}
          >
            <span>{chip.label}</span>
            <span className="active-filter-chip__remove" aria-hidden="true">
              ✕
            </span>
          </Link>
        ))}
        <Link href={clearHref} className="active-filter-chips__clear-all">
          Clear all
        </Link>
      </div>
    </div>
  );
}
