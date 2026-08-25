import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRoutePage } from "@/features/route-page/application/get-route-page";
import { RoutePageScreen } from "@/features/route-page/presentation/route-page-screen";
import { searchRoutes } from "@/features/route-search/application/search-routes";
import {
  parseRouteFilterQuery,
  ROUTE_PAGE_FILTER_FIELDS,
  serializeRouteSearchFilters,
  type RouteFilterQuery,
} from "@/features/route-search/domain/route-filter";

export const revalidate = 86400; // ISR: re-render at most once every 24 h
type Props = {
  params: Promise<{ routeSlug: string }>;
  searchParams: Promise<RouteFilterQuery>;
};

async function load(slug: string) {
  try {
    return await getRoutePage(slug);
  } catch (error) {
    if (error instanceof Error && error.message === "ERR_PAGE_NOT_FOUND")
      notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = await load((await params).routeSlug);
  return {
    title: { absolute: model.seo.title },
    description: model.seo.description,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const model = await load((await params).routeSlug);
  const filterValues = parseRouteFilterQuery(
    await searchParams,
    ROUTE_PAGE_FILTER_FIELDS,
  );
  const filters = serializeRouteSearchFilters(
    filterValues,
    ROUTE_PAGE_FILTER_FIELDS,
  );
  const routes = await searchRoutes(
    {
      type: "city_pair",
      from: model.route.origin.slug,
      to: model.route.destination.slug,
    },
    filters,
    filterValues.after ?? null,
  );
  return (
    <RoutePageScreen
      model={model}
      routes={routes}
      filterValues={filterValues}
    />
  );
}
