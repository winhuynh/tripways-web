import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAirportPage } from "@/features/airport-page/application/get-airport-page";
import { AirportPageScreen } from "@/features/airport-page/presentation/airport-page-screen";
import { searchRoutes } from "@/features/route-search/application/search-routes";
import {
  AIRPORT_ROUTE_FILTER_FIELDS,
  parseRouteFilterQuery,
  serializeRouteSearchFilters,
  type RouteFilterQuery,
} from "@/features/route-search/domain/route-filter";

type Props = { params: Promise<{ airportSlug: string }>; searchParams: Promise<RouteFilterQuery> };
export const dynamic = "force-dynamic";

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
  const filterValues = parseRouteFilterQuery(await searchParams, AIRPORT_ROUTE_FILTER_FIELDS);
  const direction = filterValues.direction ?? "from";
  const filters = serializeRouteSearchFilters(filterValues, AIRPORT_ROUTE_FILTER_FIELDS);
  const routes = await searchRoutes(
    { type: "airport", key: model.airport.iata, direction },
    filters,
    filterValues.after ?? null,
  );
  return <AirportPageScreen model={model} routes={routes} filterValues={filterValues} clearHref={`/airports/${slug}`} />;
}
