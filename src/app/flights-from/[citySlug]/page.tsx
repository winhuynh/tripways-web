import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCityPage } from "@/features/city-page/application/get-city-page";
import { CityPageScreen } from "@/features/city-page/presentation/city-page-screen";
import { searchRoutes } from "@/features/route-search/application/search-routes";
import {
  CITY_ROUTE_FILTER_FIELDS,
  parseRouteFilterQuery,
  serializeRouteSearchFilters,
  type RouteFilterQuery,
} from "@/features/route-search/domain/route-filter";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ citySlug: string }>; searchParams: Promise<RouteFilterQuery> };

async function load(slug: string) {
  try { return await getCityPage(slug); }
  catch (error) { if (error instanceof Error && error.message === "ERR_PAGE_NOT_FOUND") notFound(); throw error; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = await load((await params).citySlug);
  return { title: { absolute: model.seo.title }, description: model.seo.description };
}

export default async function Page({ params, searchParams }: Props) {
  const slug = (await params).citySlug;
  const filterValues = parseRouteFilterQuery(await searchParams, CITY_ROUTE_FILTER_FIELDS);
  const filters = { ...serializeRouteSearchFilters(filterValues, CITY_ROUTE_FILTER_FIELDS), max_stops: 0 };
  const [model, routes] = await Promise.all([
    load(slug),
    searchRoutes({ type: "origin_city", key: slug }, filters, filterValues.after ?? null),
  ]);
  return <CityPageScreen model={model} routes={routes} filterValues={filterValues} />;
}
