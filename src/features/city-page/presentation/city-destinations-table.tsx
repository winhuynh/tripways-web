"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Link from "next/link";
import { getAirportDisplay } from "@/features/route-search/domain/route-filter-labels";
import { AirlineBadgeGroup, CountryFlag, getCountryFlagEmoji, getCountryIso2 } from "@/shared/ui";
import type { CityPageDestination } from "../domain/city-page-model";

export function getCountryFlag(countryName: string, explicitIso2?: string): string {
  const iso2 = getCountryIso2(countryName, explicitIso2);
  return iso2 ? getCountryFlagEmoji(iso2) : "🌐";
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}



type CityDestinationsTableProps = {
  cityName: string;
  originCountry?: string;
  originCountryCode?: string;
  originAirports?: readonly string[];
  destinations: readonly CityPageDestination[];
  totalCount?: number;
  clearHref?: string;
};

export function CityDestinationsTable({
  cityName,
  originCountry,
  originCountryCode,
  originAirports,
  destinations,
  totalCount,
  clearHref,
}: CityDestinationsTableProps) {
  const [collapsedCountries, setCollapsedCountries] = useState<Record<string, boolean>>({});

  // Detect whether origin city has multiple departure airports
  const isMultiAirportOrigin = useMemo(() => {
    if (originAirports && originAirports.length > 1) return true;
    const originSet = new Set<string>();
    for (const d of destinations) {
      for (const a of d.originAirports) originSet.add(a);
    }
    return originSet.size > 1;
  }, [originAirports, destinations]);

  // Group destinations by Country & sort intra-group
  const countryGroups = useMemo(() => {
    const map = new Map<string, CityPageDestination[]>();
    for (const d of destinations) {
      const list = map.get(d.country) ?? [];
      list.push(d);
      map.set(d.country, list);
    }

    const groups = Array.from(map.entries()).map(([country, dests]) => {
      const countryCode = dests.find((d) => d.countryCode)?.countryCode;
      const isDomestic =
        Boolean(originCountry && country.toLowerCase() === originCountry.toLowerCase()) ||
        Boolean(
          originCountryCode &&
            countryCode &&
            countryCode.toLowerCase() === originCountryCode.toLowerCase(),
        );
      let minFare: number | undefined = undefined;
      let currency = "£";
      for (const d of dests) {
        if (typeof d.fareMin === "number") {
          if (minFare === undefined || d.fareMin < minFare) {
            minFare = d.fareMin;
            if (d.fareCurrency) currency = d.fareCurrency;
          }
        }
      }

      // Intra-group sorting: top routes first, then high frequency, then lowest fare
      const sortedDests = [...dests].sort((a, b) => {
        if (a.isTopRoute && !b.isTopRoute) return -1;
        if (!a.isTopRoute && b.isTopRoute) return 1;
        const freqA = a.frequency ?? 0;
        const freqB = b.frequency ?? 0;
        if (freqB !== freqA) return freqB - freqA;
        const fareA = a.fareMin ?? 999999;
        const fareB = b.fareMin ?? 999999;
        if (fareA !== fareB) return fareA - fareB;
        return a.city.localeCompare(b.city);
      });

      return {
        country,
        countryCode,
        flag: getCountryFlag(country, countryCode),
        isDomestic,
        destinations: sortedDests,
        minFare,
        currency,
      };
    });

    return groups.sort((a, b) => {
      if (a.isDomestic && !b.isDomestic) return -1;
      if (!a.isDomestic && b.isDomestic) return 1;
      if (b.destinations.length !== a.destinations.length) {
        return b.destinations.length - a.destinations.length;
      }
      return a.country.localeCompare(b.country);
    });
  }, [destinations, originCountry, originCountryCode]);

  // Progressive disclosure: top 3 countries open by default, rest collapsed
  function isGroupCollapsed(country: string, index: number): boolean {
    if (collapsedCountries[country] !== undefined) {
      return collapsedCountries[country];
    }
    return index >= 3;
  }

  function toggleCountry(country: string, index: number) {
    const current = isGroupCollapsed(country, index);
    setCollapsedCountries((prev) => ({
      ...prev,
      [country]: !current,
    }));
  }

  function toggleAll(expand: boolean) {
    const next: Record<string, boolean> = {};
    for (const g of countryGroups) {
      next[g.country] = !expand;
    }
    setCollapsedCountries(next);
  }

  const displayTotal = totalCount ?? destinations.length;

  function renderScheduleCell(dest: CityPageDestination) {
    const durationText = formatDuration(dest.minDuration);
    const freq = dest.frequency;

    let freqBadge = null;
    if (typeof freq === "number" && freq >= 7) {
      freqBadge = (
        <span className="city-freq-badge city-freq-badge--daily" title={`${freq} flights per week`}>
          <span className="city-freq-dot" aria-hidden="true" />
          Daily direct
        </span>
      );
    } else if (typeof freq === "number" && freq >= 3) {
      freqBadge = (
        <span className="city-freq-badge city-freq-badge--regular">
          {freq} flights/wk
        </span>
      );
    } else if (typeof freq === "number" && freq > 0) {
      freqBadge = (
        <span className="city-freq-badge city-freq-badge--limited">
          ⚡ {freq} {freq === 1 ? "flight/wk" : "flights/wk"}
        </span>
      );
    } else {
      freqBadge = <span className="city-freq-text">Regular schedule</span>;
    }

    return (
      <div className="city-schedule-group">
        <span className="city-duration">{durationText}</span>
        {freqBadge}
      </div>
    );
  }

  function renderFareAndBookingCell(dest: CityPageDestination) {
    const currency = dest.fareCurrency ?? "£";
    const hasFare = typeof dest.fareMin === "number";

    return (
      <div className="city-fare-booking-cluster">
        <div className="city-fare-price-wrap">
          {hasFare ? (
            <>
              <span className="city-fare-price">From {currency}{dest.fareMin}</span>
              <small className="city-fare-sub">Est. one-way</small>
            </>
          ) : (
            <span className="city-fare-sub">Flight guide</span>
          )}
        </div>
        <Link
          href={dest.path}
          className="city-dest-cta city-dest-cta--primary"
          aria-label={`View flights from ${cityName} to ${dest.city}`}
        >
          View flights →
        </Link>
      </div>
    );
  }

  function renderDestinationRow(dest: CityPageDestination) {
    const airportLabels = Array.from(new Set(dest.airports))
      .map((code) => getAirportDisplay(code))
      .join(", ");

    return (
      <tr key={`${dest.path}:${dest.originAirports.join(",")}:${dest.airports.join(",")}`}>
        <td className="city-dest-col">
          <Link
            href={dest.path}
            className="city-dest-link"
            title={`Direct flights from ${cityName} to ${dest.city}`}
          >
            <strong className="city-dest-name">{dest.city}</strong>
            <small className="city-dest-airports">{airportLabels}</small>
          </Link>
        </td>
        {isMultiAirportOrigin && (
          <td className="city-origin-col">
            <div className="city-origin-badges">
              {Array.from(new Set(dest.originAirports)).map((iata) => (
                <span key={iata} className="city-origin-badge" title={getAirportDisplay(iata)}>
                  {iata}
                </span>
              ))}
            </div>
          </td>
        )}
        <td className="city-schedule-col">
          {renderScheduleCell(dest)}
        </td>
        <td className="city-airlines-col">
          <AirlineBadgeGroup
            airlines={dest.airlines}
            size={18}
            textClassName="city-airlines-text"
          />
        </td>
        <td className="city-action-col">
          {renderFareAndBookingCell(dest)}
        </td>
      </tr>
    );
  }

  return (
    <div className="city-destinations-section">
      {/* 1. Header & Controls */}
      <div className="city-table-header">
        <div>
          <h2 className="city-table-title">Nonstop destinations from {cityName}</h2>
          <span className="city-table-count">
            Showing {destinations.length} nonstop route {destinations.length === 1 ? "option" : "options"}
            {" · "}{displayTotal} {displayTotal === 1 ? "destination" : "destinations"} in total
          </span>
        </div>

        {countryGroups.length > 1 && (
          <div className="city-table-controls">
            <button
              type="button"
              className="city-table-toggle-btn"
              onClick={() => toggleAll(true)}
            >
              Expand all
            </button>
            <span className="city-table-toggle-sep" aria-hidden="true">·</span>
            <button
              type="button"
              className="city-table-toggle-btn"
              onClick={() => toggleAll(false)}
            >
              Collapse all
            </button>
          </div>
        )}
      </div>

      {/* 2. Grouped by Country */}
      {destinations.length === 0 ? (
        <div className="city-table-empty">
          <p className="city-table-empty-lead">No nonstop destinations match your active filters.</p>
          {clearHref && (
            <a href={clearHref} className="city-table-empty-reset-btn">
              Reset all filters
            </a>
          )}
        </div>
      ) : (
        <div className="city-grouped-countries">
          {countryGroups.map((group, index) => {
            const isCollapsed = isGroupCollapsed(group.country, index);
            const domesticLabel = group.isDomestic ? " (Domestic)" : "";
            const countText = `${group.destinations.length} ${
              group.destinations.length === 1 ? "route" : "routes"
            }`;
            const fareBadge =
              typeof group.minFare === "number"
                ? `Fares from ${group.currency}${group.minFare}`
                : null;

            return (
              <div key={group.country} className="city-country-accordion">
                <button
                  type="button"
                  className="city-country-header"
                  onClick={() => toggleCountry(group.country, index)}
                  aria-expanded={!isCollapsed}
                >
                  <div className="city-country-header-left">
                    <span className="city-country-chevron" aria-hidden="true">
                      {isCollapsed ? "▶" : "▼"}
                    </span>
                    <span className="city-country-flag">
                      <CountryFlag countryName={group.country} countryCode={group.countryCode} size="md" />
                    </span>
                    <h3 className="city-country-title">
                      {group.country}
                      {domesticLabel && (
                        <span className="city-country-domestic-tag">{domesticLabel}</span>
                      )}
                    </h3>
                    <span className="city-country-count-badge">{countText}</span>
                  </div>
                  {fareBadge && (
                    <div className="city-country-fare-badge">
                      <span>{fareBadge}</span>
                    </div>
                  )}
                </button>

                {!isCollapsed && (
                  <div className="city-table-wrap city-table-wrap--grouped">
                    <table className="city-destinations-table">
                      <thead>
                        <tr>
                          <th>DESTINATION</th>
                          {isMultiAirportOrigin && <th>DEPARTS FROM</th>}
                          <th>FLIGHT SCHEDULE</th>
                          <th>AIRLINES</th>
                          <th>FARE &amp; FLIGHTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.destinations.map((dest) => renderDestinationRow(dest))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Provenance Disclaimer */}
      <p className="city-table-disclaimer">
        Estimated schedules and fares for direct flights only. Actual seat availability, live prices, and seasonal timetables are confirmed upon partner handoff.
      </p>
    </div>
  );
}
