import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAirportPage } from "@/features/airport-page/application/get-airport-page";
import { AirportPageScreen } from "@/features/airport-page/presentation/airport-page-screen";
import type { JourneyType, TransportDirection } from "@/features/airport-page/domain/airport-page-model";
import { searchRoutes } from "@/features/route-search/application/search-routes";
import {
  AIRPORT_ROUTE_FILTER_FIELDS,
  parseRouteFilterQuery,
  serializeRouteSearchFilters,
  type RouteFilterQuery,
} from "@/features/route-search/domain/route-filter";

type Props = { params: Promise<{ airportSlug: string }>; searchParams: Promise<RouteFilterQuery> };
export const revalidate = 86400; // ISR: re-render at most once every 24 h

async function load(slug: string) {
  const code = slug.split("-").at(-1)?.toUpperCase();
  if (!code || !/^[A-Z0-9]{3}$/.test(code)) notFound();
  try { return await getAirportPage(code); }
  catch (error) { if (error instanceof Error && error.message === "ERR_PAGE_NOT_FOUND") notFound(); throw error; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = await load((await params).airportSlug);
  return { title: { absolute: model.seo.title }, description: model.seo.description, robots: model.provenance.dataVersion ? undefined : { index: false, follow: false } };
}

export default async function AirportPage({ params, searchParams }: Props) {
  const slug = (await params).airportSlug;
  const model = await load(slug);
  const query = await searchParams;
  const filterValues = parseRouteFilterQuery(query, AIRPORT_ROUTE_FILTER_FIELDS);
  const initialJourney: JourneyType = first(query.journey) === "departing" ? "departing" : "arriving";
  const transportDirection: TransportDirection = first(query.transport) === "to_airport"
    ? "to_airport"
    : "from_airport";
  const direction = filterValues.direction ?? "from";
  const filters = serializeRouteSearchFilters(filterValues, AIRPORT_ROUTE_FILTER_FIELDS);
  const routes = await searchRoutes(
    { type: "airport", key: model.airport.iata, direction },
    filters,
    filterValues.after ?? null,
  );
  return <AirportPageScreen
    model={model}
    routes={routes}
    filterValues={filterValues}
    clearHref={`/airports/${slug}`}
    initialJourney={initialJourney}
    transportDirection={transportDirection}
  />;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
