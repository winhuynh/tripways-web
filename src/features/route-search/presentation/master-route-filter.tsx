"use client";

import { useId, useState, type FormEvent } from "react";
import type { Facet, RouteSearchModel } from "../domain/route-search-model";
import {
  serializeNonEmptyFilterEntries,
  serializeRouteFilterQuery,
  type RouteFilterField,
  type RouteFilterValues,
} from "../domain/route-filter";
import {
  formatDurationMinutes,
  formatTimeBucketLabel,
  getAirlineDisplay,
  getAirportDetailedDisplay,
  getAirportDisplay,
  getCountryDisplay,
  getRegionDisplay,
} from "../domain/route-filter-labels";
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
    const query = serializeNonEmptyFilterEntries(new FormData(event.currentTarget).entries());
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
          <span className="master-filter__mobile-icon" aria-hidden="true">⚙️</span>
          <span>Filters</span>
          {activeCount > 0 ? (
            <span className="master-filter__mobile-badge">{activeCount}</span>
          ) : null}
        </button>
      </div>

      <aside className={`master-filter ${isMobileOpen ? "master-filter--open" : ""}`}>
        <div className="master-filter__header">
          <h2>{heading}</h2>
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
            Next page
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
        <label className="master-filter__field">
          <span className="master-filter__label-title">Direction</span>
          <select name="direction" defaultValue={values.direction ?? "from"}>
            <option value="from">
              From {airportCode ? getAirportDisplay(airportCode) : "here"}
            </option>
            <option value="to">
              To {airportCode ? getAirportDisplay(airportCode) : "here"}
            </option>
          </select>
        </label>
      );

    case "counterpart_query":
      return (
        <label className="master-filter__field">
          <span className="master-filter__label-title">City or airport</span>
          <input
            name="counterpart_query"
            maxLength={80}
            defaultValue={values.counterpart_query ?? ""}
            placeholder="e.g. Singapore, London, Tokyo"
          />
        </label>
      );

    case "departure_airports":
      return (
        <label className="master-filter__field">
          <span className="master-filter__label-title">Departure airport</span>
          <select name="departure_airports" defaultValue={values.departure_airports?.[0] ?? ""}>
            <option value="">All departure airports</option>
            {departureAirports.map((code) => (
              <option key={code} value={code}>
                {getAirportDetailedDisplay(code)}
              </option>
            ))}
          </select>
        </label>
      );

    case "destination_countries":
      return (
        <FacetChoices
          legend="Destination country"
          name={field}
          facets={facets.countries}
          selected={values.destination_countries}
          formatter={getCountryDisplay}
        />
      );

    case "counterpart_countries":
      return (
        <FacetChoices
          legend="Country"
          name={field}
          facets={facets.countries}
          selected={values.counterpart_countries}
          formatter={getCountryDisplay}
        />
      );

    case "destination_regions":
      return (
        <FacetChoices
          legend="Destination region"
          name={field}
          facets={facets.regions}
          selected={values.destination_regions}
          formatter={getRegionDisplay}
        />
      );

    case "counterpart_regions":
      return (
        <FacetChoices
          legend="Region"
          name={field}
          facets={facets.regions}
          selected={values.counterpart_regions}
          formatter={getRegionDisplay}
        />
      );

    case "airlines":
      return (
        <FacetChoices
          legend="Airline"
          name={field}
          facets={facets.airlines}
          selected={values.airlines}
          formatter={getAirlineDisplay}
        />
      );

    case "connection_airports":
      return (
        <FacetChoices
          legend="Connection airport"
          name={field}
          facets={facets.connections}
          selected={values.connection_airports}
          formatter={getAirportDisplay}
        />
      );

    case "departure_time_buckets":
      return (
        <FacetChoices
          legend="Departure time"
          name={field}
          facets={[
            { value: "early_morning", count: 0 },
            { value: "morning", count: 0 },
            { value: "afternoon", count: 0 },
            { value: "evening", count: 0 },
          ]}
          selected={values.departure_time_buckets}
          formatter={formatTimeBucketLabel}
          hideZeroCount
        />
      );

    case "route_type":
      return (
        <label className="master-filter__field">
          <span className="master-filter__label-title">Route type</span>
          <select name="route_type" defaultValue={values.route_type ?? "all"}>
            <option value="all">All routes</option>
            <option value="domestic">Domestic only</option>
            <option value="international">International only</option>
          </select>
        </label>
      );

    case "max_stops":
      return (
        <label className="master-filter__field">
          <span className="master-filter__label-title">Stops</span>
          <select name="max_stops" defaultValue={String(values.max_stops ?? 3)}>
            <option value="3">Any number of stops (up to 3)</option>
            <option value="0">Nonstop only</option>
            <option value="1">Up to 1 stop</option>
            <option value="2">Up to 2 stops</option>
          </select>
        </label>
      );

    case "max_duration_minutes":
      return (
        <DurationSlider
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
        <DurationSlider
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
        <label className="master-filter__field">
          <span className="master-filter__label-title">Maximum one-way fare (USD)</span>
          <input
            name="max_one_way_fare"
            type="number"
            min={1}
            max={100000}
            defaultValue={values.max_one_way_fare}
            placeholder="e.g. 250"
          />
        </label>
      );
  }
}

function DurationSlider({
  name,
  label,
  min,
  max,
  step,
  initialValue,
}: Readonly<{
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  initialValue?: number;
}>) {
  const [val, setVal] = useState<number | undefined>(initialValue);

  return (
    <div className="master-filter__slider-field">
      <div className="master-filter__slider-header">
        <label htmlFor={name} className="master-filter__label-title">
          {label}
        </label>
        <span className="master-filter__slider-badge">
          {val ? `≤ ${formatDurationMinutes(val)}` : "Any duration"}
        </span>
      </div>
      <input
        id={name}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={val ?? max}
        onChange={(e) => setVal(Number(e.target.value))}
      />
      <div className="master-filter__slider-ticks">
        <span>{formatDurationMinutes(min)}</span>
        <span>{formatDurationMinutes(max)}</span>
      </div>
    </div>
  );
}

function FacetChoices({
  legend,
  name,
  facets,
  selected = [],
  formatter,
  hideZeroCount = false,
}: Readonly<{
  legend: string;
  name: string;
  facets: Facet[];
  selected?: readonly string[];
  formatter?: (val: string) => string;
  hideZeroCount?: boolean;
}>) {
  const [search, setSearch] = useState("");
  const searchId = useId();

  const filteredFacets = facets.filter((facet) => {
    if (!search.trim()) return true;
    const label = formatter ? formatter(facet.value) : facet.value;
    return (
      label.toLowerCase().includes(search.toLowerCase()) ||
      facet.value.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <fieldset className="master-filter__fieldset">
      <legend>{legend}</legend>
      {facets.length > 5 ? (
        <div className="master-filter__facet-search">
          <input
            id={searchId}
            type="search"
            placeholder={`Search ${legend.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={`Search ${legend}`}
          />
        </div>
      ) : null}
      <div className="master-filter__choices">
        {filteredFacets.length === 0 ? (
          <p className="master-filter__no-facet">No options match &quot;{search}&quot;</p>
        ) : (
          filteredFacets.map((facet) => {
            const labelText = formatter ? formatter(facet.value) : facet.value;
            return (
              <label key={facet.value} className="master-filter__choice-label">
                <input
                  type="checkbox"
                  name={name}
                  value={facet.value}
                  defaultChecked={selected.includes(facet.value)}
                />
                <span>
                  {labelText}
                  {hideZeroCount ? "" : ` (${facet.count})`}
                </span>
              </label>
            );
          })
        )}
      </div>
    </fieldset>
  );
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
