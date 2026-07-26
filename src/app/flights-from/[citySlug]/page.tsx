import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CityPage,
  createCityPageIdentity,
  createCityPageMetadata,
  isCityPageNotFound,
} from "@/features/city-page";
import { cityPage } from "@/features/city-page/server";

type PageProps = {
  params: Promise<{ citySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Delegates dynamic City Hub metadata to the feature-owned SEO projection.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const identity = createCityPageIdentity((await params).citySlug);
  return createCityPageMetadata(identity);
}

/**
 * Resolves the required City Page overview before handing composition to the
 * feature. Missing identities become App Router not-found responses.
 */
export default async function CityPageRoute({ params, searchParams }: PageProps) {
  const identity = createCityPageIdentity((await params).citySlug);
  const filters = await searchParams;
  let overview;

  try {
    overview = await cityPage.getOverview(identity);
  } catch (error) {
    if (isCityPageNotFound(error)) notFound();
    throw error;
  }

  return (
    <CityPage filters={filters} identity={identity} overview={overview} />
  );
}
