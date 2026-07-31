import type { Metadata } from "next";

import type { CityPageIdentity } from "../domain/models";
import { isCityPageNotFound } from "../domain/city-page-error";
import { cityPage } from "../server";

/**
 * Loads the required City Page overview and projects its reviewed SEO fields
 * into Next.js metadata. Missing pages return empty metadata so the route can
 * complete its normal not-found flow.
 */
export async function createCityPageMetadata(
  identity: CityPageIdentity,
): Promise<Metadata> {
  try {
    const overview = await cityPage.getOverview(identity);

    return {
      title: overview.seo.title,
      description: overview.seo.description,
      alternates: { canonical: overview.seo.canonicalPath },
      robots: { index: false, follow: true },
      openGraph: {
        title: overview.seo.ogTitle,
        description: overview.seo.ogDescription,
        type: "website",
      },
    };
  } catch (error) {
    if (isCityPageNotFound(error)) return {};

    return {
      title: "City direct flights | Tripways",
      alternates: { canonical: `/flights-from/${identity.citySlug}` },
      robots: { index: false, follow: false },
    };
  }
}
