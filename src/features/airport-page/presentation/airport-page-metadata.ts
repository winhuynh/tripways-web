import type { Metadata } from "next";

import type { AirportPageIdentity } from "../domain/models";
import { isAirportPageNotFound } from "../domain/airport-page-error";
import { airportPage } from "../server";

export async function createAirportPageMetadata(
  identity: AirportPageIdentity,
): Promise<Metadata> {
  try {
    const page = await airportPage.getPage(identity);
    return {
      title: page.seo.title,
      description: page.seo.description,
      alternates: { canonical: page.meta.canonicalPath },
      robots: page.meta.isIndexable
        ? { index: true, follow: true }
        : { index: false, follow: true },
      openGraph: {
        title: page.seo.ogTitle,
        description: page.seo.ogDescription,
        type: "website",
      },
    };
  } catch (error) {
    if (isAirportPageNotFound(error)) return {};
    return { title: "Airport routes | Tripways", robots: { index: false, follow: false } };
  }
}
