import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AirportPage,
  createAirportPageIdentity,
  createAirportPageMetadata,
  isAirportPageNotFound,
  parseAirportPageFilters,
} from "@/features/airport-page";
import { airportPage } from "@/features/airport-page/server";

type PageProps = {
  params: Promise<{ airportSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    return createAirportPageMetadata(
      createAirportPageIdentity((await params).airportSlug),
    );
  } catch {
    return {};
  }
}

export default async function AirportPageRoute({ params, searchParams }: PageProps) {
  let identity;
  try {
    identity = createAirportPageIdentity((await params).airportSlug);
  } catch {
    notFound();
  }
  const filters = parseAirportPageFilters(await searchParams);
  let model;
  let routes;

  try {
    [model, routes] = await Promise.all([
      airportPage.getPage(identity),
      airportPage.searchRoutes({ ...identity, ...filters }),
    ]);
  } catch (error) {
    if (isAirportPageNotFound(error)) notFound();
    throw error;
  }

  return <AirportPage filters={filters} model={model} routes={routes} />;
}
