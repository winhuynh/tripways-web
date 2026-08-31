"use client";

import { useState, type FormEvent } from "react";
import type { RouteSearchModel } from "../domain/route-search-model";
import {
  serializeNonEmptyFilterEntries,
  serializeRouteFilterQuery,
  type RouteFilterField,
  type RouteFilterValues,
} from "../domain/route-filter";
import {
  getAirlineDisplay,
  getAirportDetailedDisplay,
  getAirportDisplay,
  getCountryDisplay,
  getRegionDisplay,
} from "../domain/route-filter-labels";
import {
  ChoiceChipsRow,
  DaysOfWeekChipsRow,
  DurationSliderRow,
  FacetChoicesRow,
  FareInputRow,
  SearchInputRow,
  SegmentedTabRow,
  TimeBucketChipsRow,
} from "./rows";

import "./master-route-filter.css";

type Props = Readonly<{
  fields: readonly RouteFilterField[];
  values: RouteFilterValues;
  facets: RouteSearchModel["facets"];
  departureAirports?: string[];
  clearHref: string;
  nextCursor?: string | null;
  airportCode?: string;
  heading?: string;
}>;

export function MasterRouteFilter({
  fields,
  values,
  facets,
  departureAirports = [],
  clearHref,
  nextCursor,
  airportCode,
  heading = "Filter routes",
}: Props) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = serializeNonEmptyFilterEntries(
      new FormData(event.currentTarget).entries(),
    );
    setIsMobileOpen(false);
    window.location.assign(query ? `${clearHref}?${query}` : clearHref);
  }

  const activeCount = countActiveFilters(values);

  return (
    <>
      <div className="master-filter__mobile-bar">
        <button
          type="button"
          className="master-filter__mobile-trigger"
          onClick={() => setIsMobileOpen(true)}
          aria-expanded={isMobileOpen}
        >
          <span className="master-filter__mobile-icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </span>
          <span>Filters</span>
          {activeCount > 0 ? (
            <span className="master-filter__mobile-badge">{activeCount}</span>
          ) : null}
        </button>
      </div>

      <aside
        className={`master-filter ${isMobileOpen ? "master-filter--open" : ""}`}
      >
        <div className="master-filter__header">
          <h2>{heading}</h2>
          {activeCount > 0 && (
            <span className="master-filter__active-pill">
              {activeCount} active
            </span>
          )}
          <button
            type="button"
            className="master-filter__close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close filter drawer"
          >
            ✕
          </button>
        </div>

        <form action={clearHref} method="get" onSubmit={submit}>
          <div className="master-filter__body">
            {fields.map((field) => (
              <FilterField
                key={field}
                field={field}
                values={values}
                facets={facets}
                departureAirports={departureAirports}
                airportCode={airportCode}
              />
            ))}
          </div>

          <div className="master-filter__actions">
            <button type="submit" className="master-filter__apply-btn">
              Apply filters
            </button>
            <a href={clearHref} className="master-filter__clear-link">
              Clear filters
            </a>
          </div>
        </form>

        {nextCursor ? (
          <a
            className="master-filter__next"
            href={`${clearHref}?${serializeRouteFilterQuery(values, nextCursor)}`}
          >
            Next page →
          </a>
        ) : null}
      </aside>

      {isMobileOpen ? (
        <div
          className="master-filter__backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

function FilterField({
  field,
  values,
  facets,
  departureAirports,
  airportCode,
}: Readonly<{
  field: RouteFilterField;
  values: RouteFilterValues;
  facets: RouteSearchModel["facets"];
  departureAirports: string[];
  airportCode?: string;
}>) {
  switch (field) {
    case "direction":
      return (
        <SegmentedTabRow
          name="direction"
          label="Direction"
          options={[
            {
              value: "from",
              label: `From ${airportCode ? getAirportDisplay(airportCode) : "here"}`,
            },
            {
              value: "to",
              label: `To ${airportCode ? getAirportDisplay(airportCode) : "here"}`,
            },
          ]}
          defaultValue={values.direction ?? "from"}
        />
      );

    case "counterpart_query":
      return (
        <SearchInputRow
          name="counterpart_query"
          label="City or airport"
          placeholder="e.g. Singapore, London, Tokyo"
          defaultValue={values.counterpart_query ?? ""}
          maxLength={80}
        />
      );

    case "departure_airports":
      return (
        <SegmentedTabRow
          name="departure_airports"
          label="Departure airport"
          options={[
            { value: "", label: "All departure airports" },
            ...departureAirports.map((code) => ({
              value: code,
              label: getAirportDetailedDisplay(code),
            })),
          ]}
          defaultValue={values.departure_airports?.[0] ?? ""}
        />
      );

    case "destination_countries":
      return (
        <FacetChoicesRow
          legend="Destination country"
          name={field}
          facets={facets.countries}
          selected={values.destination_countries}
          formatter={getCountryDisplay}
        />
      );

    case "counterpart_countries":
      return (
        <FacetChoicesRow
          legend="Country"
          name={field}
          facets={facets.countries}
          selected={values.counterpart_countries}
          formatter={getCountryDisplay}
        />
      );

    case "destination_regions":
      return (
        <FacetChoicesRow
          legend="Destination region"
          name={field}
          facets={facets.regions}
          selected={values.destination_regions}
          formatter={getRegionDisplay}
        />
      );

    case "counterpart_regions":
      return (
        <FacetChoicesRow
          legend="Region"
          name={field}
          facets={facets.regions}
          selected={values.counterpart_regions}
          formatter={getRegionDisplay}
        />
      );

    case "airlines":
      return (
        <FacetChoicesRow
          legend="Airline"
          name={field}
          facets={facets.airlines}
          selected={values.airlines}
          formatter={getAirlineDisplay}
        />
      );

    case "connection_airports":
      return (
        <FacetChoicesRow
          legend="Connection airport"
          name={field}
          facets={facets.connections}
          selected={values.connection_airports}
          formatter={getAirportDisplay}
        />
      );

    case "departure_time_buckets":
      return (
        <TimeBucketChipsRow
          name={field}
          label="Departure time"
          selected={values.departure_time_buckets}
        />
      );

    case "days_of_week":
      return (
        <DaysOfWeekChipsRow
          name="days_of_week"
          label="Operating days"
          selected={values.days_of_week}
        />
      );

    case "route_type":
      return (
        <ChoiceChipsRow
          name="route_type"
          label="Route type"
          options={[
            { value: "all", label: "All routes" },
            { value: "domestic", label: "Domestic only" },
            { value: "international", label: "International only" },
          ]}
          defaultValue={values.route_type ?? "all"}
        />
      );

    case "max_stops":
      return (
        <ChoiceChipsRow
          name="max_stops"
          label="Stops"
          options={[
            { value: "3", label: "All (0 & 1 stop)" },
            { value: "0", label: "✈️ Nonstop only" },
            { value: "1", label: "🔄 1-stop via Hub" },
          ]}
          defaultValue={String(values.max_stops ?? 3)}
        />
      );


    case "max_duration_minutes":
      return (
        <DurationSliderRow
          name="max_duration_minutes"
          label="Maximum flight duration"
          min={60}
          max={1440}
          step={30}
          initialValue={values.max_duration_minutes}
        />
      );

    case "max_layover_minutes":
      return (
        <DurationSliderRow
          name="max_layover_minutes"
          label="Maximum layover time"
          min={30}
          max={720}
          step={30}
          initialValue={values.max_layover_minutes}
        />
      );

    case "max_one_way_fare":
      return (
        <FareInputRow
          name="max_one_way_fare"
          label="Maximum one-way fare (USD)"
          defaultValue={values.max_one_way_fare}
        />
      );
  }
}

function countActiveFilters(values: RouteFilterValues): number {
  let count = 0;
  for (const [key, value] of Object.entries(values)) {
    if (key === "after") continue;
    if (Array.isArray(value)) {
      count += value.length;
    } else if (value !== undefined && value !== "" && value !== "all") {
      count += 1;
    }
  }
  return count;
}
