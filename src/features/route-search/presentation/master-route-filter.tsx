"use client";

import type { FormEvent } from "react";
import type { Facet, RouteSearchModel } from "../domain/route-search-model";
import {
  serializeNonEmptyFilterEntries,
  serializeRouteFilterQuery,
  type RouteFilterField,
  type RouteFilterValues,
} from "../domain/route-filter";
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
  fields, values, facets, departureAirports = [], clearHref, nextCursor, airportCode,
  heading = "Filter routes",
}: Props) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = serializeNonEmptyFilterEntries(new FormData(event.currentTarget).entries());
    window.location.assign(query ? `${clearHref}?${query}` : clearHref);
  }

  return <aside className="master-filter">
    <h2>{heading}</h2>
    <form action={clearHref} method="get" onSubmit={submit}>
      {fields.map((field) => <FilterField
        key={field}
        field={field}
        values={values}
        facets={facets}
        departureAirports={departureAirports}
        airportCode={airportCode}
      />)}
      <div className="master-filter__actions">
        <button type="submit">Apply filters</button>
        <a href={clearHref}>Clear filters</a>
      </div>
    </form>
    {nextCursor ? <a className="master-filter__next" href={`${clearHref}?${serializeRouteFilterQuery(values, nextCursor)}`}>Next page</a> : null}
  </aside>;
}

function FilterField({ field, values, facets, departureAirports, airportCode }: Readonly<{
  field: RouteFilterField;
  values: RouteFilterValues;
  facets: RouteSearchModel["facets"];
  departureAirports: string[];
  airportCode?: string;
}>) {
  switch (field) {
    case "direction":
      return <label>Direction<select name="direction" defaultValue={values.direction ?? "from"}><option value="from">From {airportCode}</option><option value="to">To {airportCode}</option></select></label>;
    case "counterpart_query":
      return <label>City or airport<input name="counterpart_query" maxLength={80} defaultValue={values.counterpart_query ?? ""} placeholder="City or airport" /></label>;
    case "departure_airports":
      return <label>Departure airport<select name="departure_airports" defaultValue={values.departure_airports?.[0] ?? ""}><option value="">All airports</option>{departureAirports.map((code) => <option key={code} value={code}>{code}</option>)}</select></label>;
    case "destination_countries":
      return <FacetChoices legend="Destination country" name={field} facets={facets.countries} selected={values.destination_countries} />;
    case "counterpart_countries":
      return <FacetChoices legend="Country" name={field} facets={facets.countries} selected={values.counterpart_countries} />;
    case "destination_regions":
      return <FacetChoices legend="Destination region" name={field} facets={facets.regions} selected={values.destination_regions} />;
    case "counterpart_regions":
      return <FacetChoices legend="Region" name={field} facets={facets.regions} selected={values.counterpart_regions} />;
    case "airlines":
      return <FacetChoices legend="Airline" name={field} facets={facets.airlines} selected={values.airlines} />;
    case "connection_airports":
      return <FacetChoices legend="Connection airport" name={field} facets={facets.connections} selected={values.connection_airports} />;
    case "departure_time_buckets":
      return <FacetChoices legend="Departure time" name={field} facets={[
        { value: "early_morning", count: 0 }, { value: "morning", count: 0 },
        { value: "afternoon", count: 0 }, { value: "evening", count: 0 },
      ]} selected={values.departure_time_buckets} hideZeroCount />;
    case "route_type":
      return <label>Route type<select name="route_type" defaultValue={values.route_type ?? "all"}><option value="all">All routes</option><option value="domestic">Domestic</option><option value="international">International</option></select></label>;
    case "max_stops":
      return <label>Stops<select name="max_stops" defaultValue={String(values.max_stops ?? 3)}><option value="3">Up to 3 stops</option><option value="0">Nonstop</option><option value="1">Up to 1 stop</option><option value="2">Up to 2 stops</option></select></label>;
    case "max_duration_minutes":
      return <label>Maximum duration (minutes)<input name="max_duration_minutes" type="number" min={1} max={10080} defaultValue={values.max_duration_minutes} /></label>;
    case "max_layover_minutes":
      return <label>Maximum layover (minutes)<input name="max_layover_minutes" type="number" min={1} max={1440} defaultValue={values.max_layover_minutes} /></label>;
    case "max_one_way_fare":
      return <label>Max one-way fare<input name="max_one_way_fare" type="number" min={1} max={100000} defaultValue={values.max_one_way_fare} placeholder="Max price" /></label>;
  }
}

function FacetChoices({ legend, name, facets, selected = [], hideZeroCount = false }: Readonly<{
  legend: string;
  name: string;
  facets: Facet[];
  selected?: readonly string[];
  hideZeroCount?: boolean;
}>) {
  return <fieldset><legend>{legend}</legend><div className="master-filter__choices">{facets.map((facet) => <label key={facet.value}><input type="checkbox" name={name} value={facet.value} defaultChecked={selected.includes(facet.value)} /><span>{humanize(facet.value)}{hideZeroCount ? "" : ` (${facet.count})`}</span></label>)}</div></fieldset>;
}

function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
